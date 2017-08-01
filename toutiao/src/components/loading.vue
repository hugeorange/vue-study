<template>
	<div class="loadEffect">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
	</div>
</template>
<script>
		var ele = document.querySelector(".loadEffect");
		var loading = {
			elements:ele,
			show(){

				console.log(this);
				console.log(loading);
				// this.elements.style.display = 'block';
				// document.querySelector(".loadEffect").style.display = 'block';
				loading.elements.style.display = 'block';
			},
			hide(){
				this.elements.style.display = 'none';
			}
		}

		console.log(loading);

		export default loading;
	

</script>
<style rel="stylesheet/scss" lang="scss">
	.loadEffect{
            width: 100px;
            height: 100px;
            position: relative;
            margin: 0 auto;
            margin-top:100px;
            z-index: 999;
            display: none;
        }
        .loadEffect span{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #13c913;
            position: absolute;
            -webkit-animation: load 1.04s ease infinite;
        }
        @-webkit-keyframes load{
            0%{
                opacity: 1;
            }
            100%{
                opacity: 0.2;
            }
        }
        .loadEffect span:nth-child(1){
            left: 0;
            top: 50%;
            margin-top:-8px;
            -webkit-animation-delay:0.13s;
        }
        .loadEffect span:nth-child(2){
            left: 14px;
            top: 14px;
            -webkit-animation-delay:0.26s;
        }
        .loadEffect span:nth-child(3){
            left: 50%;
            top: 0;
            margin-left: -8px;
            -webkit-animation-delay:0.39s;
        }
        .loadEffect span:nth-child(4){
            top: 14px;
            right:14px;
            -webkit-animation-delay:0.52s;
        }
        .loadEffect span:nth-child(5){
            right: 0;
            top: 50%;
            margin-top:-8px;
            -webkit-animation-delay:0.65s;
        }
        .loadEffect span:nth-child(6){
            right: 14px;
            bottom:14px;
            -webkit-animation-delay:0.78s;
        }
        .loadEffect span:nth-child(7){
            bottom: 0;
            left: 50%;
            margin-left: -8px;
            -webkit-animation-delay:0.91s;
        }
        .loadEffect span:nth-child(8){
            bottom: 14px;
            left: 14px;
            -webkit-animation-delay:1.04s;
        }
</style>
