<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" :key="index" class="item" v-for="(song, index) in songs">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {  // 歌曲
        type: Array,
        default: []
      },
      rank: {  // 排名
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem(item, index) {  // 传入index是为了知道歌曲是从哪首开始播放
        this.$emit('select', item, index)  // 派发事件，告诉父组件我被点击了
      },
      getDesc(song) {  // 获取描述信息(也可以用filter代替methods方法，因为filter本身就是函数)
        return `${song.singer}·${song.album}`
      },
      getRankCls(index) {  // 获取排名class类
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) {   // 第三名之后的显示数字4、5、6...
        if (index > 2) {
          return index + 1
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      text-align: left 
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>