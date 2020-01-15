<template>
  <div>
    <div
      class="flowchart-node flowchart-actions"
      :style="nodeStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      v-bind:class="{ selected: options.selected === id }"
      v-if="type === 'Action'"
    >
      <div
        class="node-port node-input"
        @mousedown="inputMouseDown"
        @mouseup="inputMouseUp"
      ></div>
      <div class="node-main">
        <div
          v-text="label"
          class="node-label"
        ></div>
      </div>
      <div
        class="node-port node-output"
        @mousedown="outputMouseDown"
      ></div>
      <div
        v-show="show.delete"
        class="node-delete"
      >&times;</div>
    </div>

    <div
      class="flowchart-node flowchart-decision"
      :style="decisionStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      v-bind:class="{ selected: options.selected === id }"
      v-if="type === 'Decision'"
    >
      <div
        class="node-port node-input"
        @mousedown="inputMouseDown"
        @mouseup="inputMouseUp"
      ></div>
      <div class="node-main">
        <div class="node-label">✖</div>
      </div>
      <div
        class="node-port node-output"
        @mousedown="outputMouseDown"
      ></div>
      <div
        v-show="show.delete"
        class="node-delete"
      >&times;</div>
    </div>

    <div
      class="flowchart-node flowchart-join"
      :style="decisionStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      v-bind:class="{ selected: options.selected === id }"
      v-if="type === 'Join'"
    >
      <div
        class="node-port node-input"
        @mousedown="inputMouseDown"
        @mouseup="inputMouseUp"
      ></div>
      <div class="node-main">
        <div class="node-label">🞅</div>
      </div>
      <div
        class="node-port node-output"
        @mousedown="outputMouseDown"
      ></div>
      <div
        v-show="show.delete"
        class="node-delete"
      >&times;</div>
    </div>

    <div
      class="flowchart-node flowchart-start"
      :style="startStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      v-bind:class="{ selected: options.selected === id }"
      v-if="type === 'Start'"
    >
      <div class="node-main">
        <div class="node-label"></div>
      </div>
      <div
        class="node-port node-output"
        @mousedown="outputMouseDown"
      ></div>
    </div>

    <div
      class="flowchart-node flowchart-end"
      :style="endStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      v-bind:class="{ selected: options.selected === id }"
      v-if="type === 'End'"
    >
      <div
        class="node-port node-input"
        @mousedown="inputMouseDown"
        @mouseup="inputMouseUp"
      ></div>
      <div class="node-main"></div>
      <div
        v-show="show.delete"
        class="node-delete"
      >&times;</div>
    </div>

    <div
      class="flowchart-node flowchart-end-workflow"
      :style="endStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      v-bind:class="{ selected: options.selected === id }"
      v-if="type === 'EndWorkflow'"
    >
      <div
        class="node-port node-input"
        @mousedown="inputMouseDown"
        @mouseup="inputMouseUp"
      ></div>
      <div class="node-main">
        <div class="node-label">⏺</div>
      </div>
      <div
        v-show="show.delete"
        class="node-delete"
      >&times;</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlowchartNode",
  props: {
    id: {
      type: Number,
      default: 1000,
      validator (val) {
        return typeof val === "number";
      }
    },
    x: {
      type: Number,
      default: 0,
      validator (val) {
        return typeof val === "number";
      }
    },
    y: {
      type: Number,
      default: 0,
      validator (val) {
        return typeof val === "number";
      }
    },
    type: {
      type: String,
      default: "Default"
    },
    label: {
      type: String,
      default: "input name"
    },
    rotate: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default () {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
          rotate: 90
        };
      }
    }
  },
  data () {
    return {
      show: {
        delete: false
      }
    };
  },
  mounted () { },
  computed: {
    nodeStyle () {
      return {
        top: this.options.centerY + this.y + 5 * this.options.scale + "px", // remove: this.options.offsetTop +
        left: this.options.centerX - 20 + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
        transform: `scale(${this.options.scale})`
      };
    },
    decisionStyle () {
      return {
        top: this.options.centerY + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
        left: this.options.centerX + 40 + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
        transform: `rotate(45deg)`
      };
    },
    startStyle () {
      return {
        top: this.options.centerY + 40 + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
        left: this.options.centerX + 15 + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
        transform: `scale(${this.options.scale})`
      };
    },
    endStyle () {
      return {
        top: this.options.centerY + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
        left: this.options.centerX + 15 + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
        transform: `scale(${this.options.scale})`
      };
    }
  },
  methods: {
    handleMousedown (e) {
      const target = e.target || e.srcElement;
      // console.log(target);
      if (
        target.className.indexOf("node-input") < 0 &&
        target.className.indexOf("node-output") < 0
      ) {
        this.$emit("nodeSelected", e);
      }
      e.preventDefault();
    },
    handleMouseOver () {
      this.show.delete = true;
    },
    handleMouseLeave () {
      this.show.delete = false;
    },
    outputMouseDown (e) {
      this.$emit("linkingStart");
      e.preventDefault();
    },
    inputMouseDown (e) {
      e.preventDefault();
    },
    inputMouseUp (e) {
      this.$emit("linkingStop");
      e.preventDefault();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$themeColor: rgb(255, 136, 85);
$portSize: 12;

.flowchart-node {
  margin: 0;
  width: 80px;
  height: 80px;
  position: absolute;
  box-sizing: border-box;
  border: none;
  background: white;
  z-index: 1;
  opacity: 0.9;
  cursor: move;
  transform-origin: top left;
  .node-main {
    text-align: center;
    .node-type {
      background: $themeColor;
      color: white;
      font-size: 13px;
      padding: 6px;
    }
    .node-label {
      font-size: 13px;
    }
  }
  .node-port {
    position: absolute;
    width: #{$portSize}px;
    height: #{$portSize}px;
    left: 50%;
    transform: translate(-50%);
    border: 1px solid #ccc;
    border-radius: 100px;
    background: white;
    &:hover {
      background: $themeColor;
      border: 1px solid $themeColor;
    }
  }
  .node-input {
    top: #{-2 + $portSize/-2}px;
  }
  .node-output {
    bottom: #{-2 + $portSize/-2}px;
  }
  .node-delete {
    position: absolute;
    right: -6px;
    top: -6px;
    font-size: 12px;
    width: 12px;
    height: 12px;
    color: $themeColor;
    cursor: pointer;
    background: white;
    border: 1px solid $themeColor;
    border-radius: 100px;
    text-align: center;
    &:hover {
      background: $themeColor;
      color: white;
    }
  }
}
.flowchart-decision {
  width: 60px;
  height: 60px;
  border: 5px solid black;
  .node-port {
    left: 0;

    &.node-output {
      left: 100%;
    }
  }
  .node-main {
    .node-label {
      font-size: 35px;
      color: black;
    }
  }
}

.flowchart-join {
  width: 60px;
  height: 60px;
  border: 5px solid black;
  .node-port {
    left: 0;

    &.node-output {
      left: 100%;
    }
  }
  .node-main {
    .node-label {
      font-size: 35px;
      color: black;
    }
  }
}

.flowchart-start {
  width: 50px;
  height: 50px;
  border: 3px solid black;
  border-radius: 50%;
}

.flowchart-end-workflow {
  width: 50px;
  height: 50px;
  border: 5px solid black;
  border-radius: 50%;

  .node-input {
    z-index: 22;
  }

  .node-main {
    .node-label {
      position: relative;
      top: -10px;
      font-size: 42px;
      color: black;
      z-index: 20;
    }
  }
}
.flowchart-end {
  width: 50px;
  height: 50px;
  border: 5px solid black;
  border-radius: 50%;
}

.flowchart-actions {
  width: 120px;
  height: 70px;
  border: 3px solid black;
  border-radius: 5px;

  .node-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 10px;
  }

  .node-main {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>
