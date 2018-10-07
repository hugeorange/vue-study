import {playMode} from '@/common/js/config' // 播放模式
import {loadSearch, loadPlay, loadFavorite} from '@/common/js/cache' //从本地缓存中读取数据

// state：用来存放组件之间共享的数据。他跟组件的data选项类似，只不过data选项是用来存放组件的私有数据
const state = {
  singer: {}, // 歌手

  // 播放器相关属性
  playing: false, // 播放器播放状态
  fullScreen: false, // 播放器展开还是收起
  playlist: [], // 播放列表
  sequenceList: [], // 顺序播放列表（播放模式不一样时，sequenceList跟playlist可能不一样， 当播放模式是顺序播放时，两者一致）
  mode: playMode.sequence, // 播放模式(默认顺序播放)
  currentIndex: -1, // 当前播放的索引（当前播放的是哪首歌，当切换上一首下一首时用到）
  
  // 歌单
  disc: {},
  // 榜单
  topList: {}, 
  // 搜索历史
  searchHistory: loadSearch(), //搜索历史,从本地缓存中读取数据
  
  playHistory: loadPlay(),  // 播放历史
  favoriteList: loadFavorite() // 我喜欢的
}

export default state