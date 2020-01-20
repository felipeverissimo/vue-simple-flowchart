<template>
  <div
    class="flowchart-container"
    @mousemove="handleMove"
    @mouseup="handleUp"
    @mousedown="handleDown"
  >
    <div class="tool-wrapper">
      <div
        class="config-tool"
        v-for="(item, index) in nodeCategory"
        :key="index"
        :value="index"
        @click="chosedNodes(item, index)"
      >
        <div
          class="button-decision"
          v-if="index == 0"
        >
          <div>✖</div>
        </div>

        <div
          class="button-decision"
          v-if="index == 1"
        >
          <div>🞅</div>
        </div>

        <div
          class="button-end"
          v-if="index == 2"
        ></div>

        <div
          class="button-end-workflow"
          v-if="index == 3"
        >
          <div></div>
        </div>
      </div>
    </div>

    <svg
      width="100%"
      :height="`${height}px`"
    >
      <flowchart-link
        v-bind.sync="link"
        :label="link.label"
        v-for="(link, index) in lines"
        :key="`link${index}`"
        :linking="action.linking"
        @deleteLink="linkDelete(link.id)"
        @changeLineLabel="linkLabel(link, $event)"
      ></flowchart-link>
    </svg>
    <flowchart-node
      v-bind.sync="node"
      v-for="(node, index) in scene.nodes"
      :key="`node${index}`"
      :options="nodeOptions"
      @linkingStart="linkingStart(node.id, node.type)"
      @linkingStop="linkingStop(node.id, node.type)"
      @nodeSelected="nodeSelected(node.id, $event)"
      @nodeTransition='nodeTransition()'
    >
    </flowchart-node>
  </div>
</template>

<script>
import FlowchartLink from "./FlowchartLink.vue";
import FlowchartNode from "./FlowchartNode.vue";
import { getMousePosition } from "../assets/utilty/position";

