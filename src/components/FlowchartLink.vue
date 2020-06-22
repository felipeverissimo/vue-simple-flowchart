<template>
  <g
    @dblclick="changeLink"
    @click="linkSelect($event)"
  >

    <defs>
      <!-- arrowhead marker definition -->
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="4"
        markerHeight="4"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>

    <path
      :d="dAttr"
      @click='select = !select'
      :class="classeComputada"
      stroke-width="5.73205"
      fill="none"
      marker-end="url(#arrow)"
    >
    </path>
    <a>
      <text
        :id="`${text+id}`"
        text-anchor="middle"
        :transform="horizontal? textTransformHorizontal : textTransform"
        font-size="15"
        font-weight="600"
      >
        {{
        text
      }}
      </text>
    </a>
  </g>
</template>

<script>
import { EventBus } from '../eventBus'

export default {
  name: "FlowchartLink",
  props: {
    label: {
      type: String,
      default () {
        return this.text;
      }
    },
    // start point position [x, y]
    start: {
      type: Array,
      default () {
        return [0, 0];
      }
    },
    // end point position [x, y]
    end: {
      type: Array,
      default () {
        return [0, 0];
      }
    },
    type: {
      type: String,
      default () {
        return "Default";
      }
    },
    id: Number,
    horizontal: Boolean,
    linking: Boolean,
    selectedLine: {
      type: Boolean,
      default: false
    },
    consultMode: {
      type: Boolean,
      default: false
    },
    dragLine: Number,
  },
  data () {
    return {
      text: this.label,
      line: this.dragLine,
      select: this.selectedLine,
      show: {
        delete: false
      },
    };
  },
  methods: {
    linkSelect () {
      let me = this;
      EventBus.$emit('linkSelected', this.id)
      me.$emit('idLink', this.id)
      me.$emit("nodeSelected", null);
    },
    handleMouseOver () {
      if (this.id) {
        this.show.delete = true;
      }
    },
    handleMouseLeave () {
      this.show.delete = false;
      this.select = false;
    },
    caculateCenterPoint () {
      // caculate arrow position: the center point between start and end
      const dx = (this.end[0] - this.start[0]) / 2;
      const dy = (this.end[1] - this.start[1]) / 2;
      if (this.end[0] < this.start[0]) {
        return [this.start[0] + dx, this.start[1] + 90]
      }
      else {
        return [this.start[0] + dx, this.start[1] + dy];
      }
    },
    caculateBottomPoint () {
      // caculate arrow position: the center point between start and end
      const dx = (this.end[0] - this.start[0]) / 2;
      const dy = (this.end[1] - this.start[1]) / 2;
      return [this.start[0] + dx, dy];
    },
    caculateRotation () {
      // caculate arrow rotation
      const angle = -Math.atan2(
        this.end[0] - this.start[0],
        this.end[1] - this.start[1]
      );
      const degree = (angle * 180) / Math.PI;
      return degree < 0 ? degree + 360 : degree;
    },
    changeLink () {
      if (!this.consultMode) {
        let lastLabel = this.text;
        this.text = prompt();
        if (this.text == null) {
          this.text = lastLabel;
        }
      }
    },
    deleteLink () {
      this.$emit("deleteLink");
    }
  },
  watch: {
    text: function (value) {
      this.$emit("update:label", value);
    },
    label: function (value) {
      this.text = value
    },
  },
  computed: {
    classeComputada () {
      if (this.select) {
        return 'path selected'
      }
      else {
        return 'path'
      }
    },
    arrowStyle () {
      return {
        stroke: "rgb(255, 136, 85)",
        strokeWidth: 5.73205,
        fill: "none"
      };
    },
    arrowTransform () {
      const [arrowX, arrowY] = this.caculateBottomPoint();
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${arrowY}) rotate(${degree})`;
    },
    arrowTransformHorizontal () {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${arrowY})`;
    },
    textTransform () {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      let sideText = arrowX;
      const degree = this.caculateRotation();
      return `translate(${sideText}, ${arrowY}) rotate(${degree} )`;
    },
    textTransformHorizontal () {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      let sideText = arrowX;
      const degree = this.caculateRotation();
      return `translate(${sideText}, ${arrowY})`;
    },
    changeTransform () {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      let change = arrowY + 35;
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${change}) rotate(${degree})`;
    },
    changeTransformHorizontal () {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      let change = arrowY;
      return `translate(${arrowX}, ${change})`;
    },
    compText () {
      // let change = this.text;
      // return (this.$props.label = `${change}`);
    },
    dAttr: function () {
      if (this.horizontal) {
        let classes
        let cx = this.start[0],
          cy = this.start[1] - 3,
          ex = this.end[0],
          ey = this.end[1] + 30;
        let x1 = cx,
          y1 = cy,
          x2 = ex,
          y2 = ey;
        let calc = (x1 + x2) / 2;
        if (x1 < x2) {
          if (this.type === "Action" || this.type === "Join" || this.type === "Decision") {
            if (this.$parent.browser === 'firefox') {
              return `M${cx} ${cy - 45}  H ${Math.round(calc)} ${calc}  V ${y2} ${ey} H ${ex - 70}`
            }
            else if (this.$parent.action.linking) {
              return `M${cx} ${cy - 45}  H ${Math.round(calc)} ${calc}  V ${y2} ${ey} H ${ex}`
            }
            else {
              // ('chrome action join ou decision retorno')
              return `M ${cx}, ${cy - 45} H ${Math.round(calc)},${calc}, V ${y2},${ey} H ${ex - 70}`;
            }
          }
          if (this.type === "End" || this.type === "endWorkflow") {
            if (this.$parent.browser === 'firefox') {
              return `M ${cx} ${cy} H ${Math.round(calc)} ${calc} V ${y2} ${ey - 5} H ${ex - 40}`;
            }
            else if (this.$parent.action.linking) {
              return `M${cx} ${cy}  H ${Math.round(calc)} ${calc}  V ${y2} ${ey} H ${ex} `
            }
            else {
              // ('chrome end  end workflow retorno')
              return `M ${cx}, ${cy} H ${Math.round(calc)}, ${calc}, V ${y2}, ${ey - 50} H ${ex - 60} `;
            }
          }

          else {
            if (this.$parent.browser === 'firefox') {
              if (this.consultMode) {
                return `M ${cx} ${cy} H ${Math.round(calc)} ${calc} V ${y2} ${ey} H ${ex - 70} `;
              }
              else if (this.$parent.action.linking) {
                return `M${cx} ${cy} H ${Math.round(calc)} ${calc} V ${y2 - 80} ${ey} H ${ex} `
              }
              else {
                return `M${cx} ${cy} H ${Math.round(calc)} ${calc} V ${y2} ${ey} H ${ex - 70} `
              }
            }
            else {
              let mountedLine = ex - 80;
              if (this.consultMode) {
                return `M ${cx}, ${cy - 45} H ${Math.round(calc)}, ${calc}, V ${y2}, ${ey} H ${ex - 70} `;
              }
              else if (this.$parent.action.linking) {
                return `M${cx} ${cy - 45} H ${Math.round(calc)} ${calc} V ${y2 - 20} ${ey - 20} H ${ex} `
              }
              else {
                return `M ${cx}, ${cy - 45} H ${Math.round(calc)}, ${calc}, V ${y2}, ${ey} H ${ex - 70} `;
              }
            }
          }
        }
        else {
          cy = this.start[1]
          let verticalLine = y1 + 150;
          let nodeHeight = -100;
          if (y1 < y2 && (y1 + nodeHeight) > y2) {
            return `M${x1 + 20} ${y1 - 20} V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2 + 20} V${y2 + 52} `
          }
          else if (y1 < y2 && (y1 - y2) > nodeHeight) {
            return `M${x1 + 20} ${y1 - 40} V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2 - 20} V${y2 + 52} `
          }
          else if (y1 < y2 && (y1 - y2) < nodeHeight) {
            return `M${x1 + 20} ${y1 - 40} V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2 + 20} V${y2 - 44} `
          }
          else if (y1 < y2) {
            return `M${x1 + 20} ${y1 - 20} V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2 - 45} `
          }
          else if (y1 > y2 && x2 > y2) {
            return `M${x1 + 20} ${y1 - 20} V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2 + 20} V${y2 + 52} `
          }
          else {
            return `M${x1 + 20} ${y1 - 20} V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2 + 20} V${y2 + 52} `
          }
        }
      }
      else {
        let cx = this.start[0],
          cy = this.start[1] - 10,
          ex = this.end[0],
          ey = this.end[1];
        let x1 = cx,
          y1 = cy + 50,
          x2 = ex,
          y2 = ey - 50;
        return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
      }
    },
  },
  created () {
    let me = this;
    EventBus.$on('linkSelected', (id) => {
      me.select = me.id === id
    })
  },
  destroy () {
    EventBus.$off('linkSelected')
  }
};
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
.path {
  stroke: rgb(255, 136, 85);
  &.selected {
    stroke: rgb(2, 136, 8);
  }
}
</style>
