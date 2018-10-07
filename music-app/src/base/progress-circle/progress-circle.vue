<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle 
        class="progress-background" 
        r="50" 
        cx="50" 
        cy="50" 
        fill="transparent"/>
      <!-- stroke-dasharray：定义描边的虚线长度，如果提供奇数个，
      则会自动复制该值成偶数;stroke-dashoffset：定义虚线描边的偏移量 -->
      <circle 
        class="progress-bar" 
        r="50" 
        cx="50" 
        cy="50" 
        fill="transparent" 
        :stroke-dasharray="dashArray" 
        :stroke-dashoffset="dashOffset"/> 
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {  // 半径 (这里的radius是真正显示在屏幕上的宽度高度)，circle的宽高半径正好是viewBox的一半，这样就能完全填充整个视口
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dashArray: Math.PI * 100  //周长（π*2r）
      }
    },
    computed: {
      dashOffset() {  // 外圈播放进度
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px // 定义圆圈的宽度
      transform-origin: center
      &.progress-background  //进度条底色
        transform: scale(0.9)
        stroke: $color-theme-d  //颜色
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)  // 从12点位置开始
        stroke: $color-theme
</style>