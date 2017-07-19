<template>
	<div class="cartcontrol">
		<!-- 减号小球动画 -->
		<transition name='move'>
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
				 <span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<!--商品数量-->
		<div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
		<!--增加按钮-->
		<!--阻止事件冒泡，防止点击事件穿透，进入商品详情页-->
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>

	</div>
</template>
<script type="text/ecmascript-6">
//import Vue from 'vue'
export default {
	props:['food'],
	data() {
		return {}
	},
	created() {
		// console.log(this.food);
	},
	methods:{
		addCart(event) {
		    //阻止pc 端，点击事件执行多次，（不是自己派发的事件，return）
			//点击事件是靠 better-scroll 派发的
			if(!event._constructed){
				return;
			}
			if(!this.food.count){
//				Vue.set(this.food,'count',1);
				this.$set(this.food,'count',1);
			}else{
				this.food.count++;
			}

			// 向父组件派发事件，并传递 当前dom元素
			this.$emit('add',event.target);
		},
		decreaseCart() {
			if(!event._constructed){
				return;
			}
			if(this.food.count > 0){
				this.food.count--;
			}
		}
	}
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
	font-size:0
	// 动画enter最终状态
	.cart-decrease{
		display: inline-block
        padding: 6px
        transition:all 0.4s linear
        transform:translate3d(0,0,0)
        opacity:1
        .inner{
        	display:inline-block
        	text-align:center
        	font-size:24px
        	line-height:24px
        	color: rgb(0, 160, 220)
        	transition:all 0.4s linear
        	transform:rotate(0deg)
        }

        // &.move-enter-active, &.move-leave-active{
        // 	transition: all 0.4s linear
        // }
        // 动画enter的初始状态 和 leave 的最终状态
        &.move-enter, &.move-leave-active{
        	transition: all 0.4s linear

        	opacity: 0
        	transform: translate3d(24px, 0, 0)
        	.inner{
          		transform: rotate(180deg)
        	}
        }
	}
	.cart-count{
		display: inline-block
		vertical-align:top
		text-align:center
		width:12px
		line-height: 24px
        padding-top: 6px
        font-size: 10px
        color: rgb(147, 153, 159)
	}
	.cart-add{
		display:inline-block
		vertical-align:top
		line-height:24px
		font-size:24px
		padding:6px
		color:rgb(0,160,220)
	}
</style>
