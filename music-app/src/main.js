import Vue from 'vue';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload'
import App from './App.vue';
import router from './router';
import store from './store/index';
import './common/stylus/index.styl';
import VConsole from 'vconsole';

// new VConsole();

Vue.config.productionTip = false;
fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('./assets/logo.png')
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
