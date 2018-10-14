<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop> <!--@click.stop阻止冒泡，否则点击这个元素内任何位置都会向上冒泡导致隐藏-->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li ref="listItem" :key="item.id" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions, mapMutations} from 'vuex'
  import {playMode} from '@/common/js/config'
  import Scroll from '@/base/scroll/scroll'
  import Confirm from '@/base/confirm/confirm'
  import AddSong from '@/components/add-song/add-song'
  import {playerMixin} from '@/common/js/mixin'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        refreshDelay: 120
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      },
      // ...mapGetters([
      //   'sequenceList',
      //   'currentSong',
      //   'playlist',
      //   'mode'
      // ])
    },
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh() // 重新计算（确保计算高度的正确性）
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      showConfirm() { //显示弹框
        this.$refs.confirm.show()
      },
      confirmClear() { // 清空整个列表
        this.deleteSongList()
        this.hide()
      },
      getCurrentIcon(item) { //当前正在播放样式
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item, index) {  //点击播放列表项
        if (this.mode === playMode.random) { // 随机播放
          index = this.playlist.findIndex((song) => { //找到对应的索引值
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true) // 播放状态修改
      },
      scrollToCurrent(current) {  //让列表滚动到当前的歌曲
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        // this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
      deleteOne(item) {  //删除单首歌曲
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.hide()
        }
      },
      addSong() {  //添加歌曲
        this.$refs.addSong.show() // 调取add-song组件里的show方法
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ]),
      ...mapMutations({
        'setCurrentIndex': 'SET_CURRENT_INDEX',
        'setPlayingState': 'SET_PLAYING_STATE'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {  // 监测当前歌曲的变化，若有变化，则滚动到当前歌曲
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrent(newSong)
        }, 20)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
            text-align: left 
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>