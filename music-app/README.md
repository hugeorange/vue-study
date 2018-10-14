# music-appp

### vuex
- `state` , `getter`, `mutations(mutation-types)`, `actions`
- `import {mapState, mapGetters, mapMutations, mapActions} form 'vuex'`

- `state` ： 存储共享状态中心 --  `mapState` -- 将共享状态中心的状态直接拿出来
```
computed: { 
    // 直接将状态中心的数据拿出来，不做任何处理，mapGetters 可能会做一层处理
    ...mapGetters([
    'singer'
    ])
},

```
- `getter`: 读取共享状态  --- `mapGetters` -- 计算属性里使用
```
computed: { 
    // 对应到store/getters.js 里的singer (获取到列表页点击的歌手对应详细数据)
    ...mapGetters([
    'singer'
    ])
},
```
- `mutations`: 改变单个同步的 state 状态 --- `mapMutations` -- methods 里面使用
```
  methods: {
    selectSinger(item) {
      this.setSinger(item) // 等于执行了mutations.js里的对应方法
    },
    // 对象映射(把对mutations的修改映射成一个方法名 setSinger)
    ...mapMutations({  
      setSinger: 'SET_SINGER'   
    })
  }
```
- `actions`: 改变多个同步的 state（多个`mutations`）或是 异步的方法 --- `mapActions`
```
methods: {
    selectItem(item, index) {
        this.selectPlay({
            list: this.songs,
            index
        })
    },
    random() {
        this.randomPlay({
            list: this.songs
        })
    },
    ...mapActions([
        'selectPlay',
        'randomPlay'
    ])
},
```

### css 小技巧
- 利用`white-space: nowrap` 将两个元素排在一行
```
.wrap {
    ...
    white-space: nowrap;
    font-size: 0; // 去掉两个元素产生的间隙
}
.child1 {
    display: inline-block; // 必须设置成 inline-block
    width: ...
}
.child2 {
    display: inline-block;
    width: ...
}
```


### 待考虑问题
- [ ] css module 问题
- [ ] style 标签的 `scoped` 属性
- [x] 引入 css 为什么要用加一个 `~`
    - [vue-cli3的解释](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E4%BB%8E%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84%E5%AF%BC%E5%85%A5)
    - [css-loader的处理问题](https://blog.csdn.net/zwkkkk1/article/details/81200791)
    - Webpack 会将以 `~` 符号作为前缀的路径视作依赖模块而去解析，这样 css 的 alias 配置就能生效了。
    - 如果 URL 以 `~` 开头，其后的任何内容都会作为一个模块请求被解析。这意味着你甚至可以引用 Node 模块中的资源
    - 样式文件不能直接用 `webpack alias` 的别名进行导入
- [x] svg 圆形进度条， 普通水平进度条
```
<svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <!-- stroke-dasharray：定义描边的虚线长度，如果提供奇数个，则会自动复制该值成偶数;stroke-dashoffset：定义虚线描边偏移量 -->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" 
:stroke-dashoffset="dashOffset"/> 
    </svg>
```

- [ ] 构造类来实例化所需对象的格式而不是直接在业务代码里用简单对象构造 如：`song.js` 和 `singer.js`
- [ ] 善用 -- box-sizing: border-box  //border和padding计算入width之内
- [ ] 组件内的 this 上为什么会挂载 vuex 内声明的方法和属性（并没有引入 vuex 和 设置 mapGetters...）
    1. 由于引入 mixin 导致的，两个组件有好多相同的逻辑 操作 vuex，可以抽象到一个 mixin文件里
