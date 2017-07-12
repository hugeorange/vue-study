<template>
	<transition name="fly">
		<div class="food" v-show="showFlag">

		</div>
	</transition>

</template>

<script>
	export default {
	    //父子组件通过 props 传值时，如果子组件 没有显示出来 ，即子组件 拿不到父组件的值
		props:['food'],
		//注册组件，然后才可以在模板里使用
		components: {

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
	}
</style>
