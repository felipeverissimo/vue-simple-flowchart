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
      :style="pathStyle"
      marker-end="url(#arrow)"
    >
    </path>

    <a>
      <text
        text-anchor="middle"
        :transform="horizontal? textTransformHorizontal : textTransform"
        font-size="22"
      >{{
        text
      }}</text>
    </a>

  </g>
</template>

<script>
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
    linkSelect (e) {
      this.show.delete = true
      if (this.select === false) {
        this.select = true
      }
      this.$emit('linkSelected', this.id)
      this.$emit("nodeSelected", null);

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
      // console.log(this.start[0])
      // console.log(this.start[1])
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
        this.text = prompt();
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
    select: function () {
      this.$emit("changeLineSelected", this.select);
    }
  },
  computed: {
    pathStyle () {
      return {
        stroke: this.selectedLine ? "rgb(2, 136, 8)" : "rgb(255, 136, 85)",
        strokeWidth: 5.73205,
        fill: "none"
      };
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
      // const degree = this.caculateRotation();
      return `translate(${arrowX}, ${change})`;
    },
    compText () {
      let change = this.text;
      return (this.$props.label = `${change}`);
    },
    dAttr: function () {
      if (this.horizontal) {
        let cx = this.start[0],
          cy = this.start[1] - 45,
          ex = this.linking ? this.end[0] : this.end[0],
          ey = this.linking ? this.end[1] : this.end[1] + 33;
        let x1 = cx,
          y1 = cy,
          x2 = ex,
          y2 = ey;
        let calc = (x1 + x2) / 2;
        if (x1 < x2) {
          if (this.type === "Action" || this.type === "Join" || this.type === "Decision") {
            if (this.$parent.browser === 'firefox') {
              return `M${cx} ${cy}  H ${Math.round(calc)} ${calc}  V ${y2} ${ey} H ${ex - 70}`
            } else {
              // console.log('chrome action join ou decision retorno')
              return `M ${cx}, ${cy} H ${Math.round(calc)},${calc}, V ${y2},${ey} H ${ex - 70}`;
            }
          }
          if (this.type === "End" || this.type === "endWorkflow") {
            if (this.$parent.browser === 'firefox') {
              return `M ${cx} ${cy} H ${Math.round(calc)} ${calc} V ${y2} ${ey - 5} H ${ex - 40}`;
            }
            else {
              // console.log('chrome end  end workflow retorno')
              return `M ${cx}, ${cy} H ${Math.round(calc)},${calc}, V ${y2},${ey - 5} H ${ex - 40}`;
            }
          }
          else {
            if (this.$parent.browser === 'firefox') {
              if (this.consultMode) {
                return `M ${cx} ${cy} H ${Math.round(calc)} ${calc} V ${y2} ${ey} H ${ex - 70}`;
              }
              else {
                return `M${cx} ${cy}  H ${Math.round(calc)} ${calc}  V ${y2} ${ey} H ${ex - 70}`
              }
            }
            else {
              // console.log('chrome contruindo o cara salvo')
              // console.log(this.dragLine)
              let mountedLine = ex - 80;
              // console.log(mountedLine)

              if (this.consultMode) {
                return `M ${cx}, ${cy} H ${Math.round(calc)},${calc}, V ${y2},${ey} H ${ex - 70}`;
              }
              else {
                // console.log('chrome add')

                return `M ${cx}, ${cy} H ${Math.round(calc)},${calc}, V ${y2},${ey} H ${ex}`;
              }

            }
          }
        }
        else {
          cy = this.start[1]
          let verticalLine = y1 + 150;
          let nodeHeight = -100;
          if (y1 < y2 && (y1 + nodeHeight) > y2) {
            // console.log(verticalLine)
            // console.log(y2)
            return `M${x1} ${y1}  V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2 + 75}`
          }
          // 60 - 67 
          else if (y1 < y2 && (y1 - y2) > nodeHeight) {
            // console.log(verticalLine, 'menor')
            // console.log(y2, 'menor')
            return `M${x1} ${y1}  V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2 + 75}`
          }
          else if (y1 < y2 && (y1 - y2) < nodeHeight) {
            return `M${x1} ${y1}  V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2 - 45}`
          }
          else if (y1 < y2) {
            return `M${x1} ${y1}  V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2 - 45}`

          }
          else if (y1 > y2 && x2 > y2) {
            return `M${x1} ${y1}  V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2 + 75}`
          }
          else {

            return `M${x1} ${y1}  V${this.dragLine ? y1 + this.dragLine : verticalLine} H${x2} V${y2}`
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
};
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
</style>
