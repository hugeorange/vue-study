<template>
	<div class="header">
		<div class="content-wraper">
			<div class="avatar">
				<!-- v-bind :src="seller.avator" -->
				<img width='64' height='64' :src="seller.avatar">
			</div>
			<div class="content">

				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>

				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>

				<!-- 需要先判断 seller存不存在，因为是异步的 -->
				<div class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>

				<!-- 弹窗 -->
				<div v-if="seller.supports" class="support-count" @click="showDetail">
					<span class="count"> {{seller.supports.length}}个 </span>
					<i class="icon-keyboard_arrow_right"></i>
				</div>

			</div>
		</div>
		<!-- 公告 -->
		<div class="bulletin-wraper">
			<span class="bulletin-title"></span>
			<span class="bulletin-text"> {{seller.bulletin}} </span>
			<i class="icon-keyboard_arrow_right" @click="showDetail"></i>
		</div>

		<!-- 背景 -->
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%" alt="">
		</div>
		
		<!-- 弹框细节 transition -->
		<transition name="fade">
			<div class="detail" v-show="detailShow">
				<!-- 内容区域 -->
				<div class="detail-wrapper clearfix">
					<!-- 主题内容区域 -->
					<div class="detail-main">
						<h1 class="name"> {{seller.name}} </h1>

						<!-- star组件 -->
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>

						<!-- 标题信息 -->
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>

						<!-- supports内容 -->
						<ul v-if="seller.supports" class="support">
							<li class="support-item" v-for="(item,index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span><span class="text"> {{seller.supports[index].description}} </span>
							</li>
						</ul>

						<!-- 商家公告 -->
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>

						<!-- 公告内容 -->
						<div class="bulletin">
							<p class="content"> {{seller.bulletin}} </p>
						</div>

					</div>
				</div>
				<!-- 关闭按钮 -->
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import star from '../../components/star/star'
export default {
	props:['seller'],
	data() {
		return {
			detailShow:false
		}
	},
	methods:{
		showDetail() {
			this.detailShow = true;
		},
		hideDetail() {
			this.detailShow = false;
		}
	},
	components: {
		star:star
	},
	created() {
		this.classMap = ['decrease','discount','guarantee','invoice','special']
	},
	mounted() {
		console.log(this.seller);
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'


.header
	position:relative
	color:#fff
	background-color:rgba(7,17,27,0.5)
	.content-wraper
		padding:24px 12px 18px 24px
		font-size:0
		.avatar
			display:inline-block
			vertical-align:top
			img
				border-radius:2px
		.content
			display:inline-block
			margin-left:16px;
			font-size:14px
		
			.title
				margin:2px 0 8px 0
				.brand
					display:inline-block;
					width:30px;
					height:18px;
					vertical-align:bottom
					bg-image('brand');
					background-size:30px 18px
					background-repeat:no-repeat
				.name
					margin-left:6px
					font-size:16px
					font-weight:bold
					line-height:8px
			
				
			.description
				margin-bottom:10px
	            line-height:12px
	            font-size:12px
        	
        	.support{
        		
				.icon{
					display: inline-block
		            vertical-align: top
		            width: 12px
		            height: 12px
		            margin-right: 4px
		            background-size: 12px 12px
		            background-repeat: no-repeat
				}
				.decrease{
					bg-image('decrease_1')
				}
				.discount{
					bg-image('discount_1')
				}
				.guarantee{
					bg-image('guarantee_1')
				}
				.invoice{
					bg-image('invoice_1')
				}
				.special{
					bg-image('special_1')
				}
				.text{
					line-height:12px
					font-size:10px
				}
        	}
        	.support-count{
        		position:absolute
        		right:12px
        		bottom:50px
        		padding:0 8px
        		height:24px
        		line-height:24px
        		border-radius:14px
        		background-color:rgba(0,0,0,0.2)
        		text-align:center 
        		.count{
        			vertical-align:top
        			font-size:10px
        		}
        		.icon-keyboard_arrow_right{
        			margin-left:2px
        			line-height:24px
        			font-size:10px
        		}
        	}
	.bulletin-wraper{
		position:relative
		height:28px
		line-height:28px
		padding:0 24px 0 12px
		white-space:nowrap
		overflow:hidden
		text-overflow:ellipsis
		background-color:rgba(7,17,27,0.2)
		
		.bulletin-title{
			display:inline-block
			vertical-align:top
			margin-top:7px
			width:22px
			height:12px
			bg-image('bulletin')
			background-size:22px 12px
			background-repeat:no-repeat
		}
		.bulletin-text{
			vertical-align:top
			margin:0 4px
			font-size:10px
		}
		.icon-keyboard_arrow_right{
			position:absolute
			font-size:10px
			right:12px
			bottom:8px
		}
	}
	.background{
		position:absolute
		top:0
		left:0
		width:100%
		height:100%
		z-index:-1
		// 图片模糊
		filter:blur(10px)
	}
	.detail{
		// 相对于浏览器窗口进行定位
		position:fixed
		z-index:100
		top:0
		left:0
		width:100%
		height:100%
		// 元素超出容器产生滚动条
		overflow:auto
		background-color:rgba(7,17,27,0.8)
		
		// 给其父集添加类
		&.fade-enter-active, &.fade-leave-active{
			transition:all 1s
		}
		&.fade-enter, &.fade-leave-active{
			opacity:0
			background-color:rgba(7,17,27,0)
		}
		// 公告内容
		.detail-wrapper{
			width:100%
			min-height:100%
			.detail-main{
				margin-top:64px
				padding-bottom:64px
				.name{
					line-height:16px
					text-align:center
					font-size:16px
					font-weight:700
				}
				.star-wrapper{
					margin-top:18px
					padding:2px 0
					text-align:center
				}
				.title{
					display:flex
					width:80%
					margin:28px auto 24px auto
					.line{
						flex:1
						position:relative
						top:-6px
						border-bottom:1px solid rgba(255,255,255,0.2)
					}
					.text{
						padding:0 12px
						font-weight:700
						font-size:14px
					}
				}
				.support{
					width:80%
					margin:0 auto
					.support-item{
						padding:0 12px
						margin-bottom:12px
						font-size:0
						&:last-child{
							margin-bottom:12px
						}
						.icon{
							display:inline-block
							width:16px
							height:16px
							vertical-align:top
							margin-right:6px
							background-size:16px 16px
							background-repeat:no-repeat
						}
						.decrease{
							bg-image('decrease_2')
						}
						.discount{
							bg-image('discount_2')
						}
						.guarantee{
							bg-image('guarantee_2')
						}
						.invoice{
							bg-image('invoice_2')
						}
						.special{
							bg-image('special_2')
						}
						.text{
							line-height:16px
							font-size:12px
						}
					}
				}
				.bulletin{
					width:80%
					margin:0 auto
					.content{
						padding:0 12px
						line-height:24px
						font-size:12px
					}
				}	
			}
		}
		
		// 关闭按钮
		.detail-close{
			position: absolute;
		    width: 32px;
		    height: 32px;
		    margin: -50px auto 0 auto;
		    clear: both;
		    font-size: 32px;
		    left: 0;
		    right: 0;
		}
	}

//sticker footers 布局
// 父集宽高 100% overflow:auto
// 子集1： min-height:100%; padding-bottom:-64px;给子集2留出64px空间
// 子集2： position:absolute;left:0;right:0; margin:-64px auto 0 aut0



	           
        	
		

		
</style>