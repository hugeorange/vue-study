import Vue from 'vue'
import Router from 'vue-router'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'


// console.log(goods);
Vue.use(Router);

export default new Router({
  routes: [
    { path: '/goods',component: goods },
    { path: '/ratings',component: ratings },
    { path: '/seller',component: seller },
    {path: '/',redirect: '/goods'}  // 跳转路由，默认显示路由页面
  ],
  'linkActiveClass':'active'  //为路由匹配激活link-active，方便设置类
})
