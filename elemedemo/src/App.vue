<template>
    <div id="app">
        <v-header></v-header>
        <div class="tab">
        	<div class="tab-item">
                <router-link to="/goods">商品</router-link>   
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评论</router-link>   
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>   
            </div>

        </div>
        <!-- 路由外链 -->
        <div>
            <router-view></router-view>            
        </div>
    </div>
</template>

<script >
import header from './components/header/header.vue'
export default {
    components:{
        'v-header':header
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
#app 
    .tab
        display:flex
        width:100%
        height:40px
        line-height:40px
        .tab-item
            flex:1
            text-align:center
            & > a
                display:block
                font-size:14px
                color:#4d555d
            & > a.active
                color:#f01414
</style>
