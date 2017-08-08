import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import collection from '@/components/collection'
import follow from '@/components/follow'
import my from '@/components/my'
import newsDetails from '@/components/newsDetails'

Vue.use(Router)

export default new Router({
  routes: [
      {path: '/',redirect: '/index'},  // 跳转路由，默认显示路由页面
      {path: '/index', name:'index', component: index},
      {path: '/collection', name:'collection', component: collection},
      {path: '/follow', name:'follow', component: follow},
      {path: '/my', name:'my', component: my},
      {path: '/newsDetails', name: 'newsDetails',component:newsDetails },
  ],
    'linkActiveClass':'active'  //为路由匹配激活link-active，方便设置类

})
