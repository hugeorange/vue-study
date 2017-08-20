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



Vue.use(VueLazyload,{
	preLoad: 1.3,
    loading: './static/img/loading.gif',  //static 目录下的文件要用绝对地址引用 /static/[filename]
    attempt: 1,
    listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
});




let history = {
    count:4,    //初识tab切换数量
    '/index':1,
    '/collection':2,
    '/follow':3,
    '/my':4
};
//设置初识sessionStorage
window.sessionStorage.setItem('history',JSON.stringify(history));


router.beforeEach(function (to, from, next) {
    let history = JSON.parse(window.sessionStorage.history);
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
        //如果当前路由没有在 sessionStorage 记录过得话，执行下面逻辑
        ++historyCount;
        history['count'] = historyCount;
        to.path !== '/' && (history[to.path] = historyCount);
        history['transitionName'] = 'forward';
    }

    history = JSON.stringify(history);

    window.sessionStorage.setItem('history',history);

    if (/\/http/.test(to.path)) {
        let url = to.path.split('http')[1];
        window.location.href = `http${url}`
    } else {
        next()
    }
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,    //把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  template: '<App/>',
  components: { App }
});



