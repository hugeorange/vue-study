<template>
   <div id="page404">
       <img @click="reload" src="../assets/404.jpg" alt="">
   </div>
</template>
<script>
    export default{
        methods:{
            reload(){
                console.log(this.$router);
                this.$router.push('/')
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
#page404{
    img{
        width: 100%;
        margin-top: 50px;
    }
}
</style>
