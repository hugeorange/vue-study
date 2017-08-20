<template>
    <div id="search">


        <x-header>
            <span>搜索</span>
        </x-header>

        <div class="search-keyword">
            <input class="search-input" type="text" v-model.trim="searchval" @keyup.enter="search" placeholder="请输入搜索内容">
            <span class="history" @click="history">历史记录</span>
        </div>

        <div class="news-wrapper" >

            <ul class="news-content" >
                <!--:to = "'/newsDetails' + item.seo_url"-->
                <router-link class="news-item" v-for="(item,index) in searchlist"
                             :to="{
                                path:'/newsDetails' + item.seo_url,
                                query:{newsItem:JSON.stringify(item)}
                             }"
                             tag='li'
                             :key='index'
                             v-if="item.abstract"
                >
                    <p>{{item.seo_url}}</p>
                    <p class="news-title" v-html="replace(item.title)"></p>
                    <!--此处不能使用 过滤器，因其不能转换html标签-->
                    <!--<p class="news-title">{{item.title | replace}}</p>-->
                    <ul class="img-wrapper" v-if="item.image_list">
                        <li v-for="(item,index) in item.image_list">
                            <img v-lazy="item['url']"  alt="">
                        </li>
                    </ul>
                    <div class="bottom-title">
                        <span class="avIcon" v-show="item.label==='广告'">广告</span>
                        <span class="writer">{{item.media_name}}</span> &nbsp;&nbsp;
                        <span class="comment_count">评论&nbsp;{{item.comment_count}}</span>
                        <!--<span class="datetime">{{item.datetime|date}}</span>-->
                    </div>
                </router-link>

            </ul>
            <!-- 路由外联 -->
            <router-view></router-view>

        </div>
    </div>

</template>
<script>
import { XHeader} from 'vux'
import { ajax2 } from '../common/js/ajax'
import { utils } from '../common/js/utils'

    export default{
        // props:['newsItem'],
        components:{
            XHeader
        },
        data(){
            return {
                searchval:'',
                searchlist:[]
            }
        },
        created(){
        },
        mounted(){
        },
        methods:{
            replace(title){
                var inp = this.searchval;
                //gim 正则表达式：全文匹配，忽略大小写，多行匹配，replace 把匹配到的值替换为 下面的形式
                const reg = new RegExp(''+inp+'','gim');
                if(title){
                    return title.replace(reg,'<span class="red">'+inp+'</span>')
                }else{
                    return title;
                }
            },
            search(){
                let input = this.searchval;
                let self = this;
                let url = 'https://www.toutiao.com/search_content/?offset=0&format=json&keyword='+input+'&autoload=true&count=20&cur_tab=1';
                ajax2(url,function(data){
                    self.searchlist = data.data;
                },function(msg){
                    alert(msg);
                })
            },
            history(){
                console.log('history');
            }
        },
        filters:{
            //不能监控 data 选项值
        }




    }
</script>
<style rel="stylesheet/scss" lang="scss">
    #search{
        .red{
            color: red;
        }
        width: 100%;
        background-color: #FFF;
        z-index: 999;
        /*position: relative;*/
        position: absolute;
        top:0;
        .vux-header {
            width: 100%;
            position: fixed;
            top: 0;
            background-color: red;
            z-index: 3;
            .vux-header-left .vux-header-back {
                color: #fff;
            }
            .vux-header-left .left-arrow:before {
                border: 1px solid #fff;
                border-width: 1px 0 0 1px;
            }
            .icon-share3 {
                font-size: 28px;
                position: absolute;
                right: 10px;
            }
        }
        .search-keyword{
            padding: 50px 17px 0 17px;
            .search-input{
                width: 60%;
                padding: 10px 20px;
                border: 1px solid #eee;
            }
            .history{
                color: cornflowerblue;
            }
        }
        .news-wrapper{
            .news-content{
                position:relative;
                z-index:10;
                background-color: #fff;
                .news-item{
                    .news-title{
                        line-height: 0.40rem;
                    }
                    padding: 0.20rem 0.40rem;
                    font-size: 0.32rem;
                    color: #585151;
                    border-bottom: 1px solid #eee;
                    .img-wrapper{
                        display: flex;
                        margin-top: 0.10rem;
                        justify-content: space-between;
                        li{
                            width:2.13rem;
                            height:1.50rem;
                            /*flex: 1;*/
                            img{
                                width:100%;
                            }
                        }
                    }
                    .bottom-title{
                        font-size: 10px;
                        color: #b5b5b5;
                        margin-top: 8px;
                        .avIcon{
                            color: #2a90d7;
                            border: 1px solid rgba(42,144,215,.5);
                            border-radius: 2px;
                            font-size: 8px;
                            padding: 0 2px;
                        }
                    }
                }
            }

        }

    }
</style>


