import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Recommend from '@/components/recommend/recommend';
import Singer from './components/singer/singer';
import Rank from './components/rank/rank';
import Search from './components/search/search';
import SingerDetail from './components/singer-detail/singer-detail';
import Disc from './components/disc/disc';
import TopList from './components/top-list/top-list';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'  // 指定跳转地址
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      // name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail,
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail,
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
