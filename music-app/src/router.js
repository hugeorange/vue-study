import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';

Vue.use(Router);

const Recommend = () => import(/* webpackChunkName: "recommend" */ '@/components/recommend/recommend');
const Singer = () => import(/* webpackChunkName: "singer" */ '@/components/singer/singer');
const Rank = () => import(/* webpackChunkName: "rank" */ '@/components/rank/rank');
const Search = () => import(/* webpackChunkName: "search" */ '@/components/search/search');
const User = () => import(/* webpackChunkName: "user-center" */ '@/components/user-center/user-center');
const SingerDetail = () => import(/* webpackChunkName: "singer-detail" */ '@/components/singer-detail/singer-detail');
const Disc = () => import(/* webpackChunkName: "disc" */ '@/components/disc/disc');
const TopList = () => import(/* webpackChunkName: "top-list" */ '@/components/top-list/top-list');

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
      path: '/user',
      name: 'user',
      component: User
    },

    // {
    //   path: '/home',
    //   name: 'home',
    //   component: Home,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
