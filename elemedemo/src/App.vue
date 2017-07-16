<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
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
            <router-view :seller="seller"></router-view>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header.vue'
import {urlParse} from 'common/js/utils'

export default {
    data() {
        return {
            seller:{
                id:(() => {
                    let queryParam = urlParse();
                    return queryParam.id;
				})()
			}
        }
    },
    components:{
        'v-header':header
    },
    created() {
        // 创建完成 vue 实例后即请求接口，将值赋给 seller，继而通过 props将获得值传给子组件
        this.$http.get('./api/seller?id=' + this.seller.id).then((response) => {
//            this.seller = response.data.data;
			console.log(response.data.data);
			if(response.data.errno === 0){
				this.seller = Object.assign({}, this.seller, response.data.data);
//				this.seller = response.data.data;
				console.log(this.seller.id);
			}
        });
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

// 不可在在 webpack.base.con.js里面配置 alias别名
@import "./common/stylus/mixin.styl"

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    color: #2c3e50;
}
#app
    .tab
        display:flex
        width:100%
        height:40px
        line-height:40px
        // border-bottom:1px solid rgba(7,17,27,0.1)
        border-1px(rgba(7,17,27,0.1))

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
