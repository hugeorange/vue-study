// [min, max]
// 返回min和max之间的一个随机数，包括max和min
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)  // Math.random() * (max - min + 1)返回的是max-min中间的一个数(包括max)，要想取到min跟max之间的数，还得＋min
}

// 洗牌函数（打乱数组）
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 节流函数，延迟执行（search-box组件有用到） 参考：http://www.alloyteam.com/2012/11/javascript-throttle/
export function debounce(func, delay) {
  let timer

  return function (...args) {     
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {  // 延迟执行我们要节流的函数      
      func.apply(this, args)
    }, delay)
  }
}