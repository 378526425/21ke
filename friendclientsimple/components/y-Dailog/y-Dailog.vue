<template>
	<!-- 首页资源珍贵弹窗 -->
	<view class="model-wrap" v-if="showModel" @tap="_hideModel">
		<view class="model-cont flex-center" @tap.stop>
			<view class="title padding-tb-lg" v-if="model.title">{{model.title}}</view>
			<view class="tip-text padding-tb-lg" v-if="model.content">{{model.content}}</view>
			<view class="btn-box">
				<view v-if="model.cancle" class="main-btn model-btn-two" @tap="_handleCancle">{{model.cancle}}</view>
				<view v-if="model.sure" class="main-btn model-btn model-btn-two" @tap="_handleSure">{{model.sure}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showModel: false,
				model: {
					title: '',
					content: '',
					sure: '确定',
					cancle: '取消'
				},
				callBack: null
			}
		},
		methods: {
			_showModel(params) {
				this.showModel = true
				this.model = { ...params
				}
				this.$emit('showModel')
			},
			//隐藏弹窗
			_hideModel() {
				this.showModel = false
			},
			_handleSure() {
				this.showModel = false
				if (this.model.success) {
					this.model.success()
				}
			},
			_handleCancle() {
				this.showModel = false
				if (this.model.fail) {
					this.model.fail()
				}
			}
		}
	}
</script>

<style lang="less">
	.model-wrap {
		.model-cont {
			flex-direction: column;
			width: 100%;
			margin: 0 60rpx;
			padding: 60rpx 30rpx 40rpx;
			background-color: #FFFFFF;
			border-radius: 8px;

			.tip-img {
				width: 120rpx;
				height: 120rpx;
			}

			.title {
				font-size: 32rpx;
				color: #333333;
				font-family: 'aliM';
				text-align: center;
				max-width: 460upx;
			}

			.tip-text {
				max-width: 460upx;
				line-height: 40rpx;
				text-align: center;
				font-size: 28rpx;
				color: #666666;
			}

			.model-btn {
				width: 400rpx;
				height: 72rpx;
				text-align: center;
			}

			.model-btn-two {
				text-align: center;
				padding: 12upx 36upx;
				flex: 1;
				margin: 0 10upx;
				letter-spacing: -2upx;
				max-width: 400rpx;
			}

			.btn-box {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: center;

				.model-btn {
					flex: 1;
					width: 260rpx;
					height: 72rpx;
					background-color: var(--mainColor) !important;
					color: #FFFFFF !important;
				}
			}
		}
	}
</style>
