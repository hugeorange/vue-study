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
