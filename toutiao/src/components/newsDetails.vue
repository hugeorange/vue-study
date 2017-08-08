<template>
    <div id="newsDetails">
        <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">
            <span>新闻详情</span>
        </x-header>
    </div>

</template>
<script>
import { XHeader, Actionsheet, TransferDom, ButtonTab, ButtonTabItem } from 'vux'
    export default{
        props:['newsItem'],
        components:{
            XHeader,
            Actionsheet,
            TransferDom,
            ButtonTab,
            ButtonTabItem
        },
        created(){
            console.log(this.$route.params.newsItem);
            console.log(111);
        },
        mounted(){
            console.log(this.$route.params.newsItem);
        },
        watch:{
            '$route'(to,from,next){
                console.log(222);
                console.log(to,from);
            }
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    #newsDetails{
        width: 100%;
        height:100%;
        background-color: #FFF;
        position: relative;
        z-index: 999;
    }
</style>
