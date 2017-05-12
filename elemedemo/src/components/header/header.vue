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

				

			</div>
		</div>
		<div class="bulletin-wraper"></div>
	</div>
</template>
<script>
export default {
	props:['seller'],
	data() {
		return {
			
		}
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
	color:#fff
	background-color:#000
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
        	}

        		
        	



	           
        	
		

		
</style>