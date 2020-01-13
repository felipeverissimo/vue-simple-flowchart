<template>
  <g @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <path :d="dAttr" :style="pathStyle"></path>
    <a v-if="show.delete" @click="deleteLink">
      <text text-anchor="middle" :transform="arrowTransform" font-size="22"
        >&times;</text
      >
    </a>
    <a v-else>
      <text text-anchor="middle" :transform="textTransform" font-size="22">{{
        text
      }}</text>
    </a>
    <a v-if="show.delete" @dblclick="changeLink">
      <text text-anchor="middle" :transform="changeTransform" font-size="22"
        >Editar
      </text>
    </a>
  </g>
</template>

<script>
export default {
  name: "FlowchartLink",
  props: {
    label: {
      type: String,
      default() {
        return this.text;
      }
    },
    // start point position [x, y]
    start: {
      type: Array,
      default() {
        return [0, 0];
      }
    },
    // end point position [x, y]
    end: {
      type: Array,
      default() {
        return [0, 0];
      }
    },
    id: Number
  },
  data() {
    return {
      text: this.compText,
      show: {
        delete: false
      }
    };
  },
  methods: {
    handleMouseOver() {
      if (this.id) {
        this.show.delete = true;
      }
    },
    handleMouseLeave() {
      this.show.delete = false;
    },
    caculateCenterPoint() {
      // caculate arrow position: the center point between start and end
      const dx = (this.end[0] - this.start[0]) / 2;
      const dy = (this.end[1] - this.start[1]) / 2;
      return [this.start[0] + dx, this.start[1] + dy];
    },
    caculateRotation() {
      // caculate arrow rotation
      const angle = -Math.atan2(
        this.end[0] - this.start[0],
        this.end[1] - this.start[1]
      );
      const degree = (angle * 180) / Math.PI;
      return degree < 0 ? degree + 360 : degree;
    },
    changeLink() {
      this.text = prompt();
    },
    deleteLink() {
      this.$emit("deleteLink");
    }
  },
  watch: {
    text: function() {
      this.$emit("changeLineLabel", this.text);
    }
  },
  computed: {
    pathStyle() {
      return {
        stroke: "rgb(255, 136, 85)",
        strokeWidth: 2.73205,
        fill: "none"
      };
    },
    arrowStyle() {
      return {
        stroke: "rgb(255, 136, 85)",
        strokeWidth: 5.73205,
        fill: "none"
      };
    },
    arrowTransform() {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${arrowY}) rotate(${degree})`;
    },
    textTransform() {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      let sideText = arrowX + 50;
      const degree = this.caculateRotation();
      return `translate(${sideText}, ${arrowY}) rotate(${degree} )`;
    },
    changeTransform() {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      let change = arrowY + 35;
      const degree = this.caculateRotation();
      return `translate(${arrowX}, ${change}) rotate(${degree})`;
    },
    compText() {
      let change = this.text;
      return (this.$props.label = `${change}`);
    },
    dAttr() {
      let cx = this.start[0],
        cy = this.start[1],
        ex = this.end[0],
        ey = this.end[1];
      let x1 = cx,
        y1 = cy + 50,
        x2 = ex,
        y2 = ey - 50;
      return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
    }
  }
};
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
</style>
