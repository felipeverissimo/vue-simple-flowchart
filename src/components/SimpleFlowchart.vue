<template>
  <div
    class="flowchart-container"
    @mousemove="handleMove"
    @mouseup="handleUp"
    @mousedown="handleDown"
    :key="keyFlowChart"
  >
    <div class="zoom-container">
      <div
        class="tool-wrapper"
        v-if="!consultOn"
      >
        <div
          v-for="(item, index) in nodeCategory"
          :key="index"
          :value="index"
          @click="chosedNodes(item, index)"
        >
          <div
            class="config-tool "
            v-if="index == 0 && end"
          >
            <div class="button-end"></div>
          </div>

          <div
            class=" config-tool"
            v-if="index == 1 && endWorkflow"
          >
            <div class="button-end-workflow">
              <div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <svg
        width="100%"
        :height="`${height}px`"
        tabindex="0"
      >
        <!-- :dragLine="parseInt(offset)"moveSelectedLine -->
        <flowchart-link
          v-bind.sync="link"
          :state="link.state"
          :consultMode="consultOn"
          v-for="(link) in lines"
          :key="`link${link.id}`"
          :linking="action.linking"
          :selectedLine="link.selectedLine"
          :label.sync="link.label"
          @update:label="labelUpdate(link,$event)"
          @changeLineSelect="linkLabel(link, $event)"
          @idLink="linkSelected($event)"
        ></flowchart-link>
      </svg>
      <flowchart-node
        v-bind.sync="node"
        v-for="(node, index) in scene.nodes"
        :key="`node${index}`"
        :options="nodeOptions"
        :consultMode="consultOn"
        @update:type="(newType) => {node.type = newType;}"
        @linkingStart="linkingStart(node.id, node.type)"
        @linkingStop="linkingStop(node.id, node.type)"
        @nodeSelected="nodeSelected(node.id, $event, node)"
        @nodeTransition='nodeTransition()'
      >
      </flowchart-node>
    </div>
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
    },
    consult: {
      type: Boolean,
      default: false,
    },
    activeNode: {
      type: Object,
      required: false
    },
    end: {
      type: Boolean,
      default: true,
    },
    endWorkflow: {
      type: Boolean,
      default: true,
    }
  },
  data () {
    return {
      newNodeType: 0,
      newNodeLabel: "",
      consultOn: this.consult,
      keyFlowChart: 1,
      browser: '',
      nodeCategory: ["End", "EndWorkflow"],
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
      offset: 0,
      draggingLink: null,
      selectedLine: null,
      idSelectedLine: 0,
      selectedNode: this.nodeSelected,
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
  watch: {
    selectedNode () {
      this.$emit('update:activeNode', this.selectedNode)
    },
  },
  computed: {
    nodeOptions () {
      return {
        centerY: this.scene.centerY,
        centerX: this.scene.centerX,
        scale: this.scene.scale,
        offsetTop: this.rootDivOffset.top,
        offsetLeft: this.rootDivOffset.left,
        selected: this.selectedNode.id,
        width: 500,
        transition: this.action.transition,
        horizontal: this.horizontalStyle,
      };
    },
    lines () {
      ('push da linha')

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
        // (link.selectedLine)
        return {
          start: [cx, cy],
          end: [ex, ey],
          id: link.id,
          label: link.label,
          state: link.state,
          from: fromNode,
          horizontal: this.horizontalStyle,
          dragLine: this.offset,
          selectedLine: link.selectedLine,
          type: link.type
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
          horizontal: this.horizontalStyle,
          dragLine: 0,
        });
      }
      return lines;
    },
  },
  mounted () {
    let me = this;
    this.rootDivOffset.top = this.$el ? this.$el.offsetTop : 0;
    this.rootDivOffset.left = this.$el ? this.$el.offsetLeft : 0;

    window.addEventListener('keydown', (e) => {
      var key = e.which || e.keyCode;
      if (key === 46) {
        me.removeItems();
      }
    })

    document.oncontextmenu = function () {
      return false;
    };




    this.identific_nav()

    // (22222, this.rootDivOffset);
  },
  methods: {
    labelUpdate (link, label) {
      // (link)
      this.scene.links.forEach(item => {
        if (item.id === link.id) {
          item.label = label
        }
      });
      this.keyFlowChart = this.keyFlowChart + 1
    },
    removeItems () {
      if (!this.consultOn) {
        if (this.action.selected !== 0) {
          if (this.selectedNode.type !== 'Start') {
            return this.deleteNodeButtom()
          }
          else {
            return
          }
        }
        else if (this.idSelectedLine !== 0) {
          this.deleteLineButtom()
        }
        else {
          return
        }
      }
    },
    identific_nav () {
      var nav = navigator.userAgent.toLowerCase();
      let browser = "";
      if (nav.indexOf("msie") != -1) {
        browser = "msie";
      } else if (nav.indexOf("opera") != -1) {
        browser = "opera";
      } else if (nav.indexOf("mozilla") != -1) {
        if (nav.indexOf("firefox") != -1) {
          browser = "firefox";
        } else if (nav.indexOf("firefox") != -1) {
          browser = "mozilla";
        } else if (nav.indexOf("chrome") != -1) {
          browser = "chrome";
        }
      } else {
        alert("Navegador desconhecido!");
      }
      this.browser = browser
    },
    deleteLineButtom () {
      this.linkDelete(this.idSelectedLine)
      this.idSelectedLine = 0
    },
    deleteNodeButtom () {
      this.nodeDelete(this.selectedNode.id)
      this.selectedNode = {}
      this.action.selected = 0
    },
    nodeDelete (id) {
      // (id)
      if (!this.consultOn) {

        let findNodeFrom = this.scene.nodes.find(node => { return node.id; });
        findNodeFrom['disabled'] = false
        this.scene.nodes = this.scene.nodes.filter(node => {
          return node.id !== id;
        });
        this.scene.links = this.scene.links.filter(link => {
          return link.to !== id;
        });
        this.scene.links = this.scene.links.filter(link => {
          return link.from !== id;
        });

        this.$emit("nodeDelete", id);
      }
    },
    linkLabel (link, payload) {
      if (!this.consultOn) {

        const deletedLink = this.scene.links.find(item => {
          return item.id === link.id;
        });
        if (deletedLink) {
          deletedLink.label = payload;
        }
      }
    },
    linkSelected (id) {
      if (!this.consultOn) {
        console.log(id)
        let me = this;
        me.idSelectedLine = id;
        me.selectedNode = {};
        me.action.selected = 0;
      }
    },
    chosedNodes (item, index) {
      this.newNodeType = index;
      this.addNode();
    },
    addNode () {
      const max = Math.max.apply(Math, this.scene.nodes.map(function (o) { return o.id; }))
      this.scene.nodes.push({
        id: max + 1,
        x: -400,
        y: 50,
        type: this.nodeCategory[this.newNodeType],
        label: this.newNodeLabel ? this.newNodeLabel : `test${max + 1}`,
        term: ''
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
        dragLine: 0,
      };
    },
    linkingStop (index, type) {
      // add new Link
      if (this.draggingLink && this.draggingLink.from !== index) {
        // check link existence
        let existed = this.scene.links.find(link => {
          return link.from === this.draggingLink.from && link.to === index;
        });

        // if (type === "Decision") {
        //   existed = this.scene.links.filter(link => {
        //     return link.to === index;
        //   });
        // }
        // if (!existed || existed.length <= 1) {
        if (!existed) {
          let maxID = Math.max(
            0,
            ...this.scene.links.map(link => {
              return link.id;
            })
          );
          // (type)
          const newLink = {
            id: maxID + 1,
            from: this.draggingLink.from,
            to: index,
            type: type,
            selectedLine: false,
            label: ''
          };
          let findNodeFrom = this.scene.nodes.find(node => { return node.id === this.draggingLink.from; });
          // let parentNodes = this.scene.links.map(element => { return element.from });
          let disabled = findNodeFrom.disabled;

          if (this.draggingType === "Start") {
            if (type === 'End' || type === 'EndWorkflow') {
              this.$emit('not-allowed')
            }
            else {
              findNodeFrom['disabled'] = true
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
          }
          if (this.draggingType === "Action") {
            this.scene.links.push(newLink);
            this.$emit("linkAdded", newLink);
          }
          if (this.draggingType === "Join") {
            // if (type !== "Action") {
            //   this.$emit('not-allowed')
            // }
            // else if (disabled && type === "Action") {
            //   this.$emit('not-allowed')
            // }
            // else {
            findNodeFrom['disabled'] = true
            this.scene.links.push(newLink);
            this.$emit("linkAdded", newLink);
            // }
          }
          if (this.draggingType === "Decision") {
            // if (type === "Join" || type === "Decision") {
            //   this.$emit('not-allowed')
            // }
            // else {
            this.scene.links.push(newLink);
            this.$emit("linkAdded", newLink);
            // }
          }
        }
        // else {
        //   alert('nao permito generico')
        //   this.$emit('not-allowed')
        // }
      }
      this.draggingLink = null;
    },
    linkDelete (id) {
      // debugger
      if (!this.consultOn) {

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
          this.selectedLine = {};

          // if (deletedLinkChild.type === 'End' || deletedLinkChild.type === 'EndWorkflow') {
          //   findNodeFromDelete['disabled'] = false
          //   this.$emit("linkBreak", deletedLink);
          // }
          // else if (findNodeFromDelete.type === "Start" || findNodeFromDelete.type === "Action") {
          //   findNodeFromDelete['disabled'] = false
          // }
          // else {
          this.$emit("linkBreak", deletedLink);
          // }
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
    nodeSelected (id, e, node) {
      this.selectedNode = node
      this.action.selected = node.id
      this.action.dragging = id
      this.$emit("nodeClick", id)
      this.mouse.lastX =
        e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouse.lastY =
        e.pageY || e.clientY + document.documentElement.scrollTop;

      // if (this.consultOn) {
      //   this.selectedNode =
      // }
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
      // if (this.selectedLine.selectedLine) {
      //   debugger
      //   this.action.scrolling = false
      //   this.mouse.x =
      //     e.pageX || e.clientX + document.documentElement.scrollLeft;
      //   this.mouse.y =
      //     e.pageY || e.clientY + document.documentElement.scrollTop;
      //   let diffX = this.mouse.x - this.mouse.lastX;
      //   let diffY = this.mouse.y - this.mouse.lastY;

      //   this.mouse.lastX = this.mouse.x;
      //   this.mouse.lastY = this.mouse.y;
      //   this.moveSelectedLine(this.mouse.y);
      // }
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

        // if (
        //   typeof target.className === "string" &&
        //   target.className.indexOf("node-delete") > -1
        // ) {
        //   // ('delete2', this.action.dragging);
        //   this.nodeDelete(this.action.dragging);
        // }
      }
      this.action.linking = false;
      this.action.dragging = null;
      this.action.scrolling = false;
      // this.selectedLine.selectedLine = false;
    },
    handleDown (e) {
      const target = e.target || e.srcElement;
      // ('for scroll', target, e.keyCode, e.which)
      if (
        (target === this.$el || target.matches("svg, svg *")) &&
        e.which === 1
      ) {

        this.action.scrolling = true;
        [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
        // (getMousePosition(this.$el, e))

        this.action.selected = null; // deselectAll

      }
      //descelectLine
      // this.selectedLine.selectedLine = false
      // this.selectedLine = {}
      this.$emit("canvasClick", e);
    },
    moveSelectedLine (dy) {
      // let index = this.scene.links.findIndex(item => {
      //   return item.id === this.selectedLine.id
      // });
      // alert(index)
      let top = dy / this.scene.scale;
      this.offset = top
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
  height: 70px;
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
  font-size: 32px;
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
