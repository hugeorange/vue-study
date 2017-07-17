<template>
	<transition name="fly">
		<div class="food" v-show="showFlag">
			<!-- 商品内容 -->
			<div class="food-content">
				<!-- 头部图片 -->
				<div class="image-header">
					<img :src="food.image" alt="">
					<!-- 离开 -->
					<div class="back">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>

				<!-- 商品详情 => 购买按钮 -->
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>

					<!-- 当所选商品有数量时，显示 cart-control 组件 -->
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>	
					</div>
					
					<!-- 当所选商品无数量时，显示加入购物车按钮 -->
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count===0">
							加入购物车
						</div>
					</transition>
				</div>
				
				<!-- 商品信息组件 -->
				<split v-show="food.info"></split>
			</div>
		</div>
	</transition>

</template>

<script>
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	// 分割线组件
	import split from '../../components/split/split'

	export default {
	    //父子组件通过 props 传值时，如果子组件 没有显示出来 ，即子组件 拿不到父组件的值
		props:['food'],
		//注册组件，然后才可以在模板里使用
		components: {
			cartcontrol,
			split
		},
		data() {
			return {
				showFlag:false
			}
		},
		created() {
			console.log(this.food);
		},
		updated() {
			console.log(this.food);
		},
		computed: {},
		methods: {
		    //可被外部调用的方法，正常命名，不可被外部调用的方法 以 _ 开头
		    show() {
		        this.showFlag = true;
			}
		},
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.food{
		position :fixed
		left:0
		right:0
		top:0
		bottom:0
		width :100%
		background-color :#fff

		/*  只有单一方向动画
		&.fly-enter-active{
			transform: translate3d(100%, 0, 0)
			transition: all 0.2s linear
		}
		&.fly-enter-to{
			transform: translate3d(0%, 0, 0)
		}
		*/
		//进入离开动画均有

		&.fly-enter-active, &.fly-leave-active {
			transition: all 0.2s linear
		}
		&.fly-enter, &.fly-leave-active {
			transform: translate3d(100%, 0, 0)
		}
		
		// 商品详情
		.food-content{
			// 此处为什么要这样布局？
			.image-header{
				position:relative
				// width:100%
				// height:0
				// padding-top:100%
				img{
					// position:absolute
					// top:0
					// left:0
					width:100%
					// height:100%
				}
				.back{
					position:absolute
					top:10px
					left:0
					.icon-arrow_lift{
						display:block
						padding:10px
						font-size:20px
						color:#fff
					}
				}
			}
		}
	}
</style>
