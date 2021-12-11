<template>
	<view class="empty-wrap" :style="{height: height + 'px'}">
		<view class="img-box"><image src="@/static/img/img_empty.png" mode="widthFix" class="img"></image></view>
		<p class="empty-text">{{emptyText}}</p>
		<slot></slot>
	</view>
</template>

<script>
	export default{
		props:{
			emptyText: {
				type: String,
				default: '暂无数据哦！'
			},
			height: {
				type: [Number,String],
				default: 300
			}
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="less" scoped>
.empty-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	.img-box {
		width: 200rpx;
		height: 192rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		.img {
			width: 200rpx;
			height: 164rpx;
		}
	}
	.empty-text {
		text-align: center;
		font-size: 24rpx;
		color: #999999;
		padding: 30rpx;
	}
}
</style>
