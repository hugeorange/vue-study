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
                souceUrl:this.$route.params.id,
            }
        },
        created(){
            console.log('created');
        },
        mounted(){
            console.log('created');
            this.requestInfo();
        },
        methods:{
            requestInfo(){
                // debugger
                console.log('requestInfo',this.souceUrl);

                if(this.souceUrl){
                    var url = 'https://m.toutiao.com' + this.souceUrl + 'info/';
                    let self = this;
                    ajax2(url,function(data){
                        self.newsInfo = data.data;
                    },function(msg){
                        alert(msg);
                    })    
                }else{
                    console.log('离开本页，不执行请求！');
                }
                
            }
        },
        watch:{
            '$route'(){
                // debugger
                // console.log('$route0',this.$route.params.id);
                // this.souceUrl = this.$route.params.id;
                // this.requestInfo();
           }
        },
    
        updated(){
            console.log('updated newsDetails' ,this.$route.params)
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
