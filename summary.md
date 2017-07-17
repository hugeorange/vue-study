### 饿了么 vue 项目总结

```

# 项目启动
# 添加静态资源文件，修改 build、dev-serve.js mock模拟数据，
  添加 meta 标签
  碰到 换台机器 报错-没有 modules ，暂时解决方法，删除整个 node_modules,然后重新 npm install

# 建立好 es6 书写， stylus书写方法，增加了tab导航栏，配置好了路由
#
	学习了 1px 边框制作（不过感觉用处不大）
	编写 stylus mixin 函数并在引用
	(注意：引入外界stylus样式文件时：只能用 @import 在style标签里引用
	且路径不可以在 webpack.base.conf.js alias别名)

	全局通用样式，字体文件，图标文件
	可以用统一在同级目录下用一个 index.styl
	文件作为出口，在其内部 用 @import './minix.styl' 引入
	然后在再 webpack.base.conf.js  统一配置 alias 别名
	之后再在 main.js  引入这个 index.styl 文件 即可使用这些样式文件
	如：import 'common/stylus/index.styl'

	stylus 文件书写
		1.尽量使用类 css 语法即 {}
		2.尽量避免拷贝代码，产生多余的空格缩进问题

#
	做完之后好好学习一下 flex 布局
	display:flex  flex:1
	完成 header 组件 ，goods组件 完成布局

```

> better-scroll

    better-scroll 实现列表滚动联动
    1. 初始化 better-scroll
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper,{
                click:true        //默认派发点击事件
            });
    
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
                click:true,
                probeType:3   //实时侦测滚动
            });
        },
    
    2. 在 vue 钩子函数 created 内 this.$nextTick 回调里面调用 better-scroll初始化函数

> 菜单栏根据foodList列表滚动实时高亮

    1. 通过 _calculateHeight 方法动态计算出 每个列表的标题 的 clientHeight 值，并将其推进一个 listHeight 数组
    2. 当滚动 foods 列表时，会动态计算出 pos.y 的值，
    3. 把这个 pos.y 的值在计算属性里判断 其在 listHeight 数组中对应的 index 值
    4. 然后将菜单列表数组中的 index 值 设置为高亮 

> 点击左侧菜单栏，右侧 foods 列表实时滚动到相应位置

    1. 给 menu-item 绑定一个 setMenu(index) 方法
    2. 然后根据这个 index 获取foodslist 里面对应的 li dom 元素
    3. 利用 scrollToElement(el,100) api 自动将foodlist滚动到合适位置

    selectMenu(index) {
        // 因为有自动派发事件，所以需要阻止，
        if(!event._constructed) return; 
        console.log(index);
        let foodList = this.$refs.foodList;  //通过 $refs.foodList获取当前dom元素
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el,10);
    }  

> 购物车计算属性使用
    
    1. 将 item.foods 数据 通过 props 属性传递到子组件（cartcontrol组件）

    2. 在 cartcontrol 组件内 执行  addCart、decreaseCart 方法改变  item.foods.count 的值

        如果 item.count 值不存在，使用  Vue.set(this.food,'count',1) ; 
        给foods增加 count 属性，如果直接增加 count 属性，不会产生响应式数据，必须用  Vue.set() 方法

    3. 在子组件改变 item.foods对象的值，相应的父组件内的 item的值会随之改变（js复杂数据类型地址引用）

    4. 在父组件 goods.vue 利用计算属性 动态的生成购物车数据，然后通过 props属性传递给 shopcart.vue 组件
    
        计算属性的计算出的值为响应式数据可以直接拿来使用,即在  v-for 中直接遍历  selectFoods 
        
        // 选中的商品即购物车内的商品
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if(food.count){
                        foods.push(food);
                    }
                })
            });
            console.log(foods);
            return foods;
        }
        
        

> cartcontrol 增加和减少商品小球动画
    
    1. 减少商品小球动画
        利用 vue transition 组件-过度动画 和 v-show 配合 可以给任何元素和组件添加 entering/leaving过度 
        条件渲染 （使用 v-if）
        条件展示 （使用v-show）
        动态组件
        组件根节点
        当插入或删除包含在 transition 组件中的元素时，Vue将做如下处理：
        1.自动嗅探目标元素是否应用了 css 过度或动画，如果是在恰当的时机添加/删除 css 类名
        2.如果过渡组件提供了 JavaScript钩子函数，这些钩子函数将在恰当的时机被调用
        3.如果没有找到钩子并且也没有检测到css动画，DOM操作（插入/删除）在下一帧中立即执行

        过度的 css 类名
        1. v-enter 定义进入过渡的开始状态，在元素插入式时生效，在下一帧移除
        2. v-enter-active 定义进入过渡的结束状态。在元素被插入时生效，在 transition/animation 完成之后移除
        3. v-leave 定义离开过度的开始状态。在离开过渡被触发时生效，在下一帧移除
        4. v-leave-active 定义离开过渡的结束状态，在离开过渡被触发时生效，在下一帧被移除


        html:
        <transition name="move">
            <!-- 父元素用于控制小球 透明度变化 -->
            <div class="decrease" v-show="food.count>0">
                <!-- 子元素用于控制小球旋转变化 -->
                <span class="inner icon-remove_circle_outline"></span>   
            </div>
        </transition>


        css：
        <!-- 小球enter之后最终结束时的状态 -->
        .decrease{
            transition:all 0.4s linear;
            transform:translate3d(0,0,0);
            opacity:1;
            .inner{
                transition:all 0.4s linear;
                transform:rotate(0deg);
            }
        }
        <!-- 小球刚刚enter的状态和小球leave-active状态 -->
        &.move-enter,&.move-leave-active{
            transition:all 0.4s linear;
            transform:translate3d(24px,0,0);
            opacity:0;
            .inner{
                transform:rotate(180deg);
            }
        }


