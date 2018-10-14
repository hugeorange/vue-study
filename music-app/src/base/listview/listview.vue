<template>
<!-- @scroll="scroll" 接收从scroll组件里派发出来的滚动事件 -->
  <scroll @scroll="scroll" 
          :listen-scroll="listenScroll" 
          :probe-type="probeType"
          :data="data" 
          class="listview" 
          ref="listview">
    <!-- 歌手列表 -->
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item, index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="list-shortcut" 
      @touchstart.stop.prevent="onShortcutTouchStart" 
      @touchmove.stop.prevent="onShortcutTouchMove"  
      @touchend.stop> <!-- 侧边快速导航 -->
      <ul>
        <li v-for="(item, index) in shortcutList" 
          :data-index="index" 
          :key="index" 
          class="item" 
          :class="{'current':currentIndex===index}">{{item}}</li>
      </ul>
    </div>
<!-- 当前悬浮标题 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle"> 
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>

    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
  import {getData} from '@/common/js/dom'

  const TITLE_HEIGHT = 30 // 　title高度
  const ANCHOR_HEIGHT = 18  //右侧每个字母锚点的高度(A,B,C,D,E)

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll,
      Loading
    },
    computed: {
      shortcutList() {  // 通过计算属性，运用map方法得到通讯录右侧字母列表［‘热’，A,B,C,D...］
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {  // 获取fixed定位元素title值
        if (this.scrollY > 0) { // 已处于最顶部（this.scrollY==0），再往下拉，this.scrollY > 0
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1  // 该值用来计算title偏移的差值
      }
    },
    created() { // 为什么不把这些放在data中？因为这里不需要观测这些数据的变化
      this.probeType = 3
      this.listenScroll = true  //监听滚动事件，从而获取pos
      this.touch = {}
      this.listHeight = []
    },
    methods: {
      selectItem(item) { // 点击对应歌手
        this.$emit('select', item) // 把事件派发出去(挂载到singer.vue上)
      },
      // 用事件代理的方法触发事件
      onShortcutTouchStart(e) {  // 手指按下触发
        let anchorIndex = getData(e.target, 'index') // 获取当前索引值
        let firstTouch = e.touches[0]  //获取第一个触点         
        this.touch.y1 = firstTouch.pageY  // 页面触点Y坐标
        this.touch.anchorIndex = anchorIndex  // 当前锚点索引
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {     // 滑动时触发
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0  // 滑动后所到的锚点位置（|0向下取整 === Math.floor）
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta  //得到滑动后的锚点索引
        this._scrollTo(anchorIndex)
      },
      refresh() {  // 在父组件singer中被调用
        this.$refs.listview.refresh()
      },
      // scroll.vue组件会派发一个scroll事件出来，用于接收滚动的位置，在此做接收( @scroll="scroll" )
      scroll(pos) {
        // 通过scroll事件得到scrollY
        this.scrollY = pos.y 
      },
      // 数据初始化时 -- 计算每个group的高度 [0, 760, 1030, ...]
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }         
      },
      _scrollTo(index) {
        if (!index && index !== 0) { // 解决onShortcutTouchStart点击［‘热’，A,B,C...Z］最上端及底部存在bug(此时返回的index的值是null,需要过滤掉)
          return
        }
        if (index < 0) {  // 滑动到最顶部（超出了字母“热”）
          index = 0
        } else if (index > this.listHeight.length - 2) { // 滑动到最底部 index > 24 - 2 (超出了字母“Z”)
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]  // 手动设置得到scrollY
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)  //滚动到指定的目标元素（第二个参数是缓动的动画时间）
      }
    },
    watch: {
      data() {  // 监听数据变化，延时监听歌手列表的高度
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) { // 通过监听scrollY值的变化, 计算出 currentIndex 索引值
        const listHeight = this.listHeight              
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]          
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY  //差值，用于fixedTitle
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限 (24-2), currentIndex=[0,1,2,3....22]     
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {  // 通过diff的变化设置偏移量
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
