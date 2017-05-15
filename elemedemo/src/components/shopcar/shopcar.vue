<template>
	<div class="shopcar">
		<div class="content">
			<div class="content-left">

				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>


				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>

				<div class="desc">另需配送费￥{{deliveryPrice}}</div>

			</div>

			<div class="content-right">
				<div class="pay" :class="payClass"> {{payDesc}} </div>
			</div>

		</div>
	</div>
</template>
<script>
export default {
	// props:['selectFoods','deliveryPrice','minPrice'],
	props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 30,
              count: 1
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
	data() {
		return {}
	},
	methods: {},
	computed:{
		totalPrice() {
			let total = 0;
			this.selectFoods.forEach((food) => {
				total += food.price * food.count;
			})
			return total;
		},
		totalCount() {
			let count = 0;
			this.selectFoods.forEach((food) => {
				count += food.count;
			})
			return count;
		},
		payDesc() {
			if(this.totalPrice == 0){
				return `￥${this.minPrice}起送`;
			}else if(this.totalPrice < this.minPrice){
				let diff = this.minPrice - this.totalPrice;
				return `还差￥${diff}起送`;
			}else{
				return '去结算';
			}
		},
		payClass() {
			if(this.totalPrice < this.minPrice){
				return 'not-enough';
			}else{
				return 'enough';
			}
		}
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.shopcar
	position:fixed
	left:0
	bottom:0
	z-index:50
	height:48px
	width:100%
	.content{
		display:flex
		height:48px
		// 防止 inline-block间隙
		font-size:0
		color:rgba(255,255,255,0.4)
		background-color:#141d27
		.content-left{
			flex:1
			.logo-wrapper{
				display:inline-block 
				vertical-align:top
				position:relative
				top:-10px
				margin:0 12px
				padding:6px
				width:56px
				height:56px
				box-sizing: border-box
		        border-radius: 50%
		        background: #141d27
		        .logo{
		        	width:100%
		        	height:100%
		        	border-radius:50%
		        	text-align:center
		        	background-color:#2b343c
		        	.icon-shopping_cart{
		        		line-height:44px
		        		font-size:24px
		        		color:#80858a
		        		&.highlight{
		        			color:#fff
		        		}
		        	}
		        	&.highlight{
		        		background: rgb(0, 160, 220)
		        	}
		        }
		        .num{
		        	position: absolute
		            top: 0
		            right: 0
		            width: 24px
		            height: 16px
		            line-height: 16px
		            text-align: center
		            border-radius: 16px
		            font-size: 9px
		            font-weight: 700
		            color: #fff
		            background: rgb(240, 20, 20)
		            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
		        }
			}
			.price{
				display:inline-block
				vertical-align:top
				line-height:24px
				font-size:16px
				color:rgba(255,255,255,0.4)
				font-weight:700
				margin-top:12px
				padding-right:12px
				box-sizing:border-box
				border-right: 1px solid rgba(255, 255, 255, 0.1)
				&.highlight{
					color:#fff
				}
			}
			.desc{
				display:inline-block
				vertical-align:top
				line-height:24px
				padding-left:12px
				font-size:10px
				color:rgba(255,255,255,0.4)
				margin-top:12px
			}
		}
		.content-right{
			flex:0 0 105px
			width:105px
			
			.pay{
				height:48px
				line-height:48px
				text-align:center
				font-size:12px
				font-weight:700
				&.not-enough{
					background-color:#2b333b
				}
				&.enough{
					background-color:#00b43c
					color:#fff
				}
			}
		}
	}
</style>