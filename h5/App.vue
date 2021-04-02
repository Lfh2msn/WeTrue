<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	page{
		background-color: #efefef;
	}
	.empty{
		height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	//sass循环语法
	@for $i from 0 through 200 {
		$rpx: $i * 1rpx !important; //默认间距单位
	
		.mb-#{$i} {
			margin-bottom: $rpx;
		}
	
		.mr-#{$i} {
			margin-right: $rpx;
		}
	
		.mt-#{$i} {
			margin-top: $rpx;
		}
	
		.font#{$i} {
			font-size: $rpx;
		}
	}
</style>
