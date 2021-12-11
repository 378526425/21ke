<template>
	<view :class="['card-item',radius ? 'radius' : '']">
		<view class="item-head">
			<view class="left-info" @click="gotouserinfo(item.userId)">
				<view class="flex-center">
					<u-avatar :src="geturl(item.headPortrait)" mode="circle" :showSex="true" :sex-icon="item.gender" :sex-bg-color="item.sexbgColor"></u-avatar>
				</view>
				<view class="head-name">{{ item.nickName }}</view>
			</view>
			<text class="color-nine">{{item.publishTime}}</text>
		</view>
		<view class="content" @tap="toDetails(item.id)">
			<view class="text-content">{{ item.textContent }}</view>
			<view class="img-wrap padding-bottom-lg" v-if="item.imgList.length == 1">
				<view class="img-box">
					<image v-for="(child, idx) in item.imgList" :key="idx" :src="geturl(child.url)" mode="widthFix" class="img"
					 @tap.stop @tap="ViewImage(idx, item.imgList)"></image>
				</view>
			</view>
			<view class="img-list padding-bottom-lg" v-if="item.imgList.length > 1">
				<view class="img-box" v-for="(child, idx) in item.imgList" :key="idx">
					<image :src="geturl(child.url)" mode="widthFix" class="img" @tap.stop @tap="ViewImage(idx, item.imgList)"></image>
				</view>
			</view>
			<view class="address_label" v-if="item.address!=null&&item.address!=''">
				<u-icon name="map"></u-icon>{{item.address.replace("市","")}}
			</view>
			<view class="bottom-btn padding-bottom-sm">
				<view class="btn-item flex-center">
					<image class="img" src="../../static/img/diary/img_say.png" mode="widthFix"></image>
					<text>{{ item.commentCount  }}</text>
				</view>
				<view class="btn-item flex-center" @tap.stop @tap="handleLike(item.id, !isLike)">
					<image class="img" v-if="isLike" src="../../static/img/diary/img_zan_1.png" mode="widthFix"></image>
					<image class="img" v-else src="../../static/img/diary/img_zan.png" mode="widthFix"></image>
					<text>{{ likecount }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import Server from "@/common/serverutil.js";
	export default {
		props: {
			obj: {
				type: Object
			},
			radius: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				item: this.obj,
				showPop: false,
				commentList: [],
				isLike: this.obj.isLike,
				likecount: this.obj.praiseCount
			};
		},
		watch: {
			obj(val) {
				this.list = val;
			}
		},
		methods: {
			handleFollow(id) {
				let that = this;
				that.item.follow = !that.item.follow;
			},
			toDetails(id) {
				uni.navigateTo({
					url: '../../pagesD/diary/details?id=' + id
				});
			},
			handleLike(id, isLike) {
				let that = this;
				that.isLike = isLike;

				if (isLike) {
					Server.get("/blog/addPraise/" + id, {}, {
						success: response => {
							that.likecount = response.data.msg;
						},
						warnings: response => {
							that.modelcontent = response;
							that.modeltitle = "警告";
							that.modelshow = true;
						},
						service: response => {
							that.modelcontent = response.data.msg;
							that.modeltitle = "警告";
							that.modelshow = true;
						},
						error: response => {
							that.modelcontent = response;
							that.modeltitle = "错误";
							that.modelshow = true;
						}
					}, false)
				} else {
					Server.get("/blog/reducePraise/" + id, {}, {
						success: response => {
							that.likecount = response.data.msg;
						},
						service: response => {
							that.modelcontent = response.data.msg;
							that.modeltitle = "警告";
							that.modelshow = true;
						},
						warnings: response => {
							that.modelcontent = response;
							that.modeltitle = "警告";
							that.modelshow = true;
						},
						error: response => {
							that.modelcontent = response;
							that.modeltitle = "错误";
							that.modelshow = true;
						}
					}, false)
				}
			},
			ViewImage(index, arr) {
				let that = this;
				let list = [];
				for (let i = 0; i < arr.length; i++) {
					list.push(that.geturl(arr[i].url));
				}
				uni.previewImage({
					current: index,
					urls: list
				});
			},
			geturl(url) {
				return Vue.prototype.serveraddress+"/" + url;
			},
			gotouserinfo(userid) {
				/* uni.navigateTo({
					url: '/pages/profile/index?userId=' + userid
				}) */
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=' + userid
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.radius {
		border-radius: 16rpx;
	}

	.card-item {
		padding: 20rpx 30rpx 0rpx;
		background-color: #ffffff;
		box-shadow: 0 20rpx 40rpx 0 rgba(0, 0, 0, 0.1);

		.item-head {
			display: flex;
			align-items: center;
			width: 100%;
			justify-content: space-between;

			.left-info {
				display: flex;
				align-items: center;

				.img-wrap {
					width: 80rpx;
					height: 80rpx;
					overflow: hidden;
					border-radius: 50%;

					.avatar {
						width: 100%;
						height: 80rpx;
					}
				}

				.head-name {
					padding-left: 40rpx;
					color: #666666;
					font-size: 32rpx;
				}
			}

			.follow-btn {
				width: 140rpx;
				height: 60rpx;
				border: 1rpx solid var(--mainColor);
				color: var(--mainColor);
				border-radius: 40rpx;
			}

			.followed {
				color: #fff;
				background: var(--activeColor);
				border: 1rpx solid var(--activeColor);
			}
		}

		.content {
			.text-content {
				padding: 40rpx 0;
				justify-content: space-between;
				color: var(--mainColor);
				font-size: 30rpx;
				text-align: justify;
			}

			.img-list {
				display: flex;
				flex-flow: row wrap;

				.img-box {
					flex: 0 0 30%;
					margin: 0 1% 1%;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
					height: 200rpx;
					border-radius: 4px;
					background-color: #ececec;

					.img {
						width: 100%;
					}
				}
			}

			.img-wrap {
				.img-box {
					width: 100%;
					max-height: 400rpx;
					overflow: hidden;
					display: flex;
					align-items: center;
				}
			}
		}
	}

	.cont {
		--color: var(--activeColor);
		--count: 1;
	}

	.padding-bottom-sm {
		border-top: 1rpx solid #ebebeb;
		padding-top: 15rpx;
	}

	.address_label {
		color: #666666;
		font-size: 25rpx;
		padding-bottom: 10rpx;
	}
</style>
