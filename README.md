# myvue

> A Vue.js project  2017-05-09

## 项目介绍介绍

```		
跟着慕课网黄轶老师  敲饿了么 vue项目

每天记录进度:
# 2017-05-09 项目启动
# 2017-05-10 早上 添加静态资源文件，修改 build、dev-serve.js mock模拟数据，
  添加 meta 标签 
  碰到 换台机器 报错-没有 modules ，暂时解决方法，删除整个 node_modules,然后重新 npm install

# 2017-05-11
	建立好 es6 书写， stylus书写方法，增加了tab导航栏，配置好了路由
# 2017-05-12
	学习了 1px 边框制作（不过感觉用处不大）
	编写 stylus mixin 函数并在引用 
	(注意：引入外界stylus样式文件时：只能用 @import 在style标签里引用
	且路径不可以在 webpack.base.conf.js alias别名)

	全局通用样式，字体文件，图标文件 可以用统一在同级目录下用一个 index.styl 文件作为出口，在其内部 用 @import './minix.styl' 引入
	然后在再 webpack.base.conf.js  统一配置 alias 别名
	之后再在 main.js  引入这个 index.styl 文件 即可使用这些样式文件
	如：import 'common/stylus/index.styl'

	stylus 文件书写
		1.尽量使用类 css 语法即 {}
		2.尽量避免拷贝代码，产生多余的空格缩进问题

	

```
