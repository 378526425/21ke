<template>
	<view class="page" :style="{ height: mineBoxHeight}">
		<u-navbar :is-back="true" title="资料详情" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> 
		 <view style="margin-right: 24rpx;" @click="popupshow=true" slot="right">
		 	<u-icon name="more-dot-fill" size="40" color="#fff"></u-icon>
		 </view>
		 </u-navbar>
   <u-popup v-model="popupshow"  mode="bottom">
		<view @click="jubao" class="close-btn">
			举报
		</view>
		<view @click="lahei" class="close-btn btnbottoom">
			拉黑
		</view>
	</u-popup>
		<view v-if="isyn" class="header">
			<u-swiper @click="ViewImage" height="640" :list="imgs" :autoplay="false" :effect3d-previous-margin="100" :effect3d="true"></u-swiper>
		</view>
		<view v-else class="header">
			<image class="bg" :src="geturl(userinfo.headPortrait)" />
			<view class="content">
				<view class="avatar-wrapper">
					<image class="img" :src="geturl(userinfo.headPortrait)" />
				</view>
			</view>
		</view>
		<view class="main">
			<view class="header">
				<view class="tab-group">
					<text class="tab active">我的信息</text>
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
					<image class="avatar" :src="geturl(userinfo.headPortrait)" />
					<view class="middle">
						<text class="nickname">{{userinfo.nickName}}</text>
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
							<text class="subtitle">(相互喜欢后可查看联系方式)</text>
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
		<u-modal v-model="show" :title="title" :content="content" width="70%" :show-cancel-button="showcancelbutton"
		 :confirm-style="{color: '#fe7e97'}" :confirm-text="confirmtext" :cancel-text="canceltext" @confirm="confirm()"
		 @cancel="cancel()"></u-modal>
		<view v-if="loginuserinfo!=null&&loginuserinfo.id!=userId" class="control">
			<view class="left" @click="matching(false,userId)">
				<image class="img" :src="require('@/static/icon/dislike.png')" />
			</view>

			<view v-if="(userinfo.matchingSuccess!=null&&userinfo.matchingSuccess==true)||userinfo.id==1" class="right" @click="toChat()">
				<image class="img" :src="require('@/static/icon/liaotian.png')" />
			</view>
			<view v-else class="right" @click="matching(true,userId)">
				<image class="img" :src="require('@/static/icon/like.png')" />
			</view>
		</view>
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
				show: false,
				content: '',
				title: '提示',
				confirmtext: '确认',
				canceltext: '取消',
				showcancelbutton: true,
				actionoperation: "",
				userId: "",
				userinfo: {},
				percent: 0,
				imgs: [],
				isyn: false,
				iqnorevip:false,
				loginuserinfo: {},
				viplevel:2,
				popupshow:false,
				userlogId:""
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
		onLoad(options) {
			let self=this;
			if (options) {
				this.userId = options.userId;
				if(options.iqnorevip!=undefined)
				{
					this.iqnorevip=options.iqnorevip;
				}
				try {
					const restoken = uni.getStorageSync('loginuserinfo');
					if (restoken) {
						
						Server.get("/user/getUserInfo/" + restoken.user.id, {}, {
							success: response => {
								self.loginuserinfo = response.data.data;
							},
							warnings: response => {
								self.showcancelbutton = false; //修改取消按钮
								self.content = response;
								self.title = "警告";
								self.show = true;
							},
							error: response => {
								self.showcancelbutton = false; //修改取消按钮
								self.content = response;
								self.title = "错误";
								self.show = true;
							}
						})
					}
				} catch (e) {
					// error
				}
				
				this.initdata();
				this.userlogId =
					uni.getStorageSync("loginuserinfo") &&
					uni.getStorageSync("loginuserinfo").user&&
					uni.getStorageSync("loginuserinfo").user.id;
			}
		},
		methods: {
			goToSetting() {
				uni.navigateTo({
					url: '/pagesI/mine/Setting'
				})
			},
			initdata() {
				let self = this;
				Server.get("/user/getUserInfo/" + self.userId, {}, {
					success: response => {
						self.userinfo = response.data.data;
						self.imgs = [];
						if (!self.isEmpty(self.userinfo.selfieImg)) {
							for (var i = 0; i < self.userinfo.selfieImg.length; i++) {
								self.imgs.push({
									image: self.geturl(self.userinfo.selfieImg[i].path)
								});
							}
							if (self.userinfo.selfieImg.length > 0) {
								self.isyn = true;
							}

						}

						self.addpercent();
					},
					warnings: response => {
						self.showcancelbutton = false; //修改取消按钮
						self.content = response;
						self.title = "警告";
						self.show = true;
					},
					error: response => {
						self.showcancelbutton = false; //修改取消按钮
						self.content = response;
						self.title = "错误";
						self.show = true;
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
			},
			ViewImage(e) {
				let that = this;
				let list = [];
				for (let i = 0; i < this.imgs.length; i++) {
					list.push(this.imgs[i].image);
				}
				uni.previewImage({
					indicator: "number",
					current: e,
					urls: list
				});
			},
			matching(attitude, useridb) {
				if(this.iqnorevip||(this.loginuserinfo&&this.loginuserinfo.vipLevel&&(this.loginuserinfo.vipLevel[1].status||this.loginuserinfo.genderId==3)))
				{
					Server.post("/user/matching", {
						attitude: attitude,
						userIdB: useridb
					}, {
						success: response => {
							console.log("入库结束")
							if (response.data.data.result == true) {
								this.showcancelbutton = true;
								this.content = "你们相互喜欢了,是否立刻开启聊天";
								this.title = "太赞了"
								this.confirmtext = "开始聊天";
								this.canceltext = "再看看";
								this.show = true;
								this.actionoperation = "tochat";
								this.chatuseridA = response.data.data.userIdA;
								this.chatuseridB = response.data.data.userIdB;
								
							} else {
								this.showcancelbutton = false
								if (attitude) {
									this.content = "你喜欢了对方，对方将收到你的喜欢，相互喜欢后即可开启聊天";
								} else {
									this.content = "你不喜欢了对方，对方将无法与你开启聊天并无法查看你的联系方式";
								}
								this.title = "提示";
								this.show = true;
							}
							this.initdata();
						},
						service: response => {
							if (response.data.code == 506 || response.data.code == 507) {
								if(response.data.code == 506)
								{
									this.viplevel=1;
								}
								this.actionoperation = "addvip";
								this.showcancelbutton = true //修改取消按钮
								this.content = response.data.msg;
								this.title = "权限不足";
								this.confirmtext = "立刻升级";
								this.canceltext = "再看看";
								this.show = true;
							} else {
								this.showcancelbutton = false //修改取消按钮
								this.content = response.data.msg;
								this.show = true;
							}
						},
						warnings: response => {
							this.showcancelbutton = false
							this.content = response;
							this.title = "警告";
							this.show = true;
						},
						error: response => {
							this.showcancelbutton = false
							this.content = response;
							this.title = "错误";
							this.show = true;
						}
					})
				}else{
					this.actionoperation = "addvip";
					this.showcancelbutton = true //修改取消按钮
					this.content = "升级为至尊会员可不限场景喜欢对方";
					this.title = "权限不足";
					this.confirmtext = "立刻升级";
					this.canceltext = "再看看";
					this.show = true;
				}
				
			},
			confirm() {
				
				let self = this;
				console.log("点击了确认")
				if (self.actionoperation == "addvip") {
					uni.navigateTo({
						url: '/pagesC/memberCenter/memberCenter?level='+self.viplevel
					});
				}
				if (self.actionoperation == "tochat") {
					self.toChat();
				}
				if (self.actionoperation == "tolist") {
					uni.switchTab({
						url: '/pages/list/index'
					});
				}
				if (self.actionoperation == "lahei") {
					self.actionoperation="tolist";
					
					self.showcancelbutton = false //修改取消按钮
					self.content = "已拉黑对方，对方将无法向你发送任何消息";
					self.title = "提示";
					self.confirmtext = "确定";
					self.show = true;
				}
				
				if (self.actionoperation != "tolist")
				{
					self.actionoperation = ""; //置空防止干扰
				}
				
			},
			cancel() {
				console.log("点击了取消")
			},
			toChat() {
				let self=this;
				try {
					const restoken = uni.getStorageSync('loginuserinfo');
					if (restoken) {
						uni.navigateTo({
							url: "/pagesB/HM-chat/HM-chat?userId=" + restoken.user.id + "&nickName=" + this.userinfo.nickName +
								"&sendUserId=" +
								self.userId,
						});
					}
				} catch (e) {
					// error
				}

			},
			lahei()
			{
				this.actionoperation = "lahei";
				this.showcancelbutton = true //修改取消按钮
				this.content = "你确定要拉黑对方吗？拉黑后对方将无法向你发送任何消息";
				this.title = "提示";
				this.confirmtext = "拉黑";
				this.canceltext = "取消";
				this.show = true;
			},
			jubao()
			{
				uni.navigateTo({
					url: "/pagesG/jubao/jubao"
				});
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
			height: 640rpx;
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
		z-index: 888;
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
	.control {
		position: fixed;
		bottom: 100upx;
		left: 100upx;
		right: 100upx;
		z-index: 999;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left,
		.right {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #ffffff;
			box-shadow: 0 0 20upx #ecf0f1;
			height: 100upx;
			width: 100upx;
			border-radius: 50%;
		}
		.img {
			height: 70upx;
			width: 70upx;
		}
	}
</style>