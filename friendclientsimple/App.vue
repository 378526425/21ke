<script>
	// #ifdef H5
	import pageAnimation from './components/y-pageAnimation/index.vue'
	// #endif
	export default {
		// #ifdef H5
		mixins: [pageAnimation],
		// #endif
		mpType: 'app',
		data: () => {
			return {
				globalData: {
					statusBarHeight: 0
				}
			}
		},
		onShow() {
			//判断用户登录状态
			uni.getSystemInfo({
				success: ({
					statusBarHeight
				}) => {
					this.globalData.statusBarHeight = statusBarHeight
				}
			})
		},
		onLaunch() {
			let that = this;
		}
	};
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
	
	@import 'colorui/main.css';
	@import 'colorui/icon.css';
	@import 'colorui/animation.css';
	
	/*每个页面公共css */
	
	
	page {
		--mainColor: #435257;
		--activeColor: #fe7e97;
	}
	
	body {
		font-family: 'AliR';
		//background-color: #f5f8f9;
	}
	
	view {
		box-sizing: border-box;
	}
	
	.flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.mainColor {
		color: var(--mainColor);
	}
	
	.aColor {
		color: var(--activeColor);
	}
	
	.color-nine{
		color: #999999;
	}
	
	.main-btn {
		border-radius: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--mainColor);
		border: 1upx solid var(--mainColor);
		padding: 10rpx 40rpx;
	}
	
	.active-btn {
		color: #FFFFFF !important;
		background-color: var(--activeColor) !important;
		border: 1upx solid var(--activeColor) !important;
	}
	
	/* 点赞和评论 */
	.bottom-btn {
		display: flex;
	
		.btn-item {
			flex: 1;
			color: var(--mainColor);
	
			.img {
				width: 50rpx;
				height: 50rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
