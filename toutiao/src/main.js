// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'

// 如果 在js 引用静态图片，因为webpack 不会解析 js 文件里的图片，所以要用 import 引用或是把图片放在顶层的 static 目录里
// import logo from './assets/loading.gif'

Vue.config.productionTip = false

Vue.use(VueLazyload,{
	preLoad: 1.3,
    loading: '../static/img/loading.gif',
    attempt: 1,
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
