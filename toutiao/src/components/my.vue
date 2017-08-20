<template>
    <div id="my">
        <div class="avatar-wrap">
            <div class="background">
            </div>
            <div class="avatar-img">
                <img src="https://sfault-avatar.b0.upaiyun.com/170/530/1705302713-5874fbd7ed519_huge256" alt="" class="avatar">
                <div class="title">大桔子</div>
            </div>
        </div>

        <ul class="connect-me">

            <li>
                <a href="https://github.com/hugeorange/vue-demo/tree/master/toutiao" target="_blank">
                    <i class="icon iconfont icon-github"></i>github

                    <div class="right">
                        <i class="icon iconfont icon-enter"></i>
                    </div>
                </a>

            </li>
            <li>
                <a href="https://segmentfault.com/u/djz" target="_blank">
                    <i class="icon iconfont icon-iconsf-copy"></i>segment fault
                    <div class="right">
                        <i class="icon iconfont icon-enter"></i>
                    </div>
                </a>
            </li>
        </ul>

    </div>
</template>

<script>
    //引入vuex 辅助函数  mapState（计算属性），mapMutations（methods方法）
    import {mapState,mapMutations,mapGetters} from 'vuex'
    import bottom from '../components/bottom'
    export default {
        name:'follow',
        components:{
            bottom
        },
        computed:{

        },
        methods:{

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    #my{
        width: 100%;
        text-align: center;
        position: absolute;
        top:0;
        min-height: 100%;
        .avatar-wrap{
            width:100%;
            height:200px;
            background-color: rgba(7,17,27,.3);
            .background{
                width: 100%;
                height:200px;
                position: absolute;
                left:0;
                right:0;
                top:0;
                z-index: -1;
                background-image: url(https://sfault-avatar.b0.upaiyun.com/170/530/1705302713-5874fbd7ed519_huge256);
                background-size:100% 100%;
                background-repeat: no-repeat;
                filter: blur(10px);
            }
            .avatar-img{
                width: 100px;
                margin: 0 auto;
                img{
                    width: 100%;
                    border-radius: 50%;
                    margin-top: 50px;
                }
                .title{
                    font-size: 20px;
                    color: #1aea7c;
                    margin-top: 8px;
                }
            }
        }
        .connect-me{
            margin:20px 20px;
            li{
                padding: 10px 5px;
                border-top:1px solid #eee ;
                border-bottom:1px solid #eee ;
                margin:10px 0;
                text-align: left;
                font-size: 16px;
                a{
                    display: block;
                    width: 100%;
                    .iconfont{
                        padding-right: 5px;
                    }
                    .right{
                        float: right;
                    }
                }
            }
        }
    }
</style>
