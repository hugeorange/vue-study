<template>
	<transition name="fly">
		<div class="food" v-show="showFlag" ref="foodcontent">
			<!-- 商品内容 -->
			<div class="food-content">
				<!-- 头部图片 -->
				<div class="image-header">
					<img :src="food.image" alt="">
					<!-- 离开 -->
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>

				<!-- 商品详情 => 购买按钮 -->
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="details">
						<span class="sell-count">{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>

					<!-- 当所选商品有数量时，显示 cart-control 组件 -->
					<div class="cartcontrol-wrapper" v-show="food.count>0">
						<cartcontrol @add="addFood" :food="food"></cartcontrol>
					</div>

					<!-- 当所选商品无数量时，显示加入购物车按钮 -->
					<transition name="fade">
						<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">
							加入购物车
						</div>
					</transition>
				</div>

				<!-- 商品信息组件 -->
				<split v-show="food.info"></split>
				<!--商品信息-->
				<div class="info" v-show="food.info">
					<h1>商品信息</h1>
					<div class="text">{{food.info}}</div>
				</div>
				<split v-show="food.info"></split>

				<!--评价内容-->
				<div class="rating">
					<h1 class="title">商品评价</h1>

				</div>
			</div>
		</div>
	</transition>

</template>

<script>
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	import split from '../../components/split/split'
	import Bscroll from 'better-scroll'
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
		created() {},
		updated() {},
		computed: {},
		methods: {
		    //可被外部调用的方法，正常命名，不可被外部调用的方法 以 _ 开头
		    show() {
		        this.showFlag = true;
		        this.$nextTick(() => {
		            if(!this.scroll){
		                this.scroll = new Bscroll(this.$refs.foodcontent,{
		                    click:true
						})
					}else{
		                this.scroll && this.scroll.refresh();
					}
				})
			},
			hide(){
				this.showFlag = false;
			},
			addFood(target){
			    console.log(target);
			    //当前组件必须在父组件 引入处，bangding @add="xxx",继而执行 父组件的 xxx 方法
		        this.$emit('add',target);
			},
			addFirst(event){
			    if(!event._constructed) return;
				this.$emit('add', event.target);
			    this.$set(this.food,'count',1);
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
			// 此处为什么要选择注释里这样布局？ ==>因为，防止网络情况不好时，图片加载太慢，无法第一时间撑开高度，导致底部内容跑道上面来
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

			//商品内容
			.content{
				position :relative
				padding :18px
				.title{
					font-size :14px
					font-weight :700
					line-height :14px
					margin-bottom :8px
					color :rgb(7,17,27)
				}
				.details{
					margin-bottom :18px
					color :rgb(147,153,159)
					font-size :10px
					line-height :10px
				}
				.price{
					font-weight :700
					line-height: 24px
					.now{
						margin-right :8px
						font-size :14px
						color :rgb(240,20,20)
					}
					.old{
						color :rgb(147,153,159)
						text-decoration :line-through
						font-size :10px
					}
				}
				.cartcontrol-wrapper{
					position :absolute
					right: 12px
					top:12px
				}
				.buy{
					position: absolute
					right: 18px
					top: 18px
					z-index: 10
					height: 24px
					line-height: 24px
					padding: 0 12px
					box-sizing: border-box
					border-radius: 12px
					font-size: 10px
					color: #fff
					background: rgb(0, 160, 220)
					opacity: 1
					&.fade-enter-active, &.fade-leave-active {
						transition: all 1s
					}
					&.fade-enter, &.fade-leave-active {
						opacity: 0
						z-index: -1
					}
				}
			}

			//商品信息
			.info{
				padding: 18px
				.title{
					line-height: 14px
					margin-bottom: 6px
					font-size: 14px
					color: rgb(7, 17, 27)
				}
				.text{
					line-height: 24px
					padding: 0 8px
					font-size: 12px
					color: rgb(77, 85, 93)
				}
			}
		}
	}
</style>
