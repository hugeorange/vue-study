<template>
  <div id="follow">
      <h1>暂未实现</h1>

      <div>
          <div>vuex 小试</div>
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
import bottom from '../components/bottom'
export default {
    name:'follow',
    components:{
        bottom
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

<style rel="stylesheet/scss" lang="scss">
    #follow{
        width: 100%;
        text-align: center;
        position: absolute;
        top:0;
        min-height: 100%;
        h1{
            font-size: 28px;
            margin-top: 200px;
            color: #ccc;
            padding: 20px 0;

        }
    }
</style>
