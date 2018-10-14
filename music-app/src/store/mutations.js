import * as types from './mutation-types'

const mutations = {  // 对象里挂载的是一些方法
  // 方法名：types.SET_SINGER  第一个参数state，它能获取当前状态树state.js里的state
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },

  /** 播放器相关 */
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  /** 播放器相关 */

  // 歌单
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  
  // 排行榜
  [types.SET_TOP_LIST](state, topList) { // 可以查看rank.vue里 selectItem方法的说明
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
  
  // 操作 最喜欢列表，== 保存 和 删除
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  }
}
export default mutations
