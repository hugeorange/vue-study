### 头条 demo

##### 静态资源

1. 头部添加 rem 布局
2. 引入 reset.css
3. 加载 icon 图标字体库 http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css

####　使用 css 预处理器 sass
  1. 安装 `node-sass sass-loader`  `npm install node-sass sass-loader --save-dev`
  2. 使用 `<style rel="stylesheet/scss" lang="scss">`
  3. 参考文章： `http://www.jianshu.com/p/67f52071657d`

#### app.vue
1. 底部导航栏栏

    ==> 刚开始时用的 `vux` 的 `tabbar tabbar-item` 组件，无奈看不懂文档，刚开始还改了源码，最后实在受不了了
    就用   `vue-router roter-link` 自己写了
    底部导航栏 四个按钮分别对应 四个组件
    - 由于自己对 vue-router 理解还欠火候，所以遇到了一个问题
    - routes 数组里面的内容对应的就是 组件 ，
    - path 选项对应的是路由路径,初始时没有路由嵌套 即为 `\index`
    - components 选项对应该路由对应的组件，由于组件已经全部通过 `import` 引入了，所以不需要写路径了
2. 通用样式库 common scss 目录 base.scss mixin.scss 通过 一个 index.scss 导入

3. 引入 axios ，由于 axios 不支持jsonp，所以还得引入 jsonp
  -  ` npm install axios jsonp --save `
  -  在 common/js/ajax.js 下使用这两个库
  - `import axios from 'axios'`
  - `import jsonp from 'jsonp'`
  - 将 ajax 请求，封装在 一个文件里，方便集中处理业务逻辑


### index.vue 文件

1. 顶部 x-header 组件 可能也怪我不会阅读文档吧，看不懂
   不知道如何 自定义左右图标
   因为 vux 的 icon 是引自 [icon图标css库](http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css)

2. 右侧icon 是我自己引用库里面的图标

3. 标签导航一栏 本来是用  vux 的scroller 组件写的，但看到官方文档上写 ，此组件已不在维护，且不建议开发者继续使用
   自己按着 demo 用了一下发现不知道 如何 refresh，就放弃了

4. 自己 用 better-scroll 处理滚动 tab 标签栏横线滚动没碰到问题

*  新闻内容列表滚动也是用的 better-scroll 碰到了一个问题，
   下拉刷新的logo 总是无法藏在 列表后面，无论怎么设置 z-index
*  最后才发现问题，自己还真的是蠢，列表容器没写背景颜色，自然永远都能看到loading图标

> 在纠结的过程中也发现了几个问题：

- 移动端百分比布局时：html,body一定要设置宽高百分比，不然会遇到很多坑
- 滚动容器一定要有明确的宽高，建议最好用绝对定位，背景颜色，overflow:hidden
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

### 微信左右滚动效果

  - 在 路由 `beforeEach(function(to,from,next){***})` 钩子里 要做下面的事情
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

#### 存在的问题
- 如果一开始访问的路径：不是  `http://192.168.31.13:8081/#/index`
- 而是：`http://192.168.31.13:8081/#/index2`
- 即不是按顺序访问每个tab的，to.path 和 from.path 就会出问题,导致储存前后顺序错乱，发现 vux 好像也有这个问题
- 暂时未找到解决方案
- 况且这种 滚动效果 感觉不太好，还不如 opactiy 变化好呢，故改用 opacity
即简单又省事效果又好

### sessionStorage 和 localStorage 本地存储问题
1. sessionStorage 本地会话存储，会话结束-浏览器关闭（不包括刷新页面，恢复页面），存储结果清除
2. localStorage 本地存储，除非手动清除，否则永不清除
3. 大小传说 5M
4. 方法1：getItem(key),setItem(key,value),clear()
5. 方法2：利用 . 或 [] 语法，访问或设置
6. 事件：
7. 如果你监听storage变更事件你就会发现，当数据发生变化时本页是监听不到storage事件变更消息的。而同域的其他打开的页面反而监听到了该消息。悲剧不？

  解决办法：

- 自定义事件创建及触发： `http://www.cnblogs.com/stephenykk/p/4861420.html#`


```
var SetItem = localStorage.setItem;
  // 修改localStorage的setItem方法
  localStorage.setItem = function(key,value) {
      var setItemEvent = new Event("setItemEvent");
      setItemEvent.value = value;
      setItemEvent.key = key;
      // 手动触发setItemEvent
      window.dispatchEvent(setItemEvent);
      // 执行原方法
      SetItem.apply(this,arguments);
  }

  window.addEventListener("setItemEvent", function(e) {
      // 检测是否为需要监听的key值
      if (e.key == "xxx") {
          console.log(e.value);
      }
  });
  localStorage.setItem("xxx","123");
```


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
    - index.js `{path: '/newsDetails/:key', name: 'newsDetails',component:newsDetails },`
    - 导航写法：
    ```
    <router-link
        class="news-item" v-for="(item,index) in newsData"
        :to="{
             name:'newsDetails',
             path:'/newsDetails',
             params:{
                 key:index,
                 id:item.source_url,
                 newsItem:item
             }
       }"

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

### 注意子组件向父组件 commit 的时候，老是忘记书写格式

### 路由传参
- 不仅仅传递一个动态路由id还可以 通过 params 和 query进行传递，但都会显示在 url上（暂时未找到解决办法）
- 列表页 ==> 将该项所有参数传递到详情页，可以现将对象数据 序列化为字符串，放在 query li
- 在详情页时，取值时反序列化，继而可以在详情页里面使用
- 由于数据是存在 url 里 故可以在刷新页面仍可以拿到数据

### 收藏页 ==> vuex
