export function hasClass(el, className) { // 判断是否已经有某个class
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)') // (^|\s)意思就是开头或是空符号（\s|$）意思就是结尾或空符号，整个就是匹配所有以空号分割的字符串
  return reg.test(el.className)
}

export function addClass(el, className) { //增加class
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getData(el, name, val) { //获取或设置属性值
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}




// ------------------------------------------解决通过js加样式前缀问题
let elementStyle = document.createElement('div').style

let vendor = (() => {   // 供应商
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {     
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
