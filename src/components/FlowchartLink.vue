<template>
  <g
    @click="linkSelect($event)"
    @dblclick="changeLink"
  >
    <path
      :d="dAttr"
      :style="pathStyle"
    ></path>
    <a>
      <text
        text-anchor="middle"
        :transform="horizontal? textTransformHorizontal : textTransform"
        font-size="22"
      >{{
        text
      }}{{dragLine}}</text>
    </a>
    <path
      v-if="show.delete"
      d="M -1 -1 L 0 1 L 1 -1 z"
      :style="arrowStyle"
      :transform="arrowTransform"
    >
    </path>

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
    id: Number,
    horizontal: Boolean,
    linking: Boolean,
    selectedLine: Boolean,
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

    linkSelect (e) {
      this.show.delete = true
      if (this.id) {
        this.select = !this.select
        this.$emit('linkSelected', e)
      }
    },
    handleMouseOver () {
      if (this.id) {
        this.show.delete = true;
      }
    },
    handleMouseLeave () {
      this.show.delete = false;
    },
    caculateCenterPoint () {
      // caculate arrow position: the center point between start and end
      const dx = (this.end[0] - this.start[0]) / 2;
      const dy = (this.end[1] - this.start[1]) / 2;
      return [this.start[0] + dx, this.start[1] + dy];
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
      this.text = prompt();
    },
    deleteLink () {
      this.$emit("deleteLink");
    }
  },
  watch: {
    text: function () {
      this.$emit("changeLineLabel", this.text);
    },
    select: function () {
      this.$emit("changeLineSelected", this.select);
    }
  },
  computed: {
    pathStyle () {
      return {
        stroke: this.select ? "rgb(2, 136, 8)" : "rgb(255, 136, 85)",
        strokeWidth: 2.73205,
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
      const [arrowX, arrowY] = this.caculateCenterPoint();
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${arrowY}) rotate(${degree})`;
    },
    arrowTransformHorizontal () {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${arrowY + 25})`;
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
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${change})`;
    },
    compText () {
      let change = this.text;
      return (this.$props.label = `${change}`);
    },
    compselect () {
      let change = this.select;
      return (this.$props.selectedLine = `${change}`);
    },
    dAttr: function () {
      if (this.horizontal) {
        let cx = this.start[0],
          cy = this.start[1] - 70,
          ex = this.linking ? this.end[0] : this.end[0],
          ey = this.linking ? this.end[1] : this.end[1];
        let x1 = cx,
          y1 = cy,
          x2 = ex,
          y2 = ey;
        let halfHeight = y1 / 2;
        let calc = (x1 + x2) / 2;
        if (x1 < x2) {
          return `M ${cx}, ${cy} H ${Math.round(calc)}.${x1}, V ${y2},${ey} H ${ex}`;
        }
        else {
          return `M${x1} ${y1}  V${y1 - this.dragLine} H${x2} V${y2}`

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
  }
};
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
</style>
