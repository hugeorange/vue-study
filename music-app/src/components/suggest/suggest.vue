<template>
  <scroll ref="suggest" 
          class="suggest" 
          :data="result" 
          :pullup="pullup" 
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore" 
          @beforeScroll="listScroll"> <!-- @scrollToEnd="searchMore" 若监听到滚动到底部了，则执行加载更多-->
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" :key="index" v-for="(item, index) in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- 上拉加载做的不好，应该 -50 给提示文案触发 -->
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {mapMutations, mapActions} from 'vuex'
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
  import NoResult from '@/base/no-result/no-result'
  import {search} from '@/api/search' // 数据搜索结果
  import {ERR_OK} from '@/api/config'
  import {createSong} from '@/common/js/song'
  import Singer from '@/common/js/singer'

  const TYPE_SINGER = 'singer' // 用于区分数据是歌手还是歌曲用的
  const perpage = 20 //列表每次加载数据的数量

  export default {
    name: 'suggest',
    components: {
      Scroll,
      Loading,
      NoResult
    },
    props: {
      showSinger: {  //是否显示歌手
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        pullup: true, //表示需要上拉刷新
        beforeScroll: true,
        hasMore: true,  // 还有更多
        result: []  // 搜索结果
      }
    },
    methods: {
      // 代理scroll refresh 方法
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() { // 调取搜索数据
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0) // 重置滚动到顶部
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() { // 滚动到底部，搜索加载更多数据
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      listScroll() { // 监听到scroll组件派发出来的beforeScroll事件时执行
        this.$emit('listScroll') //对外派发listScroll事件
      },
      selectItem(item) { // 点击搜索列表
        if (item.type === TYPE_SINGER) { // 假如点击的是歌手，则进入歌手详情页
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {  // 搜索结果歌曲的点击
          this.insertSong(item)
        }
        this.$emit('select', item)  // 对外派发select事件
      },

      getDisplayName(item) { // 搜索结果列表name处理
        return item.type === TYPE_SINGER ? item.singername : `${item.name}-${item.singer}`
      },
      getIconCls(item) { // 搜索结果列表前小图标类型判断（歌手或歌曲）
        return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },

      _genResult(data) {  // 处理结果数据
        let ret = []
        if (data.zhida && data.zhida.singerid) { // 歌手数据
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
          console.log({...data.zhida, ...{type: TYPE_SINGER}},'1111')
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) { // 数据处理，处理歌曲数据
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore(data) {  //检测是否还有更多数据
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {  // 监测query数据变化
        this.search(newQuery)  // 调用search方法，调取服务端搜索到的数据
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        text-align: left 
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>