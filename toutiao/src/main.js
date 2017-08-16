// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入 vuex
import store from './store/'
import VueLazyload from 'vue-lazyload'

// 如果 在js 引用静态图片，因为webpack 不会解析 js 文件里的图片，所以要用 import 引用或是把图片放在顶层的 static 目录里
// import logo from './assets/loading.gif'

Vue.config.productionTip = false;

console.log(store);


Vue.use(VueLazyload,{
	preLoad: 1.3,
    loading: '../static/img/loading.gif',
    attempt: 1,
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,    // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  template: '<App/>',
  components: { App }
});













/*
 router.beforeEach(function (to, from, next) {
 let history = window.sessionStorage.__router__;
 if(!history){
 history = {};
 }else{
 history = JSON.parse(history);
 }
 let historyCount = history.count * 1;
 const toIndex = history[to.path];        // 要去的索引
 const fromIndex = history[from.path];    //要离开的索引
 if (toIndex) {
 if (!fromIndex || parseInt(toIndex) > parseInt(fromIndex) || (toIndex === '0' && fromIndex === '0')) {
 history['transitionName'] = 'forward';
 } else {
 history['transitionName'] = 'reverse';
 }
 } else {
 //第一次没有记录session-storage 的情况
 ++historyCount;
 history['count'] = historyCount;

 to.path !== '/' && (history[to.path] = historyCount);
 history['transitionName'] = 'forward';
 }
 history = JSON.stringify(history);
 window.sessionStorage.__router__ = history;
 if (/\/http/.test(to.path)) {
 let url = to.path.split('http')[1];
 window.location.href = `http${url}`
 } else {
 next()
 }
 });
 */

