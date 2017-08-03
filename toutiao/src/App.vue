<template>
  <div id="app">
      <div class="tabwrap">
          <div class="tab-item">
              <router-link to="/index">
                  <div class="icon icon1"></div>
                  <div class="icon-word">首页</div>
              </router-link>
          </div>
          <div class="tab-item">
              <router-link to="/collection">
                  <div class="icon icon2"></div>
                  <div class="icon-word">收藏</div>
              </router-link>
          </div>
          <div class="tab-item">
              <router-link to="/follow">
                  <div class="icon icon3"></div>
                  <div class="icon-word">关注</div>
              </router-link>
          </div>
          <div class="tab-item">

              <router-link to="/my">
                  <div class="icon icon4"></div>
                  <div class="icon-word">我的</div>
              </router-link>
          </div>
      </div>

      <router-view></router-view>
      
      <!-- loading层 -->
      <div class="loadEffect">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
      </div>      


  </div>
</template>

<script>
  import {Tabbar,TabbarItem} from 'vux'
  import {ajax} from './common/js/ajax'
  export default {
      name: 'app',
      components:{
          Tabbar,
          TabbarItem
      },
      methods:{

      },
      watch:{
          routes(){

          }
      },
      created(){
//          console.log(this.$route);
      },
      updated(){

      }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "./common/scss/index";
    #app{
        height:100%;
        .tabwrap{
            width: 100%;
            position: fixed;
            left:0;
            right:0;
            bottom: 0;
            background-color: #fff;
            display: flex;
            height:45px;
            padding-top: 5px;
            z-index:9999;
            @include border-1px(#eee);

            .tab-item{
                flex:1;
                text-align: center;
                .icon{
                    width:0.48rem;
                    height:0.48rem;
                    background-size: 100% auto;
                    background-repeat: no-repeat;
                    margin: 0 auto;
                    &.icon1{
                        background-image: url(./assets/demo/icon11.png);
                    }
                    &.icon2{
                        background-image: url(./assets/demo/icon21.png);
                    }
                    &.icon3{
                        background-image: url(./assets/demo/icon31.png);
                    }
                    &.icon4{
                        background-image: url(./assets/demo/icon41.png);
                    }
                }
                .icon-word{
                    font-size: 12px;
                    margin-top: 5px;
                }
                & .active{
                    .icon1{
                        background-image: url(./assets/demo/icon12.png);
                    }
                    .icon2{
                        background-image: url(./assets/demo/icon22.png);
                    }
                    .icon3{
                        background-image: url(./assets/demo/icon32.png);
                    }
                    .icon4{
                        background-image: url(./assets/demo/icon42.png);
                    }
                    .icon-word{
                        color: red;
                    }
                }
            }
        }

        // loading 图标
        .loadEffect{
            width: 100px;
            height: 100px;
            position: absolute;
            margin: 0 auto;
            top: 30%;
            left: 0;
            right: 0;
            span{
                display: inline-block;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #13c913;
                position: absolute;
                -webkit-animation: load 1.04s ease infinite;
            }
            @-webkit-keyframes load{
                0%{
                    opacity: 1;
                }
                100%{
                    opacity: 0.2;
                }
            }
            span:nth-child(1){
                left: 0;
                top: 50%;
                margin-top:-8px;
                -webkit-animation-delay:0.13s;
            }
            span:nth-child(2){
                left: 14px;
                top: 14px;
                -webkit-animation-delay:0.26s;
            }
            span:nth-child(3){
                left: 50%;
                top: 0;
                margin-left: -8px;
                -webkit-animation-delay:0.39s;
            }
            span:nth-child(4){
                top: 14px;
                right:14px;
                -webkit-animation-delay:0.52s;
            }
            span:nth-child(5){
                right: 0;
                top: 50%;
                margin-top:-8px;
                -webkit-animation-delay:0.65s;
            }
            span:nth-child(6){
                right: 14px;
                bottom:14px;
                -webkit-animation-delay:0.78s;
            }
            span:nth-child(7){
                bottom: 0;
                left: 50%;
                margin-left: -8px;
                -webkit-animation-delay:0.91s;
            }
            span:nth-child(8){
                bottom: 14px;
                left: 14px;
                -webkit-animation-delay:1.04s;
            }
        }
        
    }

</style>
