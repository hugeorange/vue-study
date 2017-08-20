<template>
  <div id="collection">
      <h5 class="nodata" v-if="newsList.length==0">
          <div>暂无数据</div>
          <h5>(快去收藏新闻吧)</h5>
      </h5>

      <ul class="news-content" >

          <router-link class="news-item" v-for="(item,index) in newsList"
                       :to ='{
                        path: "/newsDetails" + item.source_url,
                        query:{
                            newsItem:JSON.stringify(item)
                        }
                   }'

                       tag='li'
                       :key='index'
          >

              <p class="news-title">{{item.title}}</p>
              <ul class="img-wrapper" v-if="item.image_list">
                  <li v-for="(item,index) in item.image_list">
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
      </ul>

      <router-view></router-view>

  </div>
</template>

<script>
    import {utils} from '../common/js/utils'
    import bottom from '../components/bottom'
  export default {
      name:'collection',
      components:{
          bottom
      },
      data(){
          return {
              newsList : [],
          }
      },
      created(){
          if(utils.localstorage.readdata('news')){
              let list = utils.localstorage.readdata('news');
              console.log(list);
              this.$store.commit('initCollection',list);
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
      },
      activated(){
          this.newsList = this.$store.state.collectionNews;
          console.log(this.newsList);
      },
      updated(){
      }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

#collection{
    width: 100%;
    position: absolute;
    min-height: 100%;
    .nodata{
        text-align: center;
        color: #ccc;
        font-size: 28px;
        margin-top: 200px;
        line-height: 40px;
    }
    .news-content {
        z-index:10;
        background-color: #fff;
        margin-bottom: 50px;
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
</style>
