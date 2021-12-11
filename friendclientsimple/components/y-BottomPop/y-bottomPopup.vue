<template>
	<view @touchmove.stop.prevent>
		<view class="yc-popup-class yc-bottom-popup" :class="[show ? 'yc-popup-show' : '',radius ? 'borderRadius' : '']" :style="{background:bgcolor,height:height?height+'rpx':'auto'}">
			<view class="pop-head" v-show="showHead">
				<text @tap="handleClose">取消</text>
				<text class="color-main title">{{headTitle}}</text>
				<text class="color-main-detail" @tap="handleSuccess">确定</text>
			</view>
			<view class="pop-head" v-show="!showHead && mask">
				<text></text>
				<text class="color-main title">{{headTitle}}</text>
				<text class="cuIcon-close icon-close" @tap="handleClose"></text>
			</view>
			<slot></slot>
		</view>
		<view class="yc-popup-mask" :class="[show?'yc-mask-show':'']" v-if="mask" @tap="handleClose"></view>
	</view>
</template>

<script>
	export default {
		name: "ycBottomPopup",
		props: {
			//是否需要mask
			mask: {
				type: Boolean,
				default: true
			},
			showHead: {
				type: Boolean,
				default: true
			},
			headTitle: {
				type: String,
				default: ''
			},
			radius:{
				type: Boolean,
				default: false
			},
			//控制显示
			show: {
				type: Boolean,
				default: false
			},
			//背景颜色
			bgcolor: {
				type: String,
				default: "#fff"
			},
			//高度 rpx
			height: {
				type: Number,
				default: 0
			}
		},
		methods: {
			handleClose() {
				if (!this.show) {
					return;
				}
				this.$emit('close');
			},
			handleSuccess() {
				// this.handleClose()
				this.$emit('success',{})
			}
		}
	}
</script>

<style>
	.yc-bottom-popup {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999999999999999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		min-height: 20rpx;
		border-top: 1upx solid #ececec;
	}

	.yc-popup-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.yc-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	
	.borderRadius{
		border-radius: 30upx 30upx 0 0;
	}

	.yc-mask-show {
		opacity: 1;
		visibility: visible;
	}

	.pop-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 32upx;
		color: #666666;
		height: 120upx;
		padding: 0 32upx;
	}
	.title{
		font-size: 32upx;
		font-family: AlibabaPuHuiTiM;
	}

	.color-main-detail {
		color: var(--mainColor);
	}
</style>
