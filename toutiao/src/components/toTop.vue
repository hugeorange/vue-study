<template>
    <div id="toTop" @click="scrolltoTop" v-if="flag">
        <i class="icon iconfont icon-totop"></i>
    </div>
</template>
<script>
    export default{
        props:{
            flag:{
                type:Boolean,
                default(){
                    return false;
                }
            }
        },
        methods:{
            scrolltoTop(){
                this.$emit('scrolltoTop','1111');
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    #toTop{
        position: fixed;
        right: 0.5rem;
        bottom: 2rem;
        z-index: 1000;
        height: 0.9rem;
        width: 0.9rem;
        border-radius: 50%;
        background: #d43d3d;
        text-align: center;
        line-height: 0.9rem;
        .icon-totop{
            color: #fff;
            font-size: 30px;
            font-weight: bolder;
        }
    }
</style>
