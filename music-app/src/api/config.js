export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}

export const options1 = { // 解决歌单数据获取报错问题另外定义 https://segmentfault.com/q/1010000010051040
  param: 'jsonpCallback',
  prefix: 'playlistinfoCallback'  // 重定义回调函数名称 https://github.com/webmodules/jsonp
}


export const RESFULURL = process.env.NODE_ENV == 'development' ? 'http://localhost:3003/api/music/' : 'http://admin.code-sky.cn/api/music/'

export const ERR_OK = 0