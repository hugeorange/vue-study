<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive> <!--主要用于保留组件状态或避免重新渲染-->
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import MHeader from '@/components/m-header/m-header';
import Tab from '@/components/tab/tab';
import Player from '@/components/player/player';

export default {
    components: {
      MHeader,
      Tab,
      Player
    }
};
</script>
<style lang="stylus">
@import "~@/common/stylus/variable"
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color $color-theme

#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983
</style>



    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->