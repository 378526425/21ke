<template>
	<view>
		<u-navbar :is-back="true" title="组局详情" title-color="#fff" back-icon-color="#fff"
			:back-text-style="{ color: '#fff' }" back-text="返回" :background="{backgroundColor: '#fe7e97'}">
			<view style="margin-right: 24rpx;" @click="popupshow=true" slot="right">
				<u-icon name="more-dot-fill" size="40" color="#fff"></u-icon>
			</view>
		</u-navbar>
		<u-popup v-model="popupshow" mode="bottom">
			<view @click="jubao" class="close-btn">
				举报
			</view>
		</u-popup>
		<view class="detail-wrap">
			<view class="item-head">
				<view class="left-info">
					<view class="flex-center" @tap="toOthers(userinfo.id)">
						<u-avatar :src="geturlimg(userinfo.headPortrait)" mode="circle" :showSex="true"
							:sex-icon="userinfo.gender" :sex-bg-color="userinfo.sexbgColor"></u-avatar>
					</view>
					<view class="head-name" @tap="toOthers(userinfo.id)">{{ userinfo.nickName }}</view>
				</view>
				<view :class="['follow-btn flex-center','followed']" @tap="toOthers(userinfo.id)">ta的主页</view>
			</view>

			<view class="content-box"> {{gamecontent}}
			</view>
			<view class="bottom-time">
				<u-tag :text="gameTypeText(gametype)" mode="light" size="mini" shape="circle" bg-color="#FAF0FE"
					color="#E6BBF8" border-color="#FAF0FE" />
			</view>
			<view class="bottom-time">
				<text>{{publishTime}}</text>
			</view>
			<view v-if="!isself" @click="invitGame()" class="row_btn">邀请ta</view>
			<view v-else @click="deleteGame()" class="row_btn">删除</view>
		</view>

		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :confirm-text="confirmtext" :cancel-text="canceltext"
			:content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}" :show-cancel-button="iscancel"
			@confirm="confirm"></u-modal>
	</view>

</template>

<script>
	import Server from "@/common/serverutil.js";
	import Vue from 'vue'
	export default {
		data() {
			return {
				id: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				iscancel: false,
				confirmtext: "确定",
				canceltext: "取消",
				userinfo: {},
				gamecontent: "",
				gametype: "",
				publishTime: "",
				isself: false,
				popupshow: false,
				actionoperation: "",
				gametypeList: [{
						value: "1",
						label: "打游戏"
					},
					{
						value: "2",
						label: "约饭"
					},
					{
						value: "3",
						label: "看电影"
					},
					{
						value: "4",
						label: "酒吧蹦迪"
					}, {
						value: "5",
						label: "外出游玩"
					},
					{
						value: "6",
						label: "运动"
					}, {
						value: "7",
						label: "街拍摄影"
					}, {
						value: "8",
						label: "卡拉OK"
					}, {
						value: "9",
						label: "剧本杀"
					}, {
						value: "10",
						label: "看话剧"
					},
					{
						value: "11",
						label: "艺术展"
					}, {
						value: "12",
						label: "狼人杀"
					},
					{
						value: "13",
						label: "游泳"
					},
					{
						value: "14",
						label: "真人CS"
					},
					{
						value: "15",
						label: "滑板"
					},
					{
						value: "16",
						label: "演唱会"
					},
					{
						value: "17",
						label: "卡丁车"
					},
					{
						value: "18",
						label: "爬山"
					}, {
						value: "19",
						label: "图书馆"
					},
					{
						value: "20",
						label: "其他"
					}
				]
			};
		},
		onLoad(options) {
			if (options && options.id) {
				this.id = options.id;
				this.initdata();
			}
		},

		methods: {
			handleFab(e) {
				let index = e.index;
				switch (index) {
					case 0:
						uni.navigateTo({
							url: '../../pagesL/push/push'
						});
						break;
					case 1:
						uni.navigateTo({
							url: '/pagesI/mine/timeLine'
						})
						break;
				}
			},
			toOthers(userid) {
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=' + userid
				})
			},

			initdata() {
				let self = this;
				//加载动态
				Server.get("/Game/gameInvitInfo/" + self.id, {}, {
					success: response => {
						self.userinfo = response.data.data.userViewModel;
						self.gamecontent = response.data.data.content;
						self.gametype = response.data.data.gameType;
						self.publishTime = response.data.data.publishTime;
						let loginUserId =
							uni.getStorageSync("loginuserinfo") &&
							uni.getStorageSync("loginuserinfo").user &&
							uni.getStorageSync("loginuserinfo").user.id;
						if (loginUserId == response.data.data.userId) {
							self.isself = true;
						}
					},
					warnings: response => {
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: response => {
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					}
				})
			},
			invitGame() {
				let self = this;
				//加载动态
				Server.get("/Game/invitGame/" + self.id, {}, {
					success: response => {
						self.modelcontent = "邀请成功，对方已收到你的邀请通知，若对方同意了你的邀请，将解锁与对方的聊天";
						self.modeltitle = "提示";
						self.modelshow = true;
					},
					service: response => {
						self.actionoperation = "addvip";
						self.modelcontent = response.data.msg;
						self.modeltitle = "权限不足";
						self.iscancel = true;
						self.modelshow = true;

					},
					warnings: response => {
						if (response.indexOf("升级为至尊会员可不受次数限制") != -1) {
							self.actionoperation = "addvip";
							self.modelcontent = "今日邀请次数达到上限，请明天再来或升级为至尊会员可不受次数限制";
							self.modeltitle = "权限不足";
							self.iscancel = true;
							self.modelshow = true;
						} else {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.modelshow = true;
						}

					},
					error: response => {
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;

					}
				})
			},
			deleteGame() {
				let self = this;
				Server.delete(
					"/Game/deleteGameInvit/" + self.id, {}, {
						success: (response) => {
							uni.navigateTo({
								url: '/pagesF/gametypelist/gametypelist?title=我的组局&myself=true'
							});
						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.modelshow = true;
						},
						service: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response.data.msg;
							self.modeltitle = "提示";
							self.modelshow = true;
						},
						error: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.modelshow = true;
						}
					}
				);
			},
			jubao() {
				uni.navigateTo({
					url: "/pagesG/jubao/jubao"
				});
			},
			confirm() {
				let self = this;
				console.log("点击了确认")

				if (self.actionoperation == "addvip") {
					uni.navigateTo({
						url: '/pagesC/memberCenter/memberCenter?level=2'
					});
				}
				self.actionoperation = ""; //置空防止干扰
			},
			geturlimg(url) {
				return Vue.prototype.serveraddress + "/" + url;
			},
			gameTypeText(type) {
				for (var i = 0; i < this.gametypeList.length; i++) {
					if (type == this.gametypeList[i].value) {
						return this.gametypeList[i].label;
					}
				}
				return "其他";
			}
		}
	};
