//多个组件共享的方法、mapGetters等等可以一起放在这里，然后混入到对应的组件中去（好处：节约代码量）


import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util' // 随机播放模式下 洗牌函数

export const playlistMixin = {
  computed: {
    ...mapGetters([ // 通过mapGetters得到playlist
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() { // 当从keep-alive切换过来的时候会触发这个事件
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {  // 监听playlist
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() { // 处理playlist (引入playlistMixin的地方都必须调用handlePlaylist方法)
      throw new Error('component must implement handlePlaylist method')  //抛出异常
    }
  }
}

export const playerMixin = {  
  computed: {
    iconMode() {  // 不同播放模式下对应的按钮显示
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {  // 改变播放模式
      const mode = (this.mode + 1) % 3  // (this.mode + 1)下一个播放模式
      this.setPlayMode(mode)  // 改变mode
      let list = null
      if (mode === playMode.random) {  // 随机播放
        list = shuffle(this.sequenceList)
      } else { // 顺序播放或循环播放
        list = this.sequenceList
      }
      this.resetCurrentIndex(list) 
      this.setPlaylist(list)  // 修改了playlist之后，currentSong势必也会跟着改变.所以需要通过resetCurrentIndex重置
    },
    resetCurrentIndex(list) { //目的：为了切换播放模式的时候currentSong并不改变。（currentSong是通过playlist跟currentIndex计算而来的。）
      let index = list.findIndex((item) => {  // findIndex是es6的语法,找出符合条件的数组索引值
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {  // 判断是否是喜欢的歌曲
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    // 映射
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {  // 搜索混入
  data() {
    return {
      query: '',
      refreshDelay: 120  //延迟刷新，从而保证高度是ok的，已经被撑开
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'  // 获取搜索历史纪录数据
    ])
  },
  methods: {
    onQueryChange(query) {   // query值变化就执行（参数里的query是从search-box组件监听得到的newQuery值）
      this.query = query
    },
    blurInput() {  // input框失去焦点 (监听到 search组件中的@listScroll事件时执行－－在手机上，当input获得焦点时会有软键盘弹出； 这里要做的是当滚动搜索结果列表时软键盘消失)
      this.$refs.searchBox.blur()  // 父组件调用子组件里的blur方法
    },
    addQuery(query) {  // 点击热门搜索关键字， 执行search-box组件里的setQuery方法
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)  // 把当前的query存进去
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
