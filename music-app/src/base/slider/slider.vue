<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot> <!-- 插槽，外部引用slider组件的地方就会被插入到此处 -->
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :key="index" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from '@/common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0,
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) this._play()
      }, 20)  // 延时保障dom渲染完成，浏览器刷新通常是17毫秒一次，这里也可以用this.$nextTick

      window.addEventListener('resize', () => {
        if (this.slider) {
          this._setSliderWidth(true);
          this.slider.refresh();
        }
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let sliderWidth = this.$refs.slider.clientWidth
        let width = 0
        for (let i=0; i<this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = sliderWidth + 'px';
          width += sliderWidth
        }
        // 如果resize变化，slider已经clone过了，故不用再加2倍sliderWidth了
        if (this.loop && !isResize) width += 2 * sliderWidth
        // 如果是循环切换并且没有重新改变窗口大小 （在初始化BScroll时会克隆两个dom，故得加上 2 * sliderWidth ）
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {   // 初始化slider
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: true,
            threshold: 0.3,
          },
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer);
            this._play()
          }
        })
        this.slider.on('beforeScrollStart', () => { //(此事件经测试只有手动切换图片时才会触发)每次自动轮播前清除下定时器，防止手动切换跟自动切换冲突产生bug           
          if (this.autoPlay) clearTimeout(this.timer)
        })

      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1;
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval)
      }
    },
    activated() { // keep-alive 组件激活时调用。
      if (this.autoPlay) this._play()
    },
    deactivated() {  // keep-alive 组件停用时调用,该钩子在服务器端渲染期间不被调用
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"

  .slider
    position:relative
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>