</script>

<style lang="less" scoped>
	.detail-wrap {
		background-color: #ffffff;
		padding: 0rpx 0 100rpx;

		.item-head {
			display: flex;
			align-items: center;
			padding: 20rpx 40rpx;
			width: 100%;
			justify-content: space-between;
			border-bottom: 1rpx solid var(--mainColor);
			position: relative;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			background-color: #fff;
			height: 120rpx;

			.left-info {
				display: flex;
				align-items: center;

				.img-wrap {
					width: 80rpx;
					height: 80rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
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
				/* color: #fff;
				background: var(--activeColor); */
				border: 1rpx solid #fe7e97;
			}
		}

		.swiper-wrap {
			position: relative;

			.swiper-box {
				margin: 0rpx 0 40rpx;
				height: 600rpx;
				background-color: #cccccc;
			}

			.custom-indicator {
				position: absolute;
				right: 10px;
				top: 10px;
				background: rgba(0, 0, 0, 0.5);
				padding: 3px 5px;
				border-radius: 12px;
				color: #fff;
			}
		}

		.content-box {
			padding: 0 40rpx;
			font-size: 32rpx;
			line-height: 50rpx;
			margin-top: 30rpx;
		}

		.bottom-time {
			padding: 20rpx 40rpx;
			font-size: 24rpx;
			color: #999999;
		}

		.comment-wrap {
			background-color: #fff;
			padding: 0 40rpx 40rpx;

			.scroll-wrap {
				height: 100%;
				border-top: 1rpx solid var(--mainColor);
			}

			.comment-item {
				display: flex;
				justify-content: space-between;

				.left-avatar {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					overflow: hidden;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
					}
				}

				.right-box {
					margin-left: 20rpx;
					flex: 1;

					.right-mine {
						padding: 20rpx;
						background-color: #f5f8f9;
						border-radius: 10rpx;
						flex: 1;
					}

					.right-top {
						display: flex;
						justify-content: space-between;

						.reply {
							display: flex;
							font-size: 28rpx;
						}

						.active {
							color: var(--activeColor) !important;
						}




					}

					.content {
						padding: 10rpx 0;
					}
				}
			}
		}

		.comment-input {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			padding: 20rpx 40rpx;
			border-top: 1rpx solid #ECECEC;

			.top-input {
				width: 100%;
				height: 60rpx;
				display: flex;
				align-items: center;
				padding: 0 40rpx;
				background-color: #f5f5f5;
				color: #000;
				border-radius: 80rpx;
				flex: 1;
			}

			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				width: 140rpx;
				margin-left: 20rpx;
				border-radius: 40rpx;
				border: 1rpx solid var(--activeColor);
				color: var(--activeColor);
				background-color: #ffffff;
			}
		}
	}

	.author {
		background-color: var(--activeColor);
		color: #ffffff;
		padding: 0 8rpx;
		margin-left: 10rpx;
		border-radius: 6rpx;
	}

	.time {
		color: #999;
		font-size: 19rpx;
	}

	.commentmore {
		text-align: right;
		color: #fe7e97;
	}

	.row_btn {
		width: 80%;
		height: 100upx;
		text-align: center;
		background-image: linear-gradient(to right, #fba3d9, #fe7e97);
		color: #ffffff;
		margin: 80upx auto;
		border-radius: 60upx;
		line-height: 100upx;
	}

	.close-btn {
		text-align: center;
		padding: 30rpx;
	}
</style>
