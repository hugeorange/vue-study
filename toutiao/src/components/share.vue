<template>
   <div id="share" @click="hidewrap">
       <transition name="moveTop">
            <div class="share-wrap" v-show="isShow">
               <div class="share-content">
                   <div @click="share(1)"><i class="icon iconfont icon-weibo"></i></div>
                   <div @click="share(2)"><i class="icon iconfont icon-github"></i></div>
                   <div @click="share(3)"><i class="icon iconfont icon-yingdaicon04"></i></div>
               </div>
               <div class="cancel" @click="cancelShare">取消</div>
            </div>
       </transition>

   </div>
</template>
<script>
    export default{
        props:['isShow'],
        data(){
            return {
                shareItem:{
                    '1':'weibo',
                    '2':'github',
                    '3':'weibo'
                }
            }
        },
        methods:{
            cancelShare(){
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                this.$emit('hideShare');
            },
            share(key){
                alert('分享' + this.shareItem[key]);
            },
            hidewrap(){
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                this.$emit('hideShare');
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
#share{
    width: 100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    .share-wrap{
        position: fixed;
        bottom: 0;
        left:0;
        right:0;
        height:150px;
        background-color: #fff;
        border-top: 1px solid #ffe3e3;
        .share-content{
            display: flex;
            justify-content: space-around;
            margin-top: 38px;
            .icon{
                font-size: 40px;
                color: #47c53c;
            }
        }
        .cancel{
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
            height: 40px;
            font-size: 18px;
            line-height: 40px;
            color: #00a0dc;
            bottom: 0;
            border-top: 1px solid #eee;
        }

        &.moveTop-enter-active,&.moveTop-leave-active{
            transition: all 0.3s;
        }
        &.moveTop-enter, &.moveTop-leave-to{
            transform: translateY(150px);
        }
    }

}

</style>
