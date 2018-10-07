// 获取数据并进行二次处理 (getters是对数据的映射)，类似计算属性

export const singer = state => state.singer

export const playing = state => state.playing // 播放器播放状态

export const fullScreen = state => state.fullScreen // 播放器展开还是收起

export const playlist = state => state.playlist // 播放列表

export const sequenceList = state => state.sequenceList // 顺序播放列表

export const mode = state => state.mode // 播放模式

export const currentIndex = state => state.currentIndex // 当前播放的索引

export const currentSong = (state) => { // 当前播放的歌曲
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc //歌单

export const topList = state => state.topList // 排行榜

export const searchHistory = state => state.searchHistory   // 搜索历史

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList
