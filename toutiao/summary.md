### 头条 demo

##### 静态资源

1. 头不添加 rem 布局
2. 引入 reset.css
3. 加载 icon 图标字体库 http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css

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
4. 利用 vux 的 scroller 组件进行滚动 标题栏，但官方文档 已停止维护该组件，不知为何

#### index.vue 文件

1. 顶部 x-header 组件 可能也怪我不会阅读文档吧，看不懂
   不知道如何 自定义左右图标
   因为 vux 的 icon 是引自 [icon图标css库](http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css)

2. 右侧icon 是我自己引用库里面的图标

3. 标签导航一栏 本来是用  vux 的scroller 组件写的，但看到官方文档上写 ，此组件已不在维护，且不建议开发者继续使用
   自己按着 demo 用了一下发现不知道 如何 refresh，就放弃了

4. 自己 用 better-scroll 处理滚动 
    tab 标签栏横线滚动没碰到问题
    新闻内容列表滚动也是用的 better-scroll 碰到了一个问题，
    下拉刷新的logo 总是无法藏在 列表后面，无论怎么设置 z-index
    最后才发现问题，自己还真的是蠢，列表容器没写背景颜色，自然永远都能看到loading图标

    在纠结的过程中也发现了几个问题：
    1.移动端百分比布局时：html,body一定要设置宽高百分比，不然会遇到很多坑
    2.滚动容器一定要有明确的宽高，建议最好用绝对定位，背景颜色，overflow:hidden
    3.最大的一个坑，列表总是有一部分滚动不上来，碰到这个问题，首先想到：
       1.列表高度是否大于容器高度
       2.refresh 时机不对最终，发现确实时是 refresh 时机不对，
       但接下来纠结的时刻到了，无论放在哪都不对，
       最终写了 setTimeout(fn,3000),可以正常工作，但这肯定不是解决办法

       最后想到：因为列表中的图片容器高度，是靠图片撑开的，但图片加载的比较慢
       所以 better-scroll 计算不到准确的高度，
       解决办法：图片容器高度事先写死，完美的解决了

    4. 图片懒加载  vue-lazyload 插件，超好用













