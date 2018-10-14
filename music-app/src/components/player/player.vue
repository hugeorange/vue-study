<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" 
          @touchstart.prevent="middleTouchStart" 
          @touchmove.prevent="middleTouchMove" 
          @touchend="middleTouchEnd">

          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>

          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text"  :class="{'current': currentLineNum ===index}" :key="index" v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>

        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <!--进度条-->
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i  @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>

        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i> <!--@click.stop 阻止冒泡-->
          </progress-circle>
        </div>

        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
     <!--音乐播放通过audio实现，歌曲在播放时会派发@timeupdate 事件-->
    <audio ref="audio" :src="currentSong.url" @playing="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation' // 第三方动画插件,js动画的编程方式

  import {prefixStyle} from '@/common/js/dom' //前缀
  import ProgressBar from '@/base/progress-bar/progress-bar' //条状进度条
  import ProgressCircle from '@/base/progress-circle/progress-circle' // 圆圈进度条
  import {playMode} from '@/common/js/config'
  import {shuffle} from '@/common/js/util'
  import {getLyric} from '@/api/song'
  import Lyric from 'lyric-parser' // 歌词的解析（作者自己写的一个包）
  import Scroll from '@/base/scroll/scroll'
  import {playerMixin} from '@/common/js/mixin'
  import Playlist from '@/components/playlist/playlist'

  const transform = prefixStyle('transform') //前缀
  const transitionDuration = prefixStyle('transitionDuration') //前缀

  export default {
    mixins: [playerMixin],  // 混入
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist,
    },
    data() {
      return {
        songReady: false,  // 歌曲ready, 初始值应为false 为调试方便故改成 true
        currentTime: 0, // 当前播放进度
        radius: 32, // 小进度条半径
        currentLyric: null, // 歌词
        currentLineNum: 0, // 歌词行数
        currentShow: 'cd', 
        playingLyric: '',
      }
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      // 歌曲未ready状态，不能点击
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      // 放入 playermixin
      // iconMode() { // 播放模式
      //   let mode = "";
      //   if (this.mode === playMode.sequence) {
      //     mode = "icon-sequence"
      //   } else if (this.mode === playMode.loop) {
      //     mode = "icon-loop"
      //   } else {
      //     mode = "icon-random"
      //   }
      //   return mode
      // },
      ...mapGetters([
        'fullScreen',
        // 'playlist',
        // 'currentSong',
        'playing',
        'currentIndex',
        // 'mode',
        // 'sequenceList', // 顺序播放列表
      ])
    },
    created() {
      this.touch = {}  // touch 不需要数据监听

    },
    methods: {
      // 播放列表显隐
      showPlaylist() {
        this.$refs.playlist.show();
      },
      // 获取歌词
      getLyric() {
          this.currentSong.getLyric().then(lyric => {
            // 当切换歌曲切换时歌词也会切换，也会重新new，判断 当前歌词与缓存中的歌词相同时，才去new 否则就return
            if (this.currentSong.lyric !== lyric) return
            this.currentLyric = new Lyric(lyric, this.handleLyric)
            if (this.playing) {
              this.currentLyric.play()
            }
          }).catch(() => {
            this.currentLyric = null
            this.playingLyric = ""
            this.currentLineNum = 0
          }) 
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5 && this.$refs.lyricLine.length) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]  // 大于5行滚动
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      // 展开收缩播放器
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      // 动画函数钩子  vue为我们提供的钩子函数，用于实现特定动画效果
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale() // 对象解构赋值        
        let animation = {
          0: {transform: `translate3d(${x}px,${y}px,0) scale(${scale})`},
          60: {transform: `translate3d(0,0,0) scale(1.1)`},  // 放大再缩小
          100: {transform: `translate3d(0,0,0) scale(1)`}
        }
        animations.registerAnimation({  // 注册
          name: 'move',
          animation,
          presets: {
            duration: 1000, // 间隔
            easing: 'linear' // 线性缓动
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)  //运行  done回调函数执行的时候则跳到 afterEnter()
      },
      afterEnter() { // 2、vue为我们提供的钩子函数，用于实现特定动画效果
        animations.unregisterAnimation('move')  // 取消注册
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) { // 3、vue为我们提供的钩子函数，用于实现特定动画效果
        this.$refs.cdWrapper.style.transition = 'all 1s'
        const {x, y, scale} = this._getPosAndScale()        
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)  //监听 transitionend事件
      },
      afterLeave() { // 4、vue为我们提供的钩子函数，用于实现特定动画效果
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      _getPosAndScale() { // 获取位置和缩放比，用于动画(大小CD过渡)
        const targetWidth = 40  // 目标宽度, 左下角小圆圈图
        const paddingLeft = 40  // 左部偏移
        const paddingBottom = 30 // 底部偏移
        const paddingTop = 80 // 大CD距离顶部的高度
        const width = window.innerWidth * 0.8  //  大CD的宽度
        const scale = targetWidth / width   // 缩小比例
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom  //（这里的Y轴跟我们平时的y轴刚好相反，所以是正数）
        return {x, y, scale}
      },

      // 开始/暂停
      togglePlaying() {
        if (!this.songReady) return
        this.setPlayState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev() {
        if (!this.songReady) return
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1          
          if(index === -1) index = this.playlist.length -1 // 第一首
          this.setCurrentIndex(index)
          if (!this.playing) this.togglePlaying()
        }
        this.songReady = false
      },
      next() {
        if (!this.songReady) return

        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if(index === this.playlist.length) index = 0 // 最后一首
          this.setCurrentIndex(index)
          if (!this.playing) this.togglePlaying()
        }
        this.songReady = false
      },
      ready() {  // （为用户快速点击所做的处理）audio 上触发，表示只有this.songReady = true时才可以播放， 歌曲ok
        // 防止切换太快，造成报错 DOMException: The play() request was interrupted by a new load request
        // 用 onPlaying 事件代替 onPlay
        setTimeout(() => {
          this.songReady = true
          this.savePlayHistory(this.currentSong) //存储播放纪录
        })
      },
      error() { // （为用户快速点击所做的处理）audio 上触发，当网络出现错误或下一首歌不存在时触发
        this.songReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime // audio 可读取属性
      },
      end() { // 歌曲播放完毕
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      middleTouchStart(e) {
        this.touch.initated = true
        this.touch.moved = false

        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initated) return
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) return

        // 阻止滚动 歌词scroll时，触发touchend又滚回到第一屏
        if (!this.touch.moved) this.touch.moved = true

        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd(e) {
        if (!this.touch.moved) return

        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = "lyric"
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = "cd"
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = "300ms"
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = 0
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0) //seek to correspond starTime 查找到相应的播放时间点
        }
      },
      onProgressBarChange(percent, flag=true) {
        const currentTime = this.currentSong.duration * percent
        // 通过改变 audio currentTime（改变歌曲播放进度） 
        // 然后利用监听函数 updateTime 改变 data 选项 的选项currentTime 继而改变 percent 影响进度条视图
        if (flag) {
          this.$refs.audio.currentTime = currentTime
          if (!this.playing) this.togglePlaying()
        } else {
          //拖动bar时，不改变播放audio进度，但改变视图效果
          this.currentTime = currentTime
        }
        
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval%60 | 0)
        return `${minute}:${second}`
      },
      _pad(num, n=2) {
        let len = num.toString().length
        while(len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      
      // changeMode() {
      //   const mode = (this.mode + 1) % 3
      //   this.setPlayMode(mode) // 改变样式
      //   let list = ""
      //   if (mode === playMode.random) {
      //     list = shuffle(this.sequenceList)
      //   } else {
      //     list = this.sequenceList
      //   }
      //   this.resetCurrentIndex(list) // 当 playlist 改变时 保证 currentSong 不变
      //   this.setPlayList(list);
      // },
      // resetCurrentIndex(list) {
      //   let index = list.findIndex(item => item.id === this.currentSong.id)
      //   this.setCurrentIndex(index)
      // },

      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE',
        // setCurrentIndex: 'SET_CURRENT_INDEX',
        // setPlayMode: 'SET_PLAY_MODE',
        // setPlayList: "SET_PLAYLIST",
      }),
      // 添加到播放历史，放到 vuex
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.id) return
        if (newSong.id === oldSong.id) return
        if (this.currentLyric) this.currentLyric.stop()

        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getLyric()
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        setTimeout(() => {
          newPlaying ? audio.play() : audio.pause()
        }, 1000)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite  // cd旋转
              &.pause
                animation-play-state: paused  // 停止旋转
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>