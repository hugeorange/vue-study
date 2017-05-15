### 饿了么 vue 项目总结

> 购物车计算属性使用
    
    1. 将 item.foods 数据 通过 props 属性传递到子组件（cartcontrol组件）

    2. 在 cartcontrol 组件内 执行  addCart、decreaseCart 方法改变  item.foods.count 的值
        如果 item.count 值不存在，使用  Vue.set(this.food,'count',1) ; 给foods增加 count 属性，如果直接增加 count 属性，不会产生响应式数据，必须用 ` Vue.use() `方法

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
        
        
