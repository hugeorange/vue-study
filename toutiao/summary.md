## vue 头条 demo

#### 写在前面
1. 一直想学习使用 vue ，并准备以后在实际项目使用，之前跟着慕课网 黄轶 老师 敲了一下 饿了么商品购买页的demo
  [ele效果预览]( https://segmentfault.com/a/1190000010263373)
2. 该 demo 借鉴自 [hcy1996-github](https://github.com/hcy1996/vue-toutiao) 这个项目，但内部内容，布局风格，完全不同，只为共同学习，共同交流
3. 数据接口 直接打开 今日头条 网页版 ，在 network 分析了下，直接 copy 过来的
4. 还有很多功能没有实现，后期在完善吧！
5. 项目地址：[github-项目地址](https://github.com/hugeorange/vue-demo/tree/master/toutiao)
6. 预览效果: [demo预览效果](https://hugeorange.github.io/demo/toutiao)
7. 建议在 chrome 浏览器查看（不知道为什么数据请求，一个劲卡死，不知道是不是因为今日头条接口的原因）

### 演示
![我的头像](./preview.gif)
##### 静态资源
1. 头部添加 rem 布局
2. 引入 reset.css
3. 使用 阿里妈妈图标库，index.html 引入

####　使用 css 预处理器 sass
  1. 安装 `node-sass sass-loader`  `npm install node-sass sass-loader --save-dev`
  2. 使用 `<style rel="stylesheet/scss" lang="scss">`
  3. 参考文章： `http://www.jianshu.com/p/67f52071657d`

#### app.vue
1. 底部导航栏栏  ==> 刚开始时用的 `vux` 的 `tabbar tabbar-item` 组件，发现有需求实现不了，刚开始还改了源码，最后实在受不了了
    就用   `vue-router roter-link` 自己写了
    底部导航栏 四个按钮分别对应 四个组件
    - 由于自己对 vue-router 理解还欠火候，所以遇到了一个问题
    - routes 数组里面的内容对应的就是 组件 ，
    - path 选项对应的是路由路径,初始时没有路由嵌套 即为 `\index`
    - components 选项对应该路由对应的组件，由于组件已经全部通过 `import` 引入了，所以不需要写路径了

    - 底部通用 tab 导航栏
    - 本想单独抽出一个 bottom.vue 组件呢，但在左右切换的滑动样式中，表现并不好，因为希望底部导航栏不滑动这才符合人的预期需求
    - 所以最终还是选择不抽离这个组件，直接写在了 app.vue 里面了

2. 通用样式库 common scss 目录 base.scss mixin.scss 通过 一个 index.scss 导入

3. 引入 axios ，由于 axios 不支持jsonp，所以还得引入 jsonp
  -  ` npm install axios jsonp --save `
  -  在 common/js/ajax.js 下使用这两个库
  - `import axios from 'axios'`
  - `import jsonp from 'jsonp'`
  - 将 ajax 请求，封装在 一个通用的 js 文件里，方便统一处理 ajax
  - 即前后端协作时 定义的一些返回值代表的意义，都可以在此方法里统一处理

4. 遇到个问题不知道怎么解决
  - 我想有 loading.vue 组件，就是可以在通用的 ajax.js 文件里引用，
  - 问题是，我发现 当加载 ajax.js 文件时 ，loading.vue 组件 import 不进来的，所以无法使用
  - 但我又想要 当用统一 ajax 处理的时候，统一执行 loading
  - 最终我想了一个下下策，把 loading组件的内容直接写在了index.html 文件里，这样就可以加载到了，就可以在 ajax处理的时候集中使用 loading.vue 了
  - 不仅 loading 组件，还有 通用弹框组件，（就是想在一个通用的 js 文件里，每次只要在使用的地方 import 这个 js 文件，就能使用这些 通用组件，而不必每次都要 import 这些组件）
  - 现在的解决办法太渣，看以后能不能想到什么好的办法
  - 如果各位大大，有什么好的方法，希望能告知 小弟 一声

### index.vue 文件

1. 顶部 x-header 组件 ，感觉使用不够灵活
   不知道如何 自定义左右图标
   因为 vux 的 icon 是引自 [icon图标css库](http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css)

2. 右侧icon 是我引用 阿里妈妈图标库里面的图标的

3. 标签导航一栏 本来是用  vux 的scroller 组件写的，但看到官方文档上写 ，此组件已不在维护，且不建议开发者继续使用
   自己按着 demo 用了一下发现不知道 如何 refresh，就放弃了

4. 自己 用 better-scroll 处理滚动 tab 标签栏横线滚动没碰到问题

*  新闻内容列表滚动也是用的 better-scroll 碰到了一个问题，
   下拉刷新的logo 总是无法藏在 列表后面，无论怎么设置 z-index
*  最后才发现问题，自己还真的是蠢，列表容器没写背景颜色，自然永远都能看到loading图标

> 在纠结的过程中也发现了几个问题：

- 移动端百分比布局时：html,body一定要设置宽高百分比，不然会遇到很多坑
- better-scroll 滚动容器一定要有明确的宽高，建议最好用绝对定位，背景颜色，overflow:hidden
- 最大的一个坑，列表总是有一部分滚动不上来，碰到这个问题，首先想到：
 + 列表高度是否大于容器高度
 + refresh 时机不对最终，发现确实时是 refresh 时机不对，
 + 但接下来纠结的时刻到了，无论放在哪都不对，最终写了 setTimeout(fn,3000),可以正常工作，但这肯定不是解决办法
 + 最后想到：因为列表中的图片容器高度，是靠图片撑开的，但图片加载的比较慢所以 better-scroll 计算不到准确的高度，
 + 解决办法：图片容器高度事先写死，完美的解决了

5. 图片懒加载  vue-lazyload 插件，超好用
 - 懒加载引用的图片地址：loading 图片
 - 如果 在js 引用静态图片，因为webpack 不会解析 js 文件里的图片，
   所以要用 import 引用 `import logo from './assets/loading.gif'`
 - 或是把图片放在顶层的 `static` 目录里

### 微信左右滚动效果（切换底部tab时）---以下是通用思路

  - 在 全局路由 `beforeEach(function(to,from,next){***})` 钩子里 要做下面的事情
  - 假如待切换的组件为 `index1，index2`
  - 在 `sessionStorage` 里面 创建 一个 `__router__` 值
  - `__router__`的值包括：`count, transitionName , to.path ,from.path`
  - count 初识值为 0；
  - transitionName 初始值为 ''
  - to.path 初始值为  undefined
  - form.path 初始值为 undefined
  - 首次进入时 to.index(index1) 为空 执行 else
  - count++
  - 判断 `to.path !== '/' && history[to.path] = historyCount`
  - `history['transitionName'] = 'forward'`; 为前进状态
  - 此时： `index1:1,count:1`
  - 二次 进入（路由已跳转过一次） 此时 `to.path` 依旧 为 `undefined` ，而 `from.path 为 to.path 的值`
  - 继续走 else 里面，重复上面的步骤 此时` index2:2,count2,index1:1`
  - 在继续点第一个 tab 相当于回到第一个 tab
  - 此时：`to.path == index1, from.path == index2`
  - 假如 ：!fromIndex || parseInt(toIndex) > parseInt(fromIndex
  - 或：toIndex === '0' && fromIndex === '0'
  - 为 `forward` 前进状态
  - 否则： 为 `reserve` 后退状态
  - 这样就能判断是前进状态还是后退状态，就可以用样式控制滚动方向了
  - Do not bb ，show me code
      ```
      router.beforeEach(function (to, from, next) {
        let history = window.sessionStorage.__router__;
        if(!history){
          history = {};
        }else{
          history = JSON.parse(history);
        }

        let historyCount = history.count * 1;    //记录走过的 tab 页数量
        const toIndex = history[to.path];        // 要去的索引
        const fromIndex = history[from.path];    //要离开的索引

        if (toIndex) {
            if (!fromIndex || parseInt(toIndex) > parseInt(fromIndex) || (toIndex === '0' && fromIndex === '0')) {
            history['transitionName'] = 'forward';
            } else {
                history['transitionName'] = 'reverse';
            }
        } else {
            //第一次没有记录session-storage 的情况
            ++historyCount;
            history['count'] = historyCount;

            to.path !== '/' && (history[to.path] = historyCount);
            history['transitionName'] = 'forward';
        }

        history = JSON.stringify(history);

        window.sessionStorage.__router__ = history;

        if (/\/http/.test(to.path)) {
            let url = to.path.split('http')[1];
            window.location.href = `http${url}`
        } else {
            next()
        }
    });

      ```

### 遇到问题（2017-08-10）
- 当第一次进入页面时 ，如果不是处在第一个 tab 时，history 里面记录的索引就会出现错乱现象
- 解决办法：事先设置好 首页出现的四个 tab 的索引，设置好 初始的 count 为 4
- 这样就不会发生索引错乱现象

### 切换时的一个小问题
- 当左右华东切换时，要注意将各个 tab 页顶层设置 ，position：absolute，这样才会排在同一排，否则会出现一上一下的现象

### 具体实现查看 [github-项目地址](https://github.com/hugeorange/vue-demo/tree/master/toutiao) 里面的 main.js

#### app.vue

通过 watch 选项监测 `$route` 动态的改变`transitionName` 的值

```
   <transition :name="transitionName">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </transition>

  watch: {
      '$route' (to, from) {
          console.log(to,from);
          this.transitionName = JSON.parse(window.sessionStorage.__router__).transitionName;
      }
  },

  样式：
    //微信切换样式 ，左右滚动
  //前进动画样式
  .forward-enter-active,.forward-leave-active{
    transition: all 0.3s;
  }

  .forward-enter{
    transform: translateX(100%);
  }
  .forward-leave-to{
    transform: translateX(-100%);
  }

  // 后退动画样式
  .reverse-enter-active,.reverse-leave-active{
    transition: all 0.3s;
  }
  .reverse-enter{
    transform: translateX(-100%);
  }
  .reverse-leave-to{
    transform: translateX(100%);
  }
  ```



### sessionStorage 和 localStorage 本地存储问题
1. sessionStorage 本地会话存储，会话结束-浏览器关闭（不包括刷新页面，恢复页面），存储结果清除
2. localStorage 本地存储，除非手动清除，否则永不清除
3. 大小传说 5M
4. 方法1：getItem(key),setItem(key,value),clear()
5. 方法2：利用 . 或 [] 语法，访问或设置
6. 事件：
7. 如果你监听storage变更事件你就会发现，当数据发生变化时本页是监听不到storage事件变更消息的。而同域的其他打开的页面反而监听到了该消息。悲剧不？
  - 解决办法百度

### storage只能存储字符串 不能存储其他类型数据
1. 存储对象,读取对象：

```
let history = window.sessionStorage.__router__;
  if(!history){
    history = {};
  }else{
    //读取
    history = JSON.parse(history);
  }
  //存储
  history = JSON.stringify(history);
  window.sessionStorage.__router__ = history;
```

### activated 钩子
1. 在 <keep-alive></keep-alive> 组件中使用
2. keep-alive 组件在第二次渲染时不会触发 create mounted updated 钩子
3. 但是会触发 activated 钩子
4. 使用场景： 列表页==> 详情页的切换
    - 第一次从列表页进详情页时会加载数据 触发 created,mounted,updated 钩子
    - 第二次以上钩子就不会被触发了， 需要加上一个 activated 生命周期钩子，在里面加载请求数据

5.  - 路由跳转时 需要用到 动态路由 即在 路径后面加个 id
    - 我用query 进行传递参数，如果不主动传递参数，跳转后的子页面刷新时数据就丢失了（原计划用 vuex 做收藏功能）
    - index.js `{path: '/newsDetails/:key', name: 'newsDetails',component:newsDetails },`
    - 导航写法：
    ```
    <router-link class="news-item" v-for="(item,index) in newsData"
        :to ='{
            path: "/newsDetails" + item.source_url,
            query:{
                newsItem:JSON.stringify(item)
            }
        }'
        tag='li'
        :key='index'
    >
    </router-link>
    //路由外链
    <router-view></router-view>

    ```

### 或者
```
<router-link
    class="news-item" v-for="(item,index) in newsData"
    :to=" 'newsDetail' + item.source_url "
    tag='li'
   :key='index'
   >
</router-link>
```

####  列表页 ==> 详情页

> 从列表页到详情页不适合用嵌套路由
> 因为其是两个单独的页面，并不会同时出现在一屏上

### 嵌套路由写法

- route.js
```
  {path: '/index', name:'index', component: index,
    children:[
        {path: '/index/newsDetails/:id', name: 'newsDetails',component:newsDetails },
    ]
  }
```
- index.vue
```
<router-link>
  :to = "'index/newsDetails' + item.source_url"
</router-link>
```


### 路由传参
- 不仅仅传递一个动态路由id还可以 通过 params 和 query进行传递，但都会显示在 url上
- 列表页 ==> 将该项所有参数传递到详情页，可以现将对象数据 序列化为字符串，放在 query li
- 在详情页时，取值时反序列化，继而可以在详情页里面使用
- 由于数据是存在 url 里 故可以在刷新页面仍可以拿到数据

### 路由小结
1. 路由中的三个基本概念： `route` `routes` `router`
2. route 一条路由（单条路由的走向）   routes 一组路由（静止的一组路由的集合）
3. router 是一种机制相当于一个管理者（当用户点击时  去 routes 去执行相应的路由）
4. 普通路由
5. 动态路由
6. 嵌套路由
7. 编程式导航
8. 组件内的挂载到 根实例上的两个对象  路由源信息对象： `this.$route` 和  路由实例对象 `this.$router`


### 父子组件通讯
- 父组件 => 子组件
- 父组件传递： ` <to-top :flag="toTop" @scrolltoTop="scroll_to"></to-top>`
- 简写方式（直接传值）数组形式 ==> ： props:['flag']
- 默认值写法： 对象形式
    ```
        props:{
            flag:{
                type:Bollean,
                dafault:{
                    return false;
                }
            }
        }
    ```

- 子组件 ==> 父组件
- `v-on` 绑定 子组件派发而来的事件
- 父组件接收： ` <to-top :flag="toTop" @scrolltoTop="scroll_to"></to-top>`
-
```
methods:{
    scroll_to(childmsg){
        //执行 。。。
        childmsg  为子组件向父组件传递的参数
    }
}
```
- 子组件
 ```
 methods:{
    xxx(){
        this.$emit('scrolltoTop','aaa向父组件传递的参数')
    }
 }
 ```

> 注意不能直接使用 $on 监听子组件抛出的事件，而必须在模板里使用 v-on 绑定

### 收藏页 ==> vuex
- 在详情页进行 收藏/取消 操作
- 将该操作的数据存在 vuex 里，然后存在 localStorage 里，
- store.js 里建一个 newsItem字段，值为数组，然后通过 mutations 操作，
- 向数组里添加或删除元素
- 在收藏组件里进行渲染

### 原计划收藏页的新闻是可以 收藏/取消收藏的
- 收藏 存进vuex，取消收藏从vuex里删除
- 但今日头条的数据结构感觉有点乱
- 想着真实开发中，后台肯定会返回一个字段告诉该条新闻本人是否已经收藏过
- 只做了收藏，暂无取消收藏功能，收藏之后存进 vuex ==> localstorage
- bug ==> 同一条新闻可重复收藏
- vuex 操作流程

- store.js
```
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex);
const store = new Vuex.Store({
    state:{         //数据管理中心
        count:0,
    },
    mutations,     //使用处进行 commit
    getters:{      //外界在此处获得 vuex 数据
        nowTime(state){
            return new Date() - 0 + '-' + state.count;
        }
    }
});
export default store;

```

- mutations.js
```
//全局触发事件
export default {
    increment (state){   // 只有通过此处的方法才能改变vuex 内的数据
        state.count++;
    },
    decrement (state){
        state.count--;
    },
}
```
- 使用的时候 引入  `import {mapState,mapMutations,mapGetters} from 'vuex'`
- 然后通过 `this.$store` 对象进行操作


### vuex 待续。。。

### 处理资源
1. js 引用图片 必须用 import 导入 import logo.png from '相对路径'
2. 放在 src 目录里的文件都是交由 webpack 处理的
3. 放在 static 目录里面的文件 webpack 不会处理，而是在 build 之后，直接拷贝 相应目录里
4. 所以在 项目里如果要引用 static 目录里的文件 必须要使用绝对路径 `/static/[filename]`
5. main.js 里 引用 图片懒加载 的加载中图片时 路径必须为 `'./static/img/loading.gif'`(我也不知道原因)
- 具体可参考此回答： [vue static目录资源使用]( https://segmentfault.com/q/1010000009842688 )
