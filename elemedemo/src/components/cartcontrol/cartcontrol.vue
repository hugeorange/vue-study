<template>
	<div class="cartcontrol">
		<!-- 减号小球动画 -->
		<transition name='move'>
			<div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
				 <span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>	
		
		<div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click="addCart"></div>

	</div>
</template>
<script>
import Vue from 'vue'
export default {
	props:['food'],
	data() {
		return {

		}
	},
	created() {
		// console.log(this.food);
	},
	methods:{
		addCart(event) {
			if(!event._constructed){
				return;
			}
			if(!this.food.count){
				Vue.set(this.food,'count',1);
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
		font-size:24px
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