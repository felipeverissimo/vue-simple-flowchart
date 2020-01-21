<template>
  <div>
    <div
      class="flowchart-node flowchart-actions"
      :style="nodeStyle"
      @mousedown="handleMousedown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
      @dblclick="handleContent"
      v-bind:class="{full: options.transition, selected: options.selected === id, horizontal: options.horizontal  }"
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
      v-bind:class="{ selected: options.selected === id,horizontal: options.horizontal }"
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
      v-bind:class="{ selected: options.selected === id,horizontal: options.horizontal }"
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
      v-bind:class="{ selected: options.selected === id, horizontal: options.horizontal }"
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
      v-bind:class="{ selected: options.selected === id, horizontal: options.horizontal }"
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
      v-bind:class="{ selected: options.selected === id, horizontal: options.horizontal }"
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
          rotate: 90,
          width: 400,
        };
      }
    }
  },
  data () {
    return {
      show: {
        delete: false,
        fullContent: false,
      },
    };
  },
  mounted () { },
  computed: {
    nodeStyle: function () {
      if (this.show.fullContent) {
        return {
          top: this.options.centerY - 2 + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
          left: this.options.centerX - 160 + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
          transform: `scale(${this.options.scale})`,
          width: this.options.width + "px",
        }
      }
      else {
        return {
          top: this.options.centerY - 2 + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
          left: this.options.centerX - 20 + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
          transform: `scale(${this.options.scale})`,
          width: 120 + "px",

        }
      }
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
        top: this.options.centerY - 2 + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
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
    handleContent () {
      if (!this.show.fullContent) {
        this.$emit('nodeTransition')
        this.show.fullContent = true;
      }
      else {
        this.$emit('nodeTransition')
        // alert('to aqui ')
        this.show.fullContent = false;
        this.$emit('canvasClick')
      }
    },
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
  opacity: 1;
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
    // left: 50%;
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

  &.horizontal {
    .node-delete {
      top: 45px;
    }
  }
  .node-delete {
    position: absolute;
    right: -6px;
    top: 0;
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
  margin-top: -10px;

  &.horizontal {
    .node-port {
      left: 0;
      transform: rotate(90deg);

      &.node-input {
        top: 50px;
        left: -14px;
      }

      &.node-output {
        right: 0;
        left: 48px;
        top: -13px;
      }
    }
  }

  .node-port {
    left: 0;

    &.node-input {
      left: 0px;
    }

    &.node-output {
      left: 52px;
      top: 47px;
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
  margin-top: -10px;

  &.horizontal {
    .node-port {
      left: 0;
      transform: rotate(90deg);

      &.node-input {
        top: 50px;
        left: -14px;
      }

      &.node-output {
        right: 0;
        left: 48px;
        top: -13px;
      }
    }
  }

  .node-port {
    left: 0;

    &.node-input {
      left: 0px;
    }

    &.node-output {
      left: 52px;
      top: 47px;
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
  width: 70px;
  height: 70px;
  border: 3px solid black;
  border-radius: 50%;
  margin-left: -7px;

  &.horizontal {
    .node-port {
      &.node-output {
        top: 38%;
        right: -20px;
        left: 100%;
      }
    }
  }

  .node-port {
    &.node-output {
      left: 30px;
    }
  }
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

  .node-port {
    &.node-input {
      left: 50%;
    }
  }
  &.horizontal {
    .node-delete {
      top: 36%;
      right: -13px;
    }
    .node-port {
      &.node-input {
        top: 38%;
        left: -5px;
      }
    }
  }
}
.flowchart-end {
  width: 50px;
  height: 50px;
  border: 5px solid black;
  border-radius: 50%;

  &.horizontal {
    .node-delete {
      top: 36%;
      right: -13px;
    }
    .node-port {
      &.node-input {
        top: 38%;
        left: -5px;
      }
    }
  }

  .node-port {
    &.node-input {
      left: 50%;
    }
  }
}

.flowchart-actions {
  width: 120px;
  height: 70px;
  border: 3px solid black;
  border-radius: 5px;
  will-change: width;

  .node-label {
    padding: 0px 10px;
    display: block; /* Fallback for non-webkit */
    display: -webkit-box;
    max-width: 400px;
    margin: 0 auto;
    font-size: 13px;
    line-height: 1.2;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.horizontal {
    .node-port {
      &.node-input {
        top: 38%;
        left: -5px;
      }

      &.node-output {
        top: 38%;
        right: 0px;
        left: 100%;
      }
    }
  }

  .node-port {
    &.node-input {
      left: 50%;
    }

    &.node-output {
      left: 50%;
    }
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
.full {
  transition: 0.5s ease-in-out;
}
</style>
