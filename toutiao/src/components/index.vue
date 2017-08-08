<template>
    <div id="index">

      <!-- <x-header style="background-color: red;">
          <span>今日头条</span>
          <x-icon slot="overwrite-left" type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
          <i  class="ion-android-alarm-clock"></i>
      </x-header> -->

    <!-- <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">
        <span>今日头条</span>
    </x-header> -->

    <div class="header-x">
        <i class="icon iconfont icon-mail_fill" @click="email"></i>
        <span class="title">今日头条</span>
        <i class="icon iconfont icon-search1" @click="search"></i>
    </div>


    <div v-transfer-dom >
       <actionsheet v-model="showMenus" :menus="menus" @on-click-menu="bottommenu" show-cancel></actionsheet>
    </div>


    <div class="tab-title" ref='tab_title_hook'>
        <ul class="box1">
            <li class="box1-item" :class="{'active':isCur===index}" v-for="(item,index) in tab_title" @click="highlight(index)">
                {{item.name}}
            </li>
        </ul>
    </div>


      <div class="news-wrapper" ref="news_hook">

          <ul class="news-content" ref="news_con">
              <!--下拉刷新-->
              <div class="loading" v-show="loadingShow">
                  <img src="../assets/loading.gif" alt="">
              </div>

              <li class="news-item" v-for="(item,index) in newsData"  @click="newsinfo">
                  <router-link
                      :to="{
                            name:'newsDetails',
                            params:{
                                newsItem:item
                            }
                      }"
                  >

                      <p class="news-title">{{item.title}}</p>
                      <ul class="img-wrapper" v-if="item.image_list">
                          <li v-for="(item,index) in item.image_list">
                              <!-- :src="item['url']" -->
                              <img v-lazy="item['url']"  alt="">
                          </li>
                      </ul>
                      <div class="bottom-title">
                          <span class="avIcon" v-show="item.label==='广告'">广告</span>
                          <span class="writer">{{item.media_name}}</span> &nbsp;&nbsp;
                          <span class="comment_count">评论&nbsp;{{item.comment_count}}</span>
                          <span class="datetime">{{item.datetime|date}}</span>
                      </div>
                  </router-link>

                  <router-view :newsItem="item"></router-view>

              </li>

              <!-- 上拉加载 -->
              <div class="loading2" v-show="loadingShow2">
                  加载更多...
              </div>
          </ul>

          <!--刷新成功-->
          <div class="load-result" v-show="loadTip">刷新成功</div>


      </div>

    </div>
</template>

<script>
    import { XHeader, Actionsheet, TransferDom, ButtonTab, ButtonTabItem } from 'vux'
    import {ajax} from '../common/js/ajax'
    import BScroll from 'better-scroll'
