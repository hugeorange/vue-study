<template>
  <div id="my">
    <h1>my</h1>
      <div>
          <button @click="increment">+</button>
          <span>{{ count }}</span>
          <button @click="decrement">-</button>
          <div>{{ nowTime }}</div>
      </div>

  </div>
</template>

<script>
  //引入vuex 辅助函数  mapState（计算属性），mapMutations（methods方法）
  import {mapState,mapMutations,mapGetters} from 'vuex'
  export default {
      name:'my',
      data(){
          return {

          }
      },
      computed:{

//          count(){
//              //获取 vuex 数据 在 computed 里面返回
//              return this.$store.state.count;
//          }
          //对象展开运算符代替下面的写法
          ...mapState(['count']),
          ...mapGetters(['nowTime'])
      },
      methods:{
          //对象展开运算符代替下面的写法
          ...mapMutations(['increment','decrement'])
//
//          increment(){
//            this.$store.commit('increment');
//          },
//          decrement(){
//              this.$store.commit('decrement');
//          }
      }
  }
</script>

<style>
#my{
    /*background-color: orangered;*/
    width: 100%;
    height:100%;
    text-align: center;
    position: absolute;
    font-size: 30px;
}
</style>
