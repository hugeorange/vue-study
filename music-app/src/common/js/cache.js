// 本地存储实现,封装localStorage和sessionStorage   https://github.com/ustbhuangyi/storage
import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 搜索历史存储
const SEARCH_MAX_LEN = 15     //最大存储空间

const PLAY_KEY = '__play__'    // 播放历史存储
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'  // 喜欢收藏历史存储
const FAVORITE_MAX_LEN = 200

/*此方法用于把最新的搜索、播放等数据插入到已有的历史数据中
插入规则：1、若你要插入的这条待存储数据已在已有数据中，并且是已有数据中的第一条，则不做任何操作
         2、若历史存储数据中有这条数据，并且不在第一个位置。则删除这条已有的数据，并且把最新的这条数据放到第一个位置
         3、若历史存储数据中没有这条数据，并且存储空间未满，则把数据存入第一个位置*/
// 插入数组中（10-12章节） （compare 为一个比较函数,maxLen为最大允许存储空间）
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare) // http://www.runoob.com/jsref/jsref-findindex.htmlcong
  if (index === 0) {  // 若为第一条数据
    return
  }
  if (index > 0) { // 数组中有这条数据，并且不在第一个位置
    arr.splice(index, 1) // 把先前的数据删掉
  }
  arr.unshift(val) // 插入到第一个位置
  if (maxLen && arr.length > maxLen) {  // 超过了最大限制，则把最后一个pop 出来
    arr.pop()
  }
}

function deleteFromArray(arr, compare) { //删除数据
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {   // 搜索存储
  let searches = storage.get(SEARCH_KEY, [])  // 当前存储的搜索历史数据，类型是个数组； 若没有存过的话，则是一个空数组
  insertArray(searches, query, (item) => { // 这里的item是searches数组遍历的每个元素
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches) // 返回一个新数组
  return searches
}

export function deleteSearch(query) { // 删除搜索列表数据
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches) // 返回一个新数组
  return searches
}

export function clearSearch() { //清除搜索纪录列表
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch() {  // 从本地缓存中读取数据
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) { //保存播放列表
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {  
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() { //读取播放列表
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {  //保存我喜欢的
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {  //删除我喜欢的
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

