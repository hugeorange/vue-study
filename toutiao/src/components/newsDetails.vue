<template>
    <div id="newsDetails">
        <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">
            <span>新闻详情</span>
        </x-header>
        <div class="newsInfo">
            <div class="title">{{ newsInfo.title }}</div>
            <div class="aticle_author" v-if="newsInfo">
                <a href="">
                    <div class="avatar">
                        <img :src="newsInfo.media_user.avatar_url" alt="">
                    </div>
                </a>
                <div class="author-info">
                    <span class="author-name">{{newsInfo.media_user.screen_name}}</span>
                    <img src="https://s3b.pstatp.com/growth/mobile_detail/image/toutiaohao_tag_bc28ef080879ea46945f90a280f66c28.svg" alt="">
                    <div class="time">{{newsInfo.publish_time}}</div>
                </div>
                <div class="gz">关注</div>

            </div>

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
                // console.log('$route0',this.$route.params.id);
                // this.souceUrl = this.$route.params.id;
                // this.requestInfo();
           }
        },
        filter:{
            formatTime(time){
                let time1 = time + '000';

            }
        },
        activated(){
            console.log('activated newsDetails');
            this.souceUrl = this.$route.params.id;
            this.requestInfo();
        },
        updated(){
            console.log('updated newsDetails');
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
            padding: 46px 17px 0 17px;
            margin-top: 12px;
            font-size: 16px;
            background-color: #fff;
            .title{
                font-size: 0.48rem;
                line-height: 0.68rem;
            }
            .aticle_author{
                display: flex;
                align-items: center;
                .avatar{
                    height: 36px;
                    width: 36px;
                    border: none;
                    position: relative;
                    img{
                        width: 100%;
                        height:100%;
                        border-radius: 50%;
                    }
                }
                .author-info{
                    flex: 1;
                    font-size: 12px;
                    padding-left: 10px;
                    .author-name{
                        font-size: 14px;
                        line-height: 16px;
                    }
                    img{
                        padding-left: 5px;
                        height: 16px;
                        margin-bottom: -3px;
                    }
                    .time{
                        line-height: 12px;
                    }
                }
                .gz{
                    background-color: #2a90d7;
                    display: block;
                    text-align: center;
                    color: hsla(0,0%,100%,.96);
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    width: 72px;
                    height: 29px;
                    line-height: 29px;
                    font-size: 14px;
                    border-radius: 6px;
                }
            }
            .news-content{
                margin-top: 10px;
                line-height: 28px;
                img{
                    width: 100%;
                }
            }

        }
    }
</style>
