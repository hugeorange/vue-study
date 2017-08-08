<template>
    <div id="newsDetails">
        <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">
            <span>新闻详情</span>
        </x-header>
        <div class="newsInfo">
            <div class="title">{{ newsInfo.title }}</div>
            <div class="media-user"></div>
            <div class="news-content" v-html = "newsInfo.content"></div>
        </div>
    </div>

</template>
<script>
import { XHeader, Actionsheet, TransferDom, ButtonTab, ButtonTabItem } from 'vux'
import { ajax2 } from '../common/js/ajax' 
    export default{
        // props:['newsItem'],
        components:{
            XHeader,
            Actionsheet,
            TransferDom,
            ButtonTab,
            ButtonTabItem
        },
        data(){
            return {
                newsItem:{},
                souceUrl:'',
                newsInfo:{},
                souceUrl:'',
            }
        },
        created(){
            this.newsItem = this.$route.params.newsItem;
            this.souceUrl = this.newsItem.source_url
        },
        mounted(){
            let self = this;
            var url = 'https://m.toutiao.com' + this.$route.params.newsItem.source_url + 'info/';
            this.requestInfo(url);
        },
        methods:{
            requestInfo(url){
                let self = this;
                ajax2(url,function(data){
                    self.newsInfo = data.data;
                },function(msg){
                    alert(msg);
                })
            }
        },
        watch:{
            '$route'(to,from,next){
                console.log('to-',to,'from-',from)
                if(to.params.newsItem.source_url){
                    let url = 'https://m.toutiao.com' + to.params.newsItem.source_url + 'info/';
                    this.requestInfo(url);    
                }
            }
        },
        updated(){
            console.log('updated',this.$route.params)
            // console.log('222------' + this.$route.params.newsItem.source_url);
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    #newsDetails{
        width: 100%;
        height:100%;
        background-color: #FFF;
        position: relative;
        z-index: 999;
        .vux-header{
            width: 100%;
            position: fixed;
            top: 0;
            background-color: red;
            .vux-header-left .vux-header-back{
                color: #fff;
            }
            .vux-header-left .left-arrow:before{
                border: 1px solid #fff;
                border-width: 1px 0 0 1px;
            }
        }
        .newsInfo{
            margin-top: 46px;
            padding: 0 17px;
            font-size: 16px;
            line-height: 28px;
            background-color: #fff;
            img{
                width: 100%;
            }
        }
    }
</style>
