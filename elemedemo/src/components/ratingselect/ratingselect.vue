<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}} <span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}} <span class="count">{{positive.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}} <span class="count">{{negative.length}}</span></span>
		</div>
		<div class="switch" @click="toggleContent" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看由内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	//定义3个常量用来表示，组件描述内容
	const Positive = 0;
	const Negative = 1;
	const All = 2;
	export default{
	    props:{
	        ratings:{
	            type:Array,
				default(){
	                return [];
				}
			},
			selectType:{
	            type:Number,
				default(){
	                return All;
				}
			},
			onlyContent:{
	            type:Boolean,
				default(){
	                return false;
				}
			},
			desc:{
	            type:Object,
				default(){
	                return {
	                    all:'全部',
						positive:'满意',
						negative:'不满意'
					}
				}
			}
		},
		computed:{
			positive() {
	      	    return this.ratings.filter( (item)=> {
	      	        return item.rateType ===  Positive;
				})
			},
			negative() {
				return this.ratings.filter( (item)=> {
					return item.rateType ===  Negative;
				})
			}
		},
		methods:{
	        select(type,event){
	            if(!event._constructed){
	                return;
				}
				//不可以在子组件内，随意改变父组件传过来的值，通过 $emit 将子组件需要改变的值，发送给父组件，然后父组件在通过 props 传给 子组件，然后 view 就会发生相应的改变
//				this.selectType = type;
				this.$emit('select',type);
			},
			toggleContent(event){
	            if(!event._constructed){
	                return;
				}
				//向父组件 发送数据，通过 $emit ('xxx',arguments);  父组件： @xxx = '父组件自己的方法aaa'  在 父组件  methods 里调用 aaa(arguments) 接受参数
	            this.$emit('onlyContent',this.onlyContent);
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">

	@import "../../common/stylus/mixin.styl"
	.ratingselect{
		.rating-type{
			padding :18px 0
			margin:0 18px
			border-1px(rgba(7,17,27,0.1))
			font-size :0   // 子集用 display:inline-block 会有间隙问题，对父集设置 font-size:0 即可
			.block{
				display :inline-block
				padding :8px 12px
				/*border :1px solid red*/
				font-size :16px
				margin-right :8px
				border-radius :2px
				color:rgb(77,89,53)
				line-height :16px
				&.active{
					color :#fff
				}
				.count{
					font-size :8px
					margin-right :2px
				}
				&.positive{
					background-color :rgba(0,160,220,0.2)
					&.active{
						background-color :rgb(0,160,220)
					}
				}
				&.negative{
					background-color :rgba(77,85,93,0.2)
					&.active{
						background-color :rgb(77,85,93)
					}
				}

			}
		}
		.switch{
			padding :12px 18px
			color :rgb(147,153,159)
			line-height :24px;
			border-bottom 1px solid rgb(147,153,159)
			&.on {
				.icon-check_circle {
					color: #00c850
				}
			}
			.icon-check_circle{
				display :inline-block
				font-size :24px
				vertical-align :middle
			}
			.text{
				display :inline-block
				font-size :12px
			}
		}
	}

</style>