export default {
  name: "VueFlowchart",
  props: {
    nodesAction: {
      type: Object,
      default () {
        return {};
      }
    },
    scene: {
      type: Object,
      default () {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
          nodes: [],
          links: []
        };
      }
    },
    height: {
      type: Number,
      default: 400
    },
    horizontalStyle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newNodeType: 0,
      newNodeLabel: "",
      nodeCategory: ["Decision", "Join", "End", "EndWorkflow"],
      action: {
        linking: false,
        dragging: false,
        scrolling: false,
        selected: 0,
        transition: false,
      },
      item: {
        text: ""
      },
      mouse: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0
      },
      draggingLink: null,
      rootDivOffset: {
        top: 0,
        left: 0
      },
    };
  },
  components: {
    FlowchartLink,
    FlowchartNode
  },
  computed: {
    nodeOptions () {
      return {
        centerY: this.scene.centerY,
        centerX: this.scene.centerX,
        scale: this.scene.scale,
        offsetTop: this.rootDivOffset.top,
        offsetLeft: this.rootDivOffset.left,
        selected: this.action.selected,
        width: 400,
        transition: this.action.transition,
        horizontal: this.horizontalStyle,
      };
    },
    lines () {
      // this.scene.links.map(element => { });
      const lines = this.scene.links.map(link => {
        const fromNode = this.findNodeWithID(link.from);
        const toNode = this.findNodeWithID(link.to);
        // let labelLine = this
        let x, y, cy, cx, ex, ey;
        x = this.scene.centerX + fromNode.x;
        y = this.scene.centerY + fromNode.y;
        [cx, cy] = this.getPortPosition("bottom", x, y);
        x = this.scene.centerX + toNode.x;
        y = this.scene.centerY + toNode.y;
        [ex, ey] = this.getPortPosition("top", x, y);
        return {
          start: [cx, cy],
          end: [ex, ey],
          id: link.id,
          label: link.label,
          from: fromNode,
          horizontal: this.horizontalStyle,

        };
      });
      if (this.draggingLink) {
        let x, y, cy, cx;
        const fromNode = this.findNodeWithID(this.draggingLink.from);
        x = this.scene.centerX + fromNode.x;
        y = this.scene.centerY + fromNode.y;
        [cx, cy] = this.getPortPosition("bottom", x, y);
        // push temp dragging link, mouse cursor postion = link end postion

        lines.push({
          start: [cx, cy],
          end: [this.draggingLink.mx, this.draggingLink.my],
          label: "",
          horizontal: this.horizontalStyle,
        });
      }
      return lines;
    }
  },
  mounted () {
    this.rootDivOffset.top = this.$el ? this.$el.offsetTop : 0;
    this.rootDivOffset.left = this.$el ? this.$el.offsetLeft : 0;
    // console.log(22222, this.rootDivOffset);
  },
  methods: {
    linkLabel (link, payload) {
      const deletedLink = this.scene.links.find(item => {
        return item.id === link.id;
      });
      if (deletedLink) {
        deletedLink.label = payload;
      }
    },
    chosedNodes (item, index) {
      this.newNodeType = index;
      this.addNode();
    },
    addNode () {
      let maxID = this.scene.nodes.length;
      this.scene.nodes.push({
        id: maxID + 1,
        x: -400,
        y: 50,
        type: this.nodeCategory[this.newNodeType],
        label: this.newNodeLabel ? this.newNodeLabel : `test${maxID + 1}`
      });
    },
    findNodeWithID (id) {
      return this.scene.nodes.find(item => {
        return id === item.id;
      });
    },
    getPortPosition (type, x, y) {
      if (type === "top") {
        return [x + 40, y];
      } else if (type === "bottom") {
        return [x + 40, y + 80];
      }
    },
    linkingStart (index, type, ) {
      this.action.linking = true;

      this.draggingType = type
      this.draggingLink = {
        from: index,
        mx: 0,
        my: 0,
      };
    },
    linkingStop (index, type) {
      // add new Link
      if (this.draggingLink && this.draggingLink.from !== index) {
        // check link existence
        let existed = this.scene.links.find(link => {
          return link.from === this.draggingLink.from && link.to === index;
        });

        if (type === "Decision") {
          existed = this.scene.links.find(link => {
            return link.to === index;
          });
        }
        if (!existed) {
          let maxID = Math.max(
            0,
            ...this.scene.links.map(link => {
              return link.id;
            })
          );
          const newLink = {
            id: maxID + 1,
            from: this.draggingLink.from,
            to: index,
          };
          let findNodeFrom = this.scene.nodes.find(node => { return node.id === this.draggingLink.from; });
          let parentNodes = this.scene.links.map(element => { return element.from });
          let disabled = findNodeFrom.disabled;

          if (this.draggingType === "Start") {
            if (type === 'Action') {
              if (!disabled) {
                findNodeFrom['disabled'] = true
                this.scene.links.push(newLink);
                this.$emit("linkAdded", newLink);
              }
              else {
                this.$emit('not-allowed')
              }
            }
            else {
              this.$emit('not-allowed')
            }
          }
          if (this.draggingType === "Action") {
            if (!disabled) {
              findNodeFrom['disabled'] = true
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
            else if (disabled && type === "Action") {
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
            else {
              this.$emit('not-allowed')
            }
          }
          if (this.draggingType === "Join") {
            if (type !== "Action") {
              this.$emit('not-allowed')
            }
            else if (disabled && type === "Action") {
              this.$emit('not-allowed')
            }
            else {
              findNodeFrom['disabled'] = true
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
          }
          if (this.draggingType === "Decision") {
            if (type === "Join" || type === "Decision") {
              this.$emit('not-allowed')
            }
            else {
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
          }
        }
        else {
          this.$emit('not-allowed')
        }
      }
      this.draggingLink = null;
    },
    linkDelete (id) {
      const deletedLink = this.scene.links.find(item => {
        return item.id === id;
      });
      let findNodeFromDelete = this.scene.nodes.find(node => {
        return node.id === deletedLink.from
      });

      let deletedLinkChild = this.scene.nodes.find(item => {
        return item.id === deletedLink.to;
      });
      if (deletedLink) {
        this.scene.links = this.scene.links.filter(item => {
          return item.id !== id;
        });
        if (deletedLinkChild.type === 'Join' || deletedLinkChild.type === 'Decision') {
          findNodeFromDelete['disabled'] = false
          this.$emit("linkBreak", deletedLink);
        }
        else if (findNodeFromDelete.type === "Start" || findNodeFromDelete.type === "Action") {
          findNodeFromDelete['disabled'] = false
        }
        else {
          this.$emit("linkBreak", deletedLink);
        }
      }
    },
    nodeTransition () {
      let me = this;
      this.action.transition = !this.action.transition
      setTimeout(function () {
        me.action.transition = false
      }, 500);
    },
    nodeSelected (id, e) {
      this.action.dragging = id;
      this.action.selected = id;
      this.$emit("nodeClick", id);
      this.mouse.lastX =
        e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouse.lastY =
        e.pageY || e.clientY + document.documentElement.scrollTop;
    },
    handleMove (e) {
      if (this.action.linking) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
        [this.draggingLink.mx, this.draggingLink.my] = [
          this.mouse.x,
          this.mouse.y
        ];
      }
      if (this.action.dragging) {
        this.mouse.x =
          e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouse.y =
          e.pageY || e.clientY + document.documentElement.scrollTop;
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.moveSelectedNode(diffX, diffY);
      }
      if (this.action.scrolling) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;

        this.scene.centerX += diffX;
        this.scene.centerY += diffY;

        // this.hasDragged = true
      }
    },
    handleUp (e) {
      const target = e.target || e.srcElement;
      if (this.$el.contains(target)) {
        if (
          typeof target.className !== "string" ||
          target.className.indexOf("node-input") < 0
        ) {
          this.draggingLink = null;
        }
        if (
          typeof target.className === "string" &&
          target.className.indexOf("node-delete") > -1
        ) {
          // console.log('delete2', this.action.dragging);
          this.nodeDelete(this.action.dragging);
        }
      }
      this.action.linking = false;
      this.action.dragging = null;
      this.action.scrolling = false;
    },
    handleDown (e) {
      const target = e.target || e.srcElement;
      // console.log('for scroll', target, e.keyCode, e.which)
      if (
        (target === this.$el || target.matches("svg, svg *")) &&
        e.which === 1
      ) {
        this.action.scrolling = true;
        [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
        this.action.selected = null; // deselectAll
      }
      this.$emit("canvasClick", e);
    },
    moveSelectedNode (dx, dy) {
      let index = this.scene.nodes.findIndex(item => {
        return item.id === this.action.dragging;
      });
      let left = this.scene.nodes[index].x + dx / this.scene.scale;
      let top = this.scene.nodes[index].y + dy / this.scene.scale;
      this.$set(
        this.scene.nodes,
        index,
        Object.assign(this.scene.nodes[index], {
          x: left,
          y: top
        })
      );
    },
    nodeDelete (id) {
      this.scene.nodes = this.scene.nodes.filter(node => {
        return node.id !== id;
      });
      this.scene.links = this.scene.links.filter(link => {
        return link.from !== id && link.to !== id;
      });
      this.$emit("nodeDelete", id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.flowchart-container {
  margin: 0;
  background: #ddd;
  position: relative;
  overflow: hidden;
  svg {
    cursor: grab;
  }
}
.tool-wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: auto;
  left: 15px;
  width: 122px;
  height: 140px;
  margin-top: 10px;
  padding-top: 20px;
  background-color: white;
  z-index: 800;
  &:before {
    height: 20px;
    width: 100%;
    min-width: 100%;
    background-color: rgb(17, 148, 200);
    content: " ";
    top: 0px;
    left: 0;
    position: absolute;
    border-radius: 15px, 15px 0px 0px;
  }

  &::-webkit-scrollbar {
    width: 5px !important;
    margin-right: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e5e5;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #dddddd;
  }
}

.config-tool {
  width: 43px;
  height: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ddd;
  margin: 5px 7px 5px;
  border-radius: 5px;
  color: black;
  transition: 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
}

.button-decision {
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  background-color: white;
  outline: 3px solid black;
  transform: rotate(45deg);
  display: flex;
  transition: 0.5s ease-in-out;

  & > div {
    font-size: 17px;
    color: black;
    background: #fff;
  }

  &:hover {
    transform: scale(1.1) rotate(45deg);
  }
}

.button-end {
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 3px solid black;
  border-radius: 50%;
  transition: 0.5s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
}

.button-end-workflow {
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 3px solid black;
  border-radius: 50%;
  display: flex;
  transition: 0.5s ease-in-out;

  & > div {
    background-color: black;
    width: 16px;
    height: 16px;
    position: relative;
    border-radius: 50%;
    content: " ";
  }
  &:hover {
    transform: scale(1.1);
  }
}
</style>
