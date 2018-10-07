<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="silder-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" :key="index" v-for="(item, index) in discList" class="item">
              <div class="icon">
                <!-- <img width="60" height="60" :src="item.imgurl"> -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading title="玩命加载中..."></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {getRecommend, getDiscList} from '@/api/recommend'  // 数据获取
  import {ERR_OK} from '@/api/config'           //接口数据获取成功状态返回码
  import {playlistMixin} from '@/common/js/mixin'
  import Slider from '@/base/slider/slider'
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
export default {
  name: 'Recommend',
  components: {
    Slider,
    Scroll,
    Loading,
  },
  // mixin 解决scroll 组件滚动问题
  mixins: [playlistMixin], 
  data() {
    return {
      recommends: [],
      discList: [],
    }
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist(playlist) {  // 只有这里调用了handlePlaylist方法，才不会报错（覆盖了mixin.js里的抛出异常方法）
      const bottom = playlist.length > 0 ? '60px' : '' // 当存在播放队列
      this.$refs.recommend.style.bottom = bottom  // 用于处理当底部存在mini播放器时遮挡底部列表的bug
      this.$refs.scroll.refresh()
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      })
    },
    _getDiscList() {   // 获取热门歌单数据
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      }, err => {
        console.log(err);
      })
    },
    loadImage() { // 监听图片加载，当第一张banner图片加载出来时，调用scroll的refresh方法,不然不能保证dom是已经渲染好的（需要计算高度），当数据变化时，需要重新refrash
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      'setDisc': 'SET_DISC',
    })
  }
};
</script>

<style lang="stylus">
  @import "~@/common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            text-align: left
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>