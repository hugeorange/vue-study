<template>
  <div class="music-list">
    <div class="back" @click="back"> <!--返回按钮-->
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1> <!--标题-->
    <div class="bg-image" :style="bgStyle" ref="bgImage"> <!--背景图-->
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">  <!-- v-show="songs.length>0" 等歌曲加载了再显示-->
          <i class="icon-play"></i>
          <span class="text" @click="random">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div> <!--背景图过滤蒙板-->
    </div>

    <div class="bg-layer" ref="layer"></div> <!--背景层（歌曲列表向上滚动时跟着生成的蒙板层）-->

    <scroll :data="songs" @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex' // vuex的语法糖，对应action.js
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
  import SongList from '@/base/song-list/song-list'  // 歌曲列表组件
  import {prefixStyle} from '@/common/js/dom'
  import {playlistMixin} from '@/common/js/mixin'

  const RESERVED_HEIGHT = 40  // 预留高度
  const transform = prefixStyle('transform')  //加前缀
  const backdrop = prefixStyle('backdrop-filter') //加前缀

  export default {
    // 混合 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。
    mixins: [playlistMixin],
    props: {
      bgImage: {  //背景图
        type: String,
        default: ''
      },
      songs: {  //歌曲列表
        type: Array,
        default: []
      },
      title: {  //标题
        type: String,
        default: ''
      },
      rank: {  //排行
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() { // 背景图片样式通过计算属性得到
        return `background-image:url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true  //监听滚动
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight  // 图片的高度
      this.$refs.list.$el.style.top = `${this.imageHeight}px` // 滚动区域距离顶部的距离
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT // bg-layer 移动距离
    },
    methods: {
      handlePlaylist(playlist) {  // 只有这里调用了handlePlaylist方法，才不会报错（覆盖了mixin.js里的抛出异常方法）
        const bottom = playlist.length > 0 ? '60px' : '' // 当存在播放队列
        this.$refs.list.$el.style.bottom = bottom  // 用于处理当底部存在mini播放器时遮挡底部列表的bug
        this.$refs.list.refresh()
      },
      scroll(pos) {  // 监听滚动事件得到scrollY值
        this.scrollY = pos.y
      },
      back() {  // 返回列表页
        this.$router.back()
      },
      // 接收从子组件song-list派发出来 select 的事件
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,  // 播放整个列表，把this.songs传进去
          index
        })
      },
      random() { // 随机播放
        this.randomPlay({
          list: this.songs
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay',
      ])
    },
    watch: {
      scrollY(newVal) {  // 通过监听scrollY的值变化   
        // 遮罩层可滚动的距离不做处理也可
        let translateY = Math.max(this.minTransalteY, newVal) // 遮罩层最远可滚动的距离

        let scale = 1  // 图片放大
        let zIndex = 0  // 图片背景层的zIndex值(不设置该值，歌曲列表的文字图层就会高于图片)
        let blur = 0  // 高斯模糊
        const percent = Math.abs(newVal / this.imageHeight) //scale比例公式        
        if (newVal > 0) { // 往下拉时图片比例的变化
          scale = 1 + percent
          zIndex = 10
        } else {  //往上滑动newVal为负值，背景图会有高斯模糊并逐渐加深
          blur = Math.min(20, percent * 20)
        }

        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`  // 只有ios手机支持这高斯模糊效果
        if (newVal < this.minTransalteY) { // 滚动到顶部（距离顶部还有40px），设置图片层级高于文字
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none' //playBtn是绝对定位的，若在此不隐藏掉，则当bgImage的高度变成40px时playBtn会定位在它上面
        } else { 
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      Scroll,
      Loading,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image   //头部背景图样式的设置
      position: relative
      width: 100%
      height: 0
      padding-top: 70% // width: 100%,height:0,padding-top: 70%,这样设置背景图长宽比例 10：7 好办法
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>