<template>
	<view class="page" :style="{ height: mineBoxHeight}">
		<view class="header">
			<image class="bg" :src="geturl(userinfo.headPortrait)" />
			<view class="content">
				<view  class="top-bar" :style="{top: (statusBarHeight + 30) + 'px'}">
					<view class="item" @click="goToSetting">
						<image class="icon" :src="require('@/static/icon/setting.png')" />
						<text>设置</text>
					</view>
					<view @click="jumpToPersonal" class="item">
						<image class="icon" :src="require('@/static/icon/checkin.png')" />
						<text>编辑卡片</text>
					</view>
				</view>
				<view @click="gotouser(userinfo.id)" class="avatar-wrapper">
					<image class="img"  :src="geturl(userinfo.headPortrait)" />
				</view>
			</view>
		</view>
		<view class="main">
			<view class="header">
				<view class="tab-group">
					<text class="tab active">信息卡片</text>
					<!-- <text class="tab">我的信条</text>
					<text class="tab">访客</text> -->
				</view>
			</view>
			<view>
				<!-- <view class="progress-box">
					<view class="progress-bar">
						<view class="percent-box">
							<text class="percent">55%</text>
							<view class="triangle"></view>
						</view>
					</view>
				</view>
				<view class="progress-label">资料完成度高于80%，预计曝光率提高1倍</view> -->
				<view class="progress-img">
					<u-line-progress active-color="#fe7e97" :percent="percent"></u-line-progress>
				</view>
				<view v-if="percent>=80" class="progress-label">资料完成度高于{{percent}}%，预计曝光率优秀</view>
				<view v-else-if="percent<80&&percent>=60" class="progress-label">资料完成度{{percent}}%，预计曝光率良好</view>
				<view v-else-if="percent<60&&percent>=30" class="progress-label">资料完成度{{percent}}%，预计曝光率一般</view>
				<view v-else="percent<30" class="progress-label">资料完成度{{percent}}%，预计曝光率极差</view>
				<view class="info">
					<image @click="gotouser(userinfo.id)" class="avatar" :src="geturl(userinfo.headPortrait)" />
					<view class="middle">
						<text @click="gotouser(userinfo.id)" class="nickname">{{userinfo.nickName}}</text>
						<view style="display: flex">
							<view v-if="userinfo.genderId==3" class="extra">
								<image class="sex" :src="require('@/static/icon/female_pink.png')" />
								<text>{{userinfo.age}}·{{userinfo.xinzuo}}·{{userinfo.stageName}}</text>
							</view>
							<view v-else class="extraman">
								<image class="sex" :src="require('@/static/icon/man_icon.png')" />
								<text>{{userinfo.age}}·{{userinfo.xinzuo}}·{{userinfo.stageName}}</text>
							</view>
						</view>
					</view>
					<view class="line"></view>
					<view class="right">
						<text class="count">{{userinfo.likeMeCount}}</text>
						<view class="heart-receive-wrapper">
							<text class="text">收到</text>
							<image class="heart-receive" :src="require('@/static/icon/heart_receive.png')" />
						</view>
					</view>
				</view>

				<view class="desc">
					{{userinfo.personalSignature}}
				</view>
				<view class="section">
					<view class="header">
						<image class="section-icon" :src="require('@/static/icon/about.png')" />
						<view class="title-wrapper">
							<text class="title">基础资料</text>
						</view>
					</view>
					<view class="about content">
						<text class="tag" v-if="userinfo.height!=null">身高:{{userinfo.height}}cm</text>
						<text class="tag" v-if="userinfo.homeTown!=null">家乡:{{userinfo.homeTown}}</text>
						<text class="tag" v-if="userinfo.residencePlace!=null">长居:{{userinfo.residencePlace}}</text>
						<text class="tag" v-if="userinfo.stageName!=null">状态:{{userinfo.stageName}}</text>
						<text class="tag" v-if="userinfo.profession!=null">职业:{{userinfo.profession}}</text>
					</view>
				</view>
				<view  class="section">
					<view class="header">
						<image class="section-icon" :src="require('@/static/icon/contact.png')" />
						<view class="title-wrapper">
							<text class="title">联系方式</text>
							<text class="subtitle">(心动后，可向对方发起交换申请)</text>
						</view>
					</view>
					<view class="contact-method content">
						<view class="weixin-wrapper">
							<image class="weixin-icon" :src="require('@/static/icon/weixin.png')" />
							<text>微信</text>
						</view>
						<text class="weixin">{{userinfo.weixin}}</text>
					</view>
					<view class="contact-method content">
						<view class="weixin-wrapper">
							<image class="weixin-icon" :src="require('@/static/icon/qq.png')" />
							<text>QQ</text>
						</view>
						<text class="weixin">{{userinfo.qq}}</text>
					</view>
				</view>

				<view class="section">
					<view class="header">
						<image class="section-icon" :src="require('@/static/icon/shu_qian.png')" />
						<view class="title-wrapper">
							<text class="title">个人标签</text>
						</view>
					</view>
					<view class="tagclass">
						<!-- 交友需求 -->
						<u-tag v-for="(item, index) in userinfo.makefriendsdeman" :key="item.id" class="tagone" :text="item.name" mode="light"
						 shape="circle" bg-color="#FCF0F7" color="#F5C8E0" border-color="#FCF0F7" />
						<!-- 个性签名 -->
						<u-tag v-for="(item, index) in userinfo.personalitytag" :key="item.id" class="tagone" :text="item.name" mode="light"
						 shape="circle" bg-color="#FAF0FE" color="#E6BBF8" border-color="#FAF0FE" />
						<!-- 音乐-->
						<u-tag v-for="(item, index) in userinfo.music" :key="item.id" class="tagone" :text="item.name" mode="light" shape="circle"
						 bg-color="#EFF9FE" color="#8FD3F5" border-color="#EFF9FE" />
						<!-- 运动-->
						<u-tag v-for="(item, index) in userinfo.motion" :key="item.id" class="tagone" :text="item.name" mode="light"
						 shape="circle" bg-color="#EFFEF6" color="#72CD9D" border-color="#EFFEF6" />
						<!-- 话题-->
						<u-tag v-for="(item, index) in userinfo.conversation" :key="item.id" class="tagone" :text="item.name" mode="light"
						 shape="circle" bg-color="#F5F3FE" color="#BDB0F9" border-color="#F5F3FE" />
					</view>
				</view>

				<view class="section">
					<view class="header">
						<image class="section-icon" :src="require('@/static/icon/qa.png')" />
						<view class="title-wrapper">
							<text class="title">问答</text>
						</view>
					</view>
					<view class="qa content">
						<view class="wenda_body">

							<view class="wenda" v-for="(item, index) in userinfo.problemViewModelList" @click="addanswer(item)">
								<view class="wenda_title">
									﹒ {{item.problemTitle}}
								</view>
								<view class="wenda_content">
									{{item.answerContent}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	import Vue from 'vue'
	export default {
		name: 'MineIndex',
		components: {},
		data() {
			return {
				sexOption: [{}],
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				userId: "",
				userinfo: {},
				percent: 0
			}
		},
		computed: {
			statusBarHeight() {
				const {
					statusBarHeight
				} = getApp().globalData
				return statusBarHeight
			},
			mineBoxHeight() {
				return `calc(100vh - 100upx + ${this.statusBarHeight}px)`
			}
		},
		onShow() {
			let self = this;
			try {
				const restoken = uni.getStorageSync('loginuserinfo');
				if (restoken) {
					self.userId = restoken.user.id;
				}
			} catch (e) {
				// error
			}
			this.initdata();
		},
		methods: {
			gotouser(userid) {
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=' + userid
				})
			},
			jumpToPersonal() {
				uni.navigateTo({
					url: '/pagesJ/personal/index'
				})
			},
			goToSetting() {
				uni.navigateTo({
					url: '/pagesI/mine/Setting'
				})
			},
			initdata() {
				let self = this;
				Server.get("/user/getUserInfoCheck/" + self.userId, {}, {
					success: response => {
						self.userinfo = response.data.data;
						self.addpercent();
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
			geturl(url) {
				return Vue.prototype.serveraddress + "/" + url;
			},
			addpercent() {
				let self = this;
				self.percent = 0;
				if (!self.isEmpty(self.userinfo.nickName)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.age)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.personalSignature)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.weixin)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.qq)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.profession)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.height)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.homeTown)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.residencePlace)) {
					self.percent = self.percent + 5;
				}

				if (!self.isEmpty(self.userinfo.stageId)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.genderId)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.headPortrait)) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.firstSelfiePath)) {
					self.percent = self.percent + 10;
				}
				if (!self.isEmpty(self.userinfo.makefriendsdeman) && self.userinfo.makefriendsdeman.length > 0) {
					self.percent = self.percent + 5;
				}

				if (!self.isEmpty(self.userinfo.personalitytag) && self.userinfo.personalitytag.length > 0) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.music) && self.userinfo.music.length > 0) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.motion) && self.userinfo.motion.length > 0) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.conversation) && self.userinfo.conversation.length > 0) {
					self.percent = self.percent + 5;
				}
				if (!self.isEmpty(self.userinfo.problemViewModelList) && self.userinfo.problemViewModelList.length > 0) {
					self.percent = self.percent + 5;
				}
			},
			isEmpty(item) {
				if (item != null && item != undefined && item != '') {
					return false;
				} else {
					return true;
				}
			}
		}

	}
