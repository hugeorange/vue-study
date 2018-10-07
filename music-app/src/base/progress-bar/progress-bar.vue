<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div> <!--已经走过的进度-->
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from '@/common/js/dom'

  const progressBtnWidth = 16  // 进度条的小球宽度
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}   // touch对象，用于在不同的回调函数中共享一些数据，把数据挂载到这个对象上
    },
    methods: {
      progressTouchStart(e) {   // touch开始
        this.touch.initiated = true  //定义一个标志位，表示已经初始化了
        this.touch.startX = e.touches[0].pageX  // 记录点击位置
        this.touch.left = this.$refs.progress.clientWidth  // 进度条已经走过的宽度
      },
      progressTouchMove(e) {  // touchMove移动
        if (!this.touch.initiated) return
        const deltaX = e.touches[0].pageX - this.touch.startX   //偏移量 
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
        this._triggerPercent(false)
      },
      progressTouchEnd() {  // touch结束
        this.touch.initiated = false
        this._triggerPercent()
      },

      progressClick(e) { //进度条点击出发
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      // 触发percent的改变, 通过 flag 判断是 touchmove时触发，还是touchEnd 时触发
      _triggerPercent(flag) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth  // 运动的比例
        this.$emit('percentChange', percent, flag)  //通过percentChange事件把percent派发出去
      },
      _offset(offsetWidth) { // 进度条跟小球的移动
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {  // 若不加!this.touch.initiated这个条件进度条会跳动
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条的宽度
          const offsetWidth = newPercent * barWidth    // 偏移的宽度   歌曲播放的比例＊进度条的宽度
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>