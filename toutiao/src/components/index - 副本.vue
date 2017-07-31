<template>
  <div id="index">

      <x-header style="background-color: red;">
          <span>今日头条</span>
          <x-icon slot="overwrite-left" type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
          <i  class="ion-android-alarm-clock"></i>
      </x-header>

      <div class="tab-title">
          <scroller lock-y :scrollbar-x=false ref="scrollwrap">
              <ul class="box1">
                  <li class="box1-item" :class="{'active':isCur===index}" v-for="(item,index) in tab_title" @click="highlight(index)">
                    {{item.name}}
                  </li>
              </ul>
          </scroller>
      </div>

      <div class="news-wrapper">
          <ul>
              <li class="news-item" v-for="(item,index) in newsData">
                  <p class="news-title">{{item.title}}</p>
                  <ul class="img-wrapper" v-if="item.image_list">
                      <li v-for="(item,index) in item.image_list">
                          <img :src="item['url']" alt="">
                      </li>
                  </ul>
                  <div class="bottom-title">
                      <span class="avIcon" v-show="item.label==='广告'">广告</span>
                      <span class="writer">{{item.media_name}}</span> &nbsp;&nbsp;
                      <span class="comment_count">评论&nbsp;{{item.comment_count}}</span>
                      <span class="datetime">{{item.datetime|date}}</span>
                  </div>
              </li>
          </ul>
      </div>

  </div>
</template>

<script>
    import { XHeader } from 'vux'
    import { Scroller } from 'vux'
    import {ajax} from '../common/js/ajax'
    export default {
        name:'index',
        components:{
            XHeader,
            Scroller
        },
        data(){
            return {
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
                isCur:0,
                newsData:[]
            }
        },
        methods:{
            request(key) {
                var self = this;
                ajax(key,function (data) {
                    self.newsData = data.data;
                })
            },
            highlight(index){
                this.isCur = index;
                let key = this.tab_title[index]['key'];
                this.request(key);
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
        mounted(){
            this.$nextTick(()=>{
                this.$refs.scrollwrap.reset();
            })
            let key0 = this.tab_title[0]['key'];
            this.request(key0);
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    #index{
        .vux-header{
            position: fixed;
            top:0;
            left:0;
            right:0;
            z-index: 999;
        }
        .ion-android-alarm-clock{
            position: absolute;
            top: 0.03rem;
            right: 0.24rem;
            font-size: 0.60rem;
        }
        .tab-title{
            position: fixed;
            left:0;
            right:0;
            top:0.92rem;
            z-index: 999;
            background-color:#eee;
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
            /*position: relative;*/
            margin-top: 1.62rem;
            margin-bottom: 1.0rem;
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
                        width:32%;
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
</style>