</script>

<style lang="less" scoped>
	@mainColor: #fe7e97;
	.flexAllCenter {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.page {
		// height: calc(100vh - 100upx);
		overflow: scroll;
		>.header {
			position: absolute;
			left: 0;
			right: 0;
			height: 640upx;
			.bg {
				// content: '';
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				-webkit-filter: blur(60upx);
				-moz-filter: blur(60upx);
				-o-filter: blur(60upx);
				-ms-filter: blur(60upx);
				filter: blur(60upx);
				height: 640upx;
			}
			.content {
				position: relative;
				z-index: 99;
				height: 640upx;
				.top-bar {
					position: relative;
					// z-index: 9999999;
					display: flex;
					align-items: center;
					font-size: 30upx;
					color: #ffffff;
					.item {
						display: flex;
						align-items: center;
						background-color: rgba(0, 0, 0, 0.3);
						padding: 5upx 10upx;
						border-radius: 30upx;
						margin-left: 20upx;
						// margin-top: 50upx;
						.icon {
							height: 40upx;
							width: 40upx;
							margin-right: 10upx;
						}
						&:nth-child(2) {
							.icon {
								height: 30upx;
								width: 30upx;
							}
						}
					}
				}
				.avatar-wrapper {
					position: relative;
					left: 50%;
					// top: 50%;
					transform: translate(-50%, 70%);
					box-sizing: border-box;
					border: 30upx solid rgba(245, 245, 245, 0.6);
					width: 250upx;
					height: 250upx;
					border-radius: 50%;
					// display: flex;
					// align-items: center;
					// justify-content: center;
					.img {
						height: 100%;
						width: 100%;
						border-radius: 50%;
						border: 10upx solid #ffffff;
						position: relative;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}
		}
	}
	.main {
		position: relative;
		z-index: 999;
		background-color: #ffffff;
		top: 640upx;
		border-top-left-radius: 30upx;
		border-top-right-radius: 30upx;
		.header {
			padding-left: 20upx;
			.tab-group {
				font-size: 25upx;
				color: #999999;
				padding: 20upx 0;
				.tab {
					margin-right: 50upx;
					&.active {
						color: #333333;
						font-size: 30upx;
					}
				}
			}
		}
		.progress-box {
			margin: 0 20upx;
			margin-top: 50upx;
			height: 10upx;
			background: #cecece;
			border-radius: 20upx;
			position: relative;
			.progress-bar {
				position: absolute;
				left: 0;
				top: 0;
				width: 55%;
				height: 10upx;
				background: @mainColor;
				border-radius: 20upx;
				.percent-box {
					position: absolute;
					right: -40upx;
					top: -60upx;
					width: 80upx;
					height: 40upx;
					background: @mainColor;
					border-radius: 50upx;
					.flexAllCenter();
					.percent {
						font-size: 24upx;
						color: #fff;
					}
					.triangle {
						height: 0;
						width: 0;
						position: absolute;
						left: calc(50% - 8upx);
						bottom: -6px;
						border-color: @mainColor transparent transparent transparent;
						border-style: solid;
						border-width: 16upx 8upx 0 8upx;
					}
				}
			}
		}
		.progress-label {
			font-size: 24upx;
			margin-top: 10upx;
			margin-left: 20upx;
		}
		.progress-img {
			margin-right: 20upx;
			margin-left: 20upx;
		}
		.info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0 0 20upx #ecf0f1;
			margin-left: 20upx;
			margin-right: 20upx;
			padding: 20upx;
			border-radius: 20upx;
			margin-top: 50upx;
			.middle {
				flex: 1;
				margin-left: 20upx;
				.nickname {
					display: inline-block;
					font-size: 35upx;
					margin-bottom: 10upx;
				}
			}
			.line {
				width: 1px;
				height: 80upx;
				background-color: #f3f3f3;
			}
			.avatar {
				height: 100upx;
				width: 100upx;
				border-radius: 50%;
			}
			.right {
				margin-left: 20upx;
				text-align: center;
				.heart-receive-wrapper {
					display: flex;
					align-items: center;
					justify-content: center;
					.text {
						font-size: 20upx;
					}
					.heart-receive {
						width: 20upx;
						height: 20upx;
						margin-left: 10upx;
					}
				}
			}
			.extra {
				display: flex;
				align-items: center;
				color: #fb90bc;
				font-size: 20upx;
				padding: 5upx 10upx;
				border-radius: 20upx;
				background-color: #fef1f3;
				.sex {
					width: 20upx;
					height: 20upx;
					margin-right: 20upx;
				}
			}
			.extraman {
				display: flex;
				align-items: center;
				color: #0FBCF9;
				font-size: 20upx;
				padding: 5upx 10upx;
				border-radius: 20upx;
				background-color: #E5F8FF;
				.sex {
					width: 20upx;
					height: 20upx;
					margin-right: 20upx;
				}
			}
		}
		.desc {
			background-image: linear-gradient(to right, #fba3d9, #fb90bc);
			min-height: 300upx;
			margin: 30upx 20upx;
			border-radius: 10upx;
			padding: 20upx;
			font-size: 30upx;
			color: white;
			display: flex;
			align-items: center;
		}
		.section {
			box-shadow: 0 0 20upx #ecf0f1;
			margin: 0 20upx;
			border-radius: 20upx;
			padding: 20upx;
			margin-bottom: 30upx;
			.header {
				display: flex;
				border-bottom: 1px solid #e5e5e5;
				padding-bottom: 10upx;
				.section-icon {
					height: 50upx;
					width: 50upx;
				}
				.title-wrapper {
					font-size: 35upx;
					display: flex;
					flex-direction: column;
					.subtitle {
						font-size: 20upx;
						color: #999999;
					}
				}
			}
			.qa,
			.hobby-empty {
				.title {
					font-size: 20upx;
					color: #999999;
				}
				.add-btn {
					font-size: 90upx;
					font-weight: bold;
					color: #e5e5e5;
					display: block;
					height: 150upx;
					width: 150upx;
					border: 1px dashed #e5e5e5;
					border-radius: 20upx;
					text-align: center;
					margin-top: 20upx;
				}
			}
			.qa {
				padding-top: 20upx;
				.qa-item {
					display: flex;
					flex-direction: column;
					.question,
					.answer {
						font-size: 25upx;
					}
					.answer {
						color: #999999;
						padding-left: 15upx;
					}
				}
			}
			.about {
				font-size: 20upx;
				display: flex;
				flex-wrap: wrap;
				padding-top: 20upx;
				.tag {
					color: #999999;
					background-color: #e5e5e5;
					padding: 10upx 20upx;
					margin-right: 20upx;
					border-radius: 25upx;
					margin-bottom: 20upx;
				}
			}
			.hobby {
				display: flex;
				flex-wrap: wrap;
				padding-top: 20upx;
				font-size: 20upx;
				.tag {
					border-radius: 25upx;
					padding: 10upx 20upx;
					margin-bottom: 20upx;
					margin-right: 20upx;
					&.pink {
						background-color: #fdf1f3;
						color: #fb90bc;
					}
				}
			}
			.contact-method {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30upx 0;
				.weixin {
					font-size: 25upx;
				}
				.weixin-wrapper {
					display: flex;
					align-items: center;
					font-size: 30upx;
					.weixin-icon {
						width: 40upx;
						height: 40upx;
						margin-right: 10upx;
					}
				}
			}
		}
	}
	.tagone {
		margin-top: 20upx;
		margin-left: 20upx;
	}
	.tagclass {
		text-align: center;
		position: relative;
		min-height: 60upx;
		display: block;
		padding: 10upx;
	}
	.wenda_body {
		padding: 10upx;
	}
	
	.wenda {
		padding: 10upx;
	}
	
	.wenda_title {
		padding: 10upx;
		font-size: 28upx;
		color: #494949;
	}
	
	.wenda_content {
		font-size: 26upx;
		padding: 10upx;
		color: #A8A8A8;
	}
</style>