//    import loading from '../components/loading'
    export default {
        name:'index',
        components:{
            XHeader,
            Actionsheet,
            TransferDom,
            ButtonTab,
            ButtonTabItem
        },
        directives: {
            TransferDom
        },
        data(){
            return {
                menus: {
                    menu1: 'Take Photo',
                    menu2: 'Choose from photos'
                },
                showMenus: false,

                tab_title:[
                    {'name':'推荐','key':'__all__'},
                    {'name':'热点','key':'news_hot'},
                    {'name':'社会','key':'news_society'},
                    {'name':'娱乐','key':'news_entertainment'},
                    {'name':'科技','key':'news_tech'},
                    {'name':'汽车','key':'news_car'},
                    {'name':'体育','key':'news_sports'},
                    {'name':'财经','key':'news_finance'},
                    {'name':'军事','key':'news_military'},
                    {'name':'国际','key':'news_world'},
                    {'name':'时尚','key':'news_fashion'},
                ],
                isCur:0,        //当前点击的tab页
                newsData:[],    //新闻列表
                loadingShow:false,   //控制下拉刷新 load
                loadingShow2:false,  //控制上啦加载 load
                loadTip:false,      //刷新成功提示条
                tabkey:''           //缓存当前选中的 tab页对应的 key
            }
        },
        methods:{
            bottommenu(menu){
                console.log(menu)
            },

            email(){
                console.log('email');
            },
            search(){
                console.log('search');
            },

            request(key,fn) {
                var self = this;
                ajax(key,function (data) {
                    self.newsData = data.data;
                    self.$nextTick(()=>{
                        self._initScroll();
                        fn && fn();
                    })
                })
            },
            highlight(index){
                //阻止pc 端，点击事件执行多次，（不是自己派发的事件，return）
                //点击事件是靠 better-scroll 派发的
                if(!event._constructed) return;
                this.isCur = index;
                this.tabkey = this.tab_title[index]['key'];
                this.request(this.tabkey);
            },
            newsinfo(){

            },
            //初始化 better-scroll
            _initScroll(){
                let self = this;
                let flagdown = false;
                let flagup = false;

                let scroll = new BScroll(this.$refs.tab_title_hook,{
                    scrollX: true,
                    click:true
                });


                this.news_scroll = new BScroll(this.$refs.news_hook,{
                    click:true,
                    probeType:1
                });


                this.news_scroll.on('scroll',function(pos){
                    console.log('y' + pos.y + '-' + 'this.maxScrollY' + this.maxScrollY);
                    // 下拉刷新
                    if(pos.y > 40){
                        self.loadingShow = true;
                        flagdown = true;

                    }

                    // 上拉加载
                    if(pos.y < this.maxScrollY - 40){
                        self.loadingShow2 = true;
                        flagup = true;
                        console.log('上拉加载。。。');
                    }

                })

                this.news_scroll.on('scrollEnd',function (pos) {
                    console.log('scrollEnd');

                    // 下拉刷新，结束逻辑
                    if(flagdown){
                        console.log('flagdown');
                        flagdown = false;

                        self.request(self.tabkey,function(){
                            self.loadingShow = false;
//                            self.loadTip = true;
//                            setTimeout(function(){
//                                self.loadTip = false;
//                            },1000);
                        });

                    }

                    // 上啦加载，结束逻辑

                    if(flagup){
                        console.log('flagup');
                        flagup = false;

                        ajax(self.tabkey,function (data) {
//                            console.log(data.data);
                            self.newsData = self.newsData.concat(data.data);
                            self.$nextTick(()=>{
                                self.loadingShow2 = false;
//                                self.loadTip = true;
//                                setTimeout(function(){
//                                    self.loadTip = false;
//                                },1000);
                            })
                        });
                    }
                });

            }
        },
        filters: {
            date: function(time) {
                if (!time) {
                    return ''
                }
                let time1 = new Date(time) - 0;
                let time2 = new Date() - 0;
                let time3 = time2 - time1;
                let time4 = parseInt(time3/1000/60);
                let time5;
                if(time4>0){
                    time5 = time4 + '分钟前';
                }else if(time4 <=0){
                    time5 = '刚刚'
                }else if(time4 > 60){
                    time5 = parseInt(time4/60) + '时前';
                }
                return time5;
            }
        },
        watch:{
            '$route'(to,from,next){
                debugger
                console.log(to,from);
            }
        },
        created(){
            let key0 = this.tab_title[0]['key'];
            this.request(key0);
        },
        mounted(){},
        updated(){
            var self = this;
            this.$nextTick(()=>{
                self.news_scroll.refresh();
            })
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    #index{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 50px;
        .header-x{
            position: fixed;
            top:0;
            left:0;
            right:0;
            height: 40px;
            background-color: red;
            z-index: 999;
            text-align: center;
            .title{
                line-height: 40px;
                color: #fff;
                font-size: 18px;
            }
        }
        .icon-search1{
            position: absolute;
            top: 4px;
            right: 12px;
            font-size: 30px;
            color: #fff;
        }
        .icon-mail_fill{
            position: absolute;
            top: 4px;
            left: 12px;
            font-size: 30px;
            color: #fff;
        }

        .v-transfer-dom{
            z-index:99999;
        }

        .tab-title{
            position: fixed;
            left:0;
            right:0;
            top:0.92rem;
            z-index: 999;
            background-color:#eee;
            overflow: hidden;
            .box1{
                /*display: flex;*/
                overflow: hidden;
                background-color: #f4f5f6;
                width:11.0rem;
                position: relative;
                .box1-item{
                    font-size: 0.28rem;
                    text-align: center;
                    width:1.0rem;
                    height:0.70rem;
                    line-height: 0.70rem;
                    float: left;
                    &.active{
                        color: red;
                    }
                }
            }
        }
        .news-wrapper{
            position:absolute;
            left:0;
            right:0;
            width:100%;
            top:1.62rem;
            bottom:0;
            background-color: #fff;
            overflow: hidden;
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
        .loading{
            /*position:absolute;*/
            /*left:0;*/
            //-top:-25px;
            width:100%;
            text-align:center;
            color:green;
            font-size:18px;
            //z-index:-1;
            img{
                width:100px;
            }
        }
        .load-result{
            position: absolute;
            left: 0;
            right: 0;
            top: 30px;
            text-align: center;
            height: 30px;
            width: 80px;
            background-color: #000;
            color: #fff;
            border-radius: 5px;
            z-index: 999;
            font-size: 14px;
            line-height: 30px;
            margin: 0 auto;
        }
        .loading2{
            text-align: center;
            padding: 10px;
        }
    }
</style>
<!--因为 我们现在用的框架里 ，有一个 utils 文件，里面有个 通用弹框，每次需要使用的时候 ，直接 utils.alert('提示语句',function(){}) 就可以了，所以我猜有这样的想法-->
