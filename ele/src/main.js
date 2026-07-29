// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from "vue-resource"

// 引入公共样式 index.styl集成了 base，icon，mixin ,路径同 App.vue 在 webpack.base.con. js配置别名,只有js可以配置别名
import 'common/stylus/index.styl';

Vue.use(VueResource);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