```
2. 增加小球动画

    实现过程：

    1、小球最终的落点都是一致的，在左下角购物车按钮处 （transform:translate(0,0,0)）

    2、传递点击的 dom 对象
        在 cartcontrol 组件里点击 + 时， 将点击的 dom 元素，通过通过 $emit 派发给父组件 goods.vue
        this.$emit('add',event.target);
        <div class="cart-wrapper">
            <!-- add自定义事件用于派发当前点击的dom元素，add为子组件方法，addFood为父组件方法 -->
            <cartcontrol :food="food" @add="addFood"></cartcontrol>
        </div>
        // 子组件$emit派发而来的事件
        addFood(target) {
            this._drop(target);  //传递 target
        },
        _drop(target) {
            // 体验优化,异步执行下落动画
            this.$nextTick(() => {
            //调用 shopcar 组件中的 drop 方法，向 shopcar组件 传入当前点击的 dom 对象
                this.$refs.shopcart.drop(target);
            });
        }

    3.在 shopcar 组件里，创建 小球 dom 结构

        <!-- 小球容器 -->
        <div class="ball-container">
            <div v-for="ball in balls">
                <!-- 过度钩子函数 -->
                <transition name="drop" v-on:before-enter="beforeDrop" v-on:enter="dropping" v-on:after-enter="afterDrop">
                    <!--  外层纵向运动，内层横向运动-->
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>


    4. 创建 一个小球数组，内置5个对象（5个小球，均有 show 属性，初始值为false）
        以便在多次快速点击时，屏幕出现多个小球
        5个小球的初始位置 均在 左下角 购物车按钮处
        创建一个 dropBalls 数组用于存储 处在下落过程中的小球
        执行下落时 将 父组件传递过来的 dom 对象 当做一个属性 给 ball，方便 在下面的方法中计算 ball 的位置
        data() {
            return {
                // 创建5个小球用于动画
                balls:[{show:false},{show:false},{show:false},{show:false},{show:false}],
                dropBalls:[], // 存储下落小球
            }
    	},
    5.执行 v-on:before-enter="beforeDrop"  过度前钩子函数
        设置 ball 初始位置，计算处 初始位置与目标位置的 差值 x,y ，将小球 transform ：translate（x,y,0）到动画初始位置

    6.执行 v-on:enter="dropping"  过度中钩子函数
        手动触发浏览器重绘，将 ball 通过 transform ：translate（0，0，0） 移动到目标位置

    7. 执行 v-on:after-enter="afterDrop"  过度结束钩子函数
        从存储下落小球的数组里 unshift 当前小球
        并将当前小球 display:none; show:false

    8.样式
    .ball-container{
        //外层 做纵向运动
        .ball{
            position:fixed
            left:32px
            bottom:22px
            z-index:200
            //y 轴 贝塞尔曲线
            transition:all 2s cubic-bezier(0.49, -0.29, 0.75, 0.41)
            //内从做横向运动
            .inner{
                width:16px
                height:16px
                border-radius:50%
                background-color:rgb(0,160,220)
                //x 轴只需要线性缓动
                transition:all 2s linear
            }
        }

```

> 购物车列表的显示隐藏状态
    ```
        按钮控制 fold => fold 控制 => listShow ， listShow => 控制状态显示 (在totalCount>0)
        在 data 选项里，定义一个 fold（折叠，true） 控制购物车的显示隐藏状态
        在 computed 计算属性里，定义一个 listshow 方法，来表示购物车列表的显示隐藏状态

        listShow() {
            if(!this.totalCount){  //假如所选商品为 0 ，return 掉结果，并将 fold 置为初始值
                this.fold = true;
                return false;
            }
            let show = !this.fold; // 否则，取 fold 的反值，靠 fold 的变化来 决定 列表显示与否
            return show;
        }

        在 method 方法里有个 toggleList 方法控制 fold 状态
        toggleList(){
            if(!this.totalCount){
                return;
            }
            this.fold = !this.fold;
        },

    ```

> 详情页组件
```
    将选中的商品 通过 props 传给 子组件
    <food @add="addFood" :food="seeFoodinfo" ref="food"></food>
    food 组件 通过 $emit 将food 组件添加购物车按钮传递给 父组件 以便实现小球动画

    addFood(target){
        console.log(target);
        //当前组件必须在父组件 引入处，bangding @add="xxx",继而执行 父组件的 xxx 方法
        this.$emit('add',target);
    },

    详情页 过渡动画
    <transition name="fade" ></transition>

    &.fly-enter-active, &.fly-leave-active {
        transition: all 0.2s linear
    }
    &.fly-enter, &.fly-leave-active {
        transform: translate3d(100%, 0, 0)
    }
    ```



> ratingselect 组件（评价选择组件）