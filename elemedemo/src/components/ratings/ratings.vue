<template>
	<div class="ratings" ref="ratings">
		<div class="rating-content">
			<!--概述-->
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<rateselect
				:selectType="selectType"
				:ratings="ratings"
				:onlyContent="onlyContent"
				@select="select"
				@onlyContent="toggleContent"
			></rateselect>

			<!--评论列表-->
			<div class="ratings-wrapper">
				<ul>
					<li class="rating-item" v-for="rating in ratings" v-show="needshow(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28" alt="">
						</div>
						<div class="content">
							<div class="name">{{rating.username}}</div>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<div class="delivery">{{rating.deliveryTime}}分钟送达</div>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span class="item" v-for="item in rating.recommend">{{item}}</span>
							</div>
							<div class="time">
								{{rating.rateTime | formatDate}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import  BScroll from 'better-scroll'
	import star from '../../components/star/star'
	import split from '../../components/split/split'
	import rateselect from '../../components/ratingselect/ratingselect'
	import {formatDate} from '../../common/js/utils'
	const All = 2;

export default {
	props:['seller'],
	components:{
	    star,
		split,
		rateselect
	},
	data(){
		return {
			selectType:All,
			ratings:[],
			onlyContent:false
		}
	},
	created(){
		this.$http.get('/api/ratings').then((response) => {
			response = response.body;
			if (response.errno === 0) {
				this.ratings = response.data;
				console.log(response.data);
				this.$nextTick(() => {
//				    debugger
					this.scroll = new BScroll(this.$refs.ratings, {
						click: true
					});
				});
			}
		});
	},
	updated(){
	    this.$nextTick(()=>{
	        this.scroll && this.scroll.refresh();
		})
	},
	methods:{
		select(type){
			this.selectType = type;
			this.$nextTick(() => {
			    this.scroll.refresh();
			})
		},
		toggleContent(onlyContent){
			this.onlyContent = !onlyContent;
			this.$nextTick(() => {
				this.scroll.refresh();
			})
		},
		needshow(type,txt){
//		    console.log(type,txt);
		    //仅显示文本，条件
			if(this.onlyContent && !txt){
			    return false;
			}
			//推荐显示条件
			if(this.selectType === All){
			    return true;
			}else{
			    console.log(this.selectType===type);
			    return this.selectType === type;
			}


		}
	},
	filters:{
	    formatDate(time){
	        let date = new Date(time);
	        return formatDate(date,'yyyy-MM-dd hh:mm');
		}
	}

}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.ratings{
		position :absolute
		left:0
		right:0
		bottom :0
		width:100%
		top:174px
		overflow :hidden
		//内容撑开
		.rating-content{
			.overview{
				display :flex
				padding :18px 0
				.overview-left{
					flex:0 0 137px
					padding : 0 6px
					width:137px
					border-right:1px solid rgba(7,17,27,0.1)
					text-align :center
					/*border :1px solid red*/
					@media only screen and (max-width: 320px) {
						flex: 0 0 120px
						width: 120px
					}

					.score{
						font-size :28px
						color: rgb(155, 153, 0)
						line-height :28px
						margin-bottom :6px
						// line-height :18px
					}
					.title{
						color: rgb(7, 17, 27)
						font-size :12px
						line-height :12px
						margin-bottom :8px
					}
					.rank{
						color: rgb(7, 17, 27)
						font-size :10px
						line-height :10px
					}
				}

				.overview-right{
					flex :1
					padding :6px 0 6px 14px
					/*border :1px solid green*/
					@media only screen and (max-width: 320px) {
						padding-left: 6px
					}
					.score-wrapper{
						margin-bottom :8px
						font-size :0
						.title{
							display :inline-block
							font-size :12px
							line-height :18px
							vertical-align :top
						}
						.star{
							display :inline-block
							margin:0 8px
							vertical-align :top
						}
						.score{
							display :inline-block
							vertical-align :top
							color :#821fe4
							line-height :18px
							font-size :12px
						}
					}
					.delivery-wrapper{
						font-size :0
						.title{
							font-size :12px
							line-height :18px
							color: rgb(7,17,27)
						}
						.delivery{
							font-size :12px
							color :rgb(147,153,159)
							margin-left :12px
						}
					}

				}
			}
			.ratings-wrapper{
				padding :0 18px
				.rating-item{
					padding :18px 0
					border-1px(rgba(7, 17, 27, 0.1))
					display :flex
					.avatar{
						width: 28px
						height: 28px
						flex :0 0 28px
						margin-right :12px
						img{
							border-radius :50%
						}
					}
					.content{
						flex:1
						position :relative
						.name{
							font-size :10px
							color :rgb(7,17,27)
							line-height :12px
						}
						.star-wrapper{
							font-size :0
							.star{
								display :inline-block
								margin-right :6px
							}
							.delivery{
								display :inline-block
								font-size :10px
								font-weight:800
								color :rgb(147,153,159)
								line-height :12px
							}
						}
						.text{
							font-size :12px
							color: rgb(7, 17, 27)
							line-height :18px
							margin-bottom :8px
							margin-top :6px
						}
						.recommend{
							font-size :0
							.icon-thumb_up{
								color :rgb(0,160,220)
								font-size :12px
								line-height :16px
							}
							.item{
								display :inline-block
								border :1px solid  rgba(7,17,27,0.1)
								color: rgb(147,153,159)
								border-radius :2px
								background-color :#fff
								font-size :9px
								line-height :16px
								margin-left :8px
								padding :0 6px
								margin-bottom :4px
							}
						}
						.time{
							position :absolute
							right:0
							top:0
							font-size :10px
							color :rgb(7,17,27)
							font-weight :200
						}
					}
				}
			}
		}
	}
</style>
