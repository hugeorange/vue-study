<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1 // 1：滚动结束时派发 3：实时监听
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: { //是否监听滚动事件
        type: Boolean,
        default: false
      },
      data: { // 数据
        type: Array,
        default: null
      },
      pullup: {  // 上拉刷新
        type: Boolean,
        default: false
      },
      beforeScroll: {  // 开始滚动前
        type: Boolean,
        default: false
      },
      refreshDelay: { //刷新延时时间
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {   // 初始化scroll
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) {   // 假如监听滚动事件（listview.vue组件用到）
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }

        if (this.pullup) {  // 假如开启了上拉刷新（suggest组件用到）
          this.scroll.on('scrollEnd', () => { // 监听scrollEnd事件(当滚动结束时会派发该事件)            
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd') // 派发scrollToEnd事件（scrollToEnd表示滚动到底部了）
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll') // 派发beforeScroll事件（suggest组件里有做监听）
          })
        }
      },
      disable() { // 禁用 better-scroll，事件回调函数不再响应。
        this.scroll && this.scroll.disable()
      },
      enable() { // 启用 better-scroll, 默认 better-scroll。
        this.scroll && this.scroll.enable()
      },
      refresh() { // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
        this.scroll && this.scroll.refresh()
      },
      scrollTo() { // 滚动到指定的位置。
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {  // 滚动到指定的目标元素。
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {  //  数据变化，组件自动refresh高度
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
