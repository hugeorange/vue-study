### 饿了么 vue 项目总结

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

> 菜单栏根据实物列表滚动实时高亮

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

        如果 item.count 值不存在，使用   ``Vue.set(this.food,'count',1)`` ; 给foods增加 count 属性，如果直接增加 count 属性，不会产生响应式数据，必须用  Vue.use() 方法

    3. 在子组件改变 item.foods对象的值，相应的父组件内的 item的值会随之改变（js复杂数据类型地址引用）

    4. 在父组件 goods.vue 利用计算属性 动态的生成购物车数据，然后通过 props属性传递给 shopcart.vue 组件
        计算属性的计算出的 值，为响应式数据可以直接拿来使用,即在  v-for 中直接遍历  selectFoods 
        
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




