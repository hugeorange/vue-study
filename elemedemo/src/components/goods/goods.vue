<template>
	<div class="goods">
		<!-- 左侧菜单 -->
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>

				</li>
			</ul>
		</div>
		<!-- 右侧商品详情 -->
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="food-list" ref="foodList">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="(food,index) in item.foods" class="food-item border-1px">
							<div class="icon">
								<img width="57" height="57" :src="food.icon">
							</div>
							<div class="content">
								<div class="name">{{food.name}}</div>
								<div class="desc">{{food.description}}</div>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
		                    		<span class="now">￥{{food.price}}</span>
		                    		<span class="old"v-show="food.oldPrice">￥{{food.oldPrice}}</span>
		                  		</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>		
	</div>
</template>

<script>
export default {
	data() {
		return {
			goods:[]
		}
	},
	created() {
		// 商品icon类名
		this.classMap = ['decrease','discount','guarantee','invoice','special'];

        // 创建完成 vue 实例后即请求接口，将值赋给 seller，继而通过 props将获得值传给子组件
        this.$http.get('./api/goods').then((response) => {
            console.log(response.data.data);
           
            this.goods = response.data.data;
            
        });
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.goods
	position:absolute
	top:180px
	bottom:46px
	display:flex
	width:100%
	overflow:hidden
	.menu-wrapper{
		// flex布局左栏固定
		flex:0 0 80px
		width:80px
		background-color:#f4f5f7
		.menu-item{
			// 用于垂直居中
			display:table
			width:56px
			height:54px
			background-color:#f3f5f7
			padding:0 12px
			line-height:14px
			
			.text{
				// 垂直居中 table-cell vertical-align
				display: table-cell;
			    width: 56px;
			    vertical-align: middle;
			    position: relative;
			    font-size: 12px;
			    border-1px(rgba(7,17,27,0.1))
			    
			    .icon{
					display:inline-block
					vertical-align:top
					position:relative
					width:12px
					height:12px
					margin-right:2px
					background-size:12px 12px
					background-repeat:no-repeat
					
					&.decrease{
						bg-image('decrease_3')
					}
					&.discount{
						bg-image('discount_3')
					}
					&.guarantee{
						bg-image('guarantee_3')
					}
					&.invoice{
						bg-image('invoice_3')
					}
					&.special{
						bg-image('special_3')
					}
				}
			}
			
			
		}
	}
	
	.foods-wrapper{
		flex:1
		.title{
			padding-left:14px
			height:26px
			font-size:12px
			line-height:26px
			color:rgb(147,153,159)
			background-color:#f3f5f7
			border-left:2px solid #d9dde1
		}
		.food-item{
			display:flex
			margin:18px
			padding-bottom:18px
			border-1px(rgba(7,17,27,0.1))
			&:last-child{
				border-none()
				margin-bottom:0
			}
			.icon{
				flex:0 0 57px
				margin-right:18px
			}
			.content{
				flex:1
				.name{
					margin:2px 0 8px 0
					line-height:14px
					color:rgb(7,17,27)
					font-size:14px
				}
				.desc{
					font-size:10px 
					line-height:10px
					color:rgb(147,153,159)
					margin-bottom:8px
				}
				.extra{
					font-size:10px
					color:rgb(147,153,159)
					line-height:12px
					.count{
						margin-right:8px
					}
				}
				.price{
					font-weight: 700
			        line-height: 24px
			        .now{
			            margin-right: 8px
			            font-size: 14px
			            color: rgb(240, 20, 20)
			        }
			        .old{
			            text-decoration: line-through
			            font-size: 10px
			            color: rgb(147, 153, 159)
		            }
				}
			}
		}
	}
</style>