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
					<ratingselect
						@select="selectRating"
						@onlyContent="toggleContent"
						:ratings="food.ratings"
						:selectType="selectType"
						:onlyContent="onlyContent"
						:desc="desc"
					></ratingselect>

					<!--评价列表-->
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType,rating.text)"  class="rating-item" v-for="rating in food.ratings">
								<!--自定义过滤器 日期格式化-->
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img width="12" height="12" :src="rating.avatar" alt="">
								</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
									{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>

</template>

<script>
	import cartcontrol from '../../components/cartcontrol/cartcontrol'
	// 分割线组件
	import split from '../../components/split/split'
	import ratingselect from '../../components/ratingselect/ratingselect'
	import Bscroll from 'better-scroll'
	//模块化编程 引入通用工具方法 common js utils.js 具体方法
	import {formatDate} from 'common/js/utils';

	const Positive = 0;
	const Negative = 1;
	const All = 2;

	export default {
	    //父子组件通过 props 传值时，如果子组件 没有显示出来 ，即子组件 拿不到父组件的值
		props:['food'],
		//注册组件，然后才可以在模板里使用
		components: {
			cartcontrol,
			split,
			ratingselect
		},
		data() {
			return {
				showFlag:false,
				selectType:All,
				onlyContent:true,
				desc:{
				    all:'全部',
					positive:'推荐',
					negative:'吐槽'
				}
			}
		},
		created() {},
		updated() {
			this.scroll && this.scroll.refresh();
		},
		computed: {},
		//过滤器方法
		filters:{
			formatDate(time){
			    let date = new Date(time);
			    return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		methods: {
		    //可被外部调用的方法，正常命名，不可被外部调用的方法 以 _ 开头
		    show() {
		        this.showFlag = true;
				this.selectType = All;
				this.onlyContent = false;

		        this.$nextTick( () => {
		            if(!this.scroll){
		                this.scroll = new Bscroll(this.$refs.foodcontent,{
		                    click:true
						})
					}

					this.scroll && this.scroll.refresh();
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
			},

			//子组件选择评价类别 向父组件传递的 type 值
			selectRating(type){
			    this.selectType = type;
			    this.$nextTick(()=> {
					this.scroll.refresh();
				})
			},
			toggleContent(onlyContent){
			    var self = this;
			    this.onlyContent = !onlyContent;

				this.$nextTick(()=> {
					this.scroll.refresh();
				})
			},
			needShow(type,text){
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === All) {
					return true;
				} else {
					return type === this.selectType;
				}
			}
		}
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
			padding-bottom :100px
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
			//评价样式
			.rating{
				padding-top :18px;
				.title{
					line-height: 14px
					margin-left: 6px
					font-size: 14px
					color: rgb(7, 17, 27)
				}
				.rating-wrapper{
					padding :0 18px
					.rating-item{
						position :relative
						padding :16px 0
						border-1px(rgba(7,17,27,0.1))
						.user{
							position: absolute;
							right: 0;
							line-height :12px
							img {
								border-radius: 50%
								margin-left: 6px
							}
						}
						.time{
							margin-bottom :6px
							font-size :10px
							color :rgb(147,153,159)
							line-height :12px
						}
						.text{
							color:rgb(7,17,27)
							font-size :12px
							line-height :12px
							vertical-align :top
							.icon-thumb_up,.icon-thumb_down{
								margin-right :4px
								font-size :12px
								line-height :24px
							}
							.icon-thumb_up{
								color :rgb(0,160,220)
							}
							.icon-thumb_down{
								color :rgb(147,153,159)
							}
						}
					}
					.no-ratings{
						color: rgb(147, 158, 159)
						font-size :16px
						text-align :center
						margin-top: 10px;
					}
				}
			}
		}
	}
</style>
