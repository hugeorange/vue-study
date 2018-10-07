<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from '@/common/js/util'

  export default {
    props: {
      placeholder: { // 提示性文字；可以外部传入该值，不写死  增加灵活性
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''  //查询字段名称
      }
    },
    methods: {
      clear() {  // 清除
        this.query = ''
      },
      setQuery(query) { // 点击热门搜索关键字执行
        this.query = query
      },
      blur() {  // 对外暴露失去焦点的方法
        this.$refs.query.blur()  
      }
    },
    created() {
       // 这里调用debounce节流函数延迟执行，避免频繁调取接口请求数据
       // 通过监听query值的变化把query事件派发出去，作用到引用search-box组件的组件上)
       // 为什么不用 watch 选项  函数式写法  
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)  
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"

  .search-box
    display: flex  //采用flex布局，自适应宽度
    align-items: center  //交叉轴上居中
    box-sizing: border-box  //border和padding计算入width之内
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder   // 默认提示文字的颜色
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>