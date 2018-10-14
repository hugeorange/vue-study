<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>

    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <!-- <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut"> -->
      <scroll class="shortcut" :data="shortCut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click="addQuery(item.k)" v-for="(item ,index) in hotKey" :key="index">{{item.k}}</li>
            </ul>
          </div>
          <!--搜索历史纪录数据-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @listScroll="blurInput" @select="saveSearch" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import SearchBox from '@/base/search-box/search-box'
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import SearchList from '@/base/search-list/search-list'
import Suggest from '@/components/suggest/suggest'
import {ERR_OK} from '@/api/config'
import {getHotKey} from '@/api/search'  // 获取热门搜索关键字
import {playlistMixin} from '@/common/js/mixin'
export default {
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  mixins: [playlistMixin], 
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  computed: {
    shortCut() {
      // 只有有一个变化就会刷新hscroll
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory',
    ])
  },
  created() {
    this._getHotKey();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    onQueryChange(query) {
      this.query = query
    },
    addQuery(item) {
      this.$refs.searchBox.setQuery(item)
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    showConfirm() {
      this.$refs.confirm.show()
      // this.clearSearchHistory()
    },
    // clearSearchHistory() {
    // },
    // 不用在 method 上挂方法了，直接在 模板中调用 mapActions 定义的方法
    // deleteSearchHistory(item) {
    //   this.deleteSearchHistory(item)
    // },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory',
    ])
  },
  watch: {
    // 监听搜索关键词变化，触发scroll refresh
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
};
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      text-align: left
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>