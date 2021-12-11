<template>
	<view style="overflow-x: hidden;">
		<view class="bg">
			<image class="bg-img" src="/pagesC/static/memercent/bg.png" mode=""></image>
		</view>
		<view class="nav" :style="{ paddingTop: statusBarHeight+20 + 'px' }">
			<image class="nav-back" src="/pagesC/static/memercent/back.png" mode="" @click="back"></image>
			<text class="nav-title">会员中心</text>
		</view>

		<view class="info" :style="{marginTop: statusBarHeight + 44 + 'px'}">
			<image class="info-bg" src="/pagesC/static/memercent/info-bg.png" mode=""></image>

			<view class="info-content">
				<view class="info-avatar">
					<u-avatar :src="geturl(userinfo.headPortrait)" mode="circle"></u-avatar>
				</view>
				<view class="info-name">
					<text class="info-name">{{userinfo.nickName}} </text>
					<text class="info-level">升级至尊会员享额外特权</text>
				</view>
			</view>

			<view class="info-asset">
				<view class="info-asset-item">
					<text class="iai-title">超级会员</text>
					<text
						class="iai-value">{{userinfo.vipLevel!=null&&userinfo.vipLevel[0].status==true?userinfo.vipLevel[0].overTime:"未开通"}}</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">至尊会员</text>
					<text
						class="iai-value">{{userinfo.vipLevel!=null&&userinfo.vipLevel[1].status==true?userinfo.vipLevel[1].overTime:"未开通"}}</text>
				</view>
			</view>
		</view>

		<view class="main-title" v-if="viplevel==1">
			<text style="color:#E3BE83;">超级会员充值</text>
			<text>/</text>
			<text @click="chaneviplevel(2)">至尊会员充值</text>
		</view>
		<view class="main-title" v-else-if="viplevel==2">
			<text @click="chaneviplevel(1)">超级会员充值</text>
			<text>/</text>
			<text style="color:#E3BE83;">至尊会员充值</text>
		</view>

		<scroll-view scroll-x>
			<view class="recharge">
				<view class="recharge-item" :class="current == index ? 'recharge-item-active': ''"
					v-for="(item, index) in rechargeOptions" :key="index" :style="{marginLeft: !index ? '30rpx': ''}"
					@click="rechargeChange(index)">
					<text class="recharge-item-duration">{{ item.duration }}</text>
					<view class="recharge-item-price">
						<text class="rmb">￥</text>
						<text class="recharge-item-price-text">{{ item.price }}</text>
					</view>
					<text class="recharge-item-des">{{ item.des }}</text>
				</view>
			</view>
		</scroll-view>
		<view class="button update" hover-class="hover" @click="goPay">
			<text class="button-text"
				v-if="(viplevel==1&&userinfo.vipLevel!=null&&userinfo.vipLevel[0].status==true)||(viplevel==2&&userinfo.vipLevel!=null&&userinfo.vipLevel[1].status==true)">续费</text>
			<text class="button-text" v-else>立刻升级</text>
		</view>

		<text class="tip">升级后享优先推荐</text>

		<view class="main-title">
			<text>会员特权</text>
		</view>

		<view class="privilege">
			<view class="privilege-item" v-for="(item, index) in privilegeList" :key="index" hover-class="hover"
				@click="privilegeClick(index)">
				<image class="privilege-item-pic" :src="item.pic" mode=""></image>
				<text class="privilege-item-text">{{ item.text }}</text>
			</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%"
			:confirm-style="{ color: '#fe7e97' }" @confirm="confirm"></u-modal>

		<view>
		</view>
	</view>
	</view>
</template>

<script>
	let iapChannel = null,
		productIds = ['21ke37852642506', '21ke37852642504', '21ke37852642507', '21ke37852642505', '21ke37852642501',
			'21ke37852642503', '21ke378526425', '21ke37852642502'
		];

	import Server from "@/common/serverutil.js";
	import Vue from 'vue'
	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
	let jweixin = require('jweixin-module')
	export default {
		data() {
			return {
				statusBarHeight,
				current: 0,
				cost: 20,
				actualcost: 15,
				rechargeOptions: [],
				privilegeList: [],
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				userId: "",
				userinfo: {},
				viplevel: 1,
				months: 3,
				operation: "",
				title: 'request-payment',
				appid: "",
				secret: "",
				mchid: "",
				timeStamp: "",
				nonceStr: "",
				prepayid: "",
				paySign: "",
				package: ""
			}
		},
		onLoad(options) {
			let self = this;
			try {
				const restoken = uni.getStorageSync('loginuserinfo');
				if (restoken) {
					self.userId = restoken.user.id;
				}
			} catch (e) {
				// error
			}

			if (options != null && options.level != null) {
				self.viplevel = options.level;
			}
			self.initlevel(self.viplevel);
			let code = this.getCode();
			console.log("获取到的code:" + code)

			if (code != null && code != "") {
				let paymonths = uni.getStorageSync("months");
				let paylevel = uni.getStorageSync("level");
				if (paymonths == null || paymonths == '') {
					paymonths = 24;
				}
				if (paylevel == null || paylevel == '') {
					paylevel = self.viplevel;
				}
				Server.get("/user/wxorder", {
					'code': code,
					"months": paymonths,
					"level": paylevel
				}, {
					success: (response) => {
						self.timeStamp = response.data.data.timeStamp;
						self.nonceStr = response.data.data.nonceStr;
						//self.prepayid=response.data.data.prepay_id;
						self.paySign = response.data.data.paySign;
						self.package = response.data.data.package;
						jweixin.config({
							//debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: self.appid, // 必填，公众号的唯一标识
							timestamp: self.timeStamp, // 必填，生成签名的时间戳
							nonceStr: self.nonceStr, // 必填，生成签名的随机串
							signature: self.paySign, // 必填，签名，见附录1
							jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						jweixin.ready(function() {
							jweixin.checkJsApi({
								jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
								success: function(res) {
									console.log('checkjsapi Success')
									console.log(res);
								},
								fail: function(res) {
									console.log('res')
									console.log(res);
								}
							});
							jweixin.chooseWXPay({
								timestamp: self
									.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								nonceStr: self.nonceStr, // 支付签名随机串，不长于 32 位
								package: self
									.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
								signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: self.paySign, // 支付签名
								success: function(res) {
									self.initlevel(self.viplevel);
									// 支付成功后的回调函数
									self.modelcontent = '支付成功';
									self.modeltitle = "提示";
									self.modelshow = true;

								},
								cancel: function(res) {
									self.modelcontent = '支付取消';
									self.modeltitle = "提示";
									self.modelshow = true;
								},
								fail: function(res) {
									self.modelcontent = '支付失败';
									self.modeltitle = "提示";
									self.modelshow = true;

								}
							});
						});

						jweixin.error(function(res) {
							console.log('error')
							console.log(res)
							self.modelcontent = '支付失败';
							self.modeltitle = "提示";
							self.modelshow = true;
							// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
							/*alert("config信息验证失败");*/
						});
					},
					warnings: (response) => {
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: (response) => {
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					},
				});

			}
		},
		methods: {
			rechargeChange(index) {
				this.current = index;
			},
			goPay() {
				let self = this;
				try {
					uni.setStorageSync('months', self.rechargeOptions[self.current].months);
					uni.setStorageSync('level', self.rechargeOptions[self.current].level);
				} catch (e) {
					// error
				}

				var local = 'https://www.wxmblog.com/cp/#/pagesC/memberCenter/memberCenter'; //你自己的需要跳转到的页面
				var APPID = this.appid;
				window.location.href =
					'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
					APPID +
					'&redirect_uri=' +
					encodeURIComponent(local) +
					'&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
			},
			getCode() {
				var context = '';
				var name = 'code';
				var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
				var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
				if (r != null) context = r[2];
				return context;
			},
			uuid() {
				var s = [];
				var hexDigits = "0123456789abcdef";
				for (var i = 0; i < 36; i++) {
					s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
				}
				s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
				s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
				s[8] = s[13] = s[18] = s[23] = "-";

				var uuid = s.join("");
				return uuid;
			},
			privilegeClick(index) {
				uni.showToast({
					icon: "none",
					title: this.privilegeList[index].desc
				})
			},
			back() {
				uni.navigateBack();
			},
			geturl(url) {
				return Vue.prototype.serveraddress + "/" + url;
			},
			initlevel(level) {
				let self = this;

				Server.get("/user/getUserInfo/" + self.userId, {}, {
					success: (response) => {
						self.userinfo = response.data.data;
					},
					warnings: (response) => {
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: (response) => {
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					},
				});

				Server.get("/user/getPrice/" + level, {}, {
					success: (response) => {
						self.cost = response.data.data.cost;
						self.actualcost = response.data.data.actualCost;
						self.rechargeOptions = [{
								duration: '两年',
								months: 24,
								price: response.data.data.actualcost24,
								des: "原价" + (response.data.data.cost24),
								level: level,
								productId: level == 1 ? '21ke378526425' : '21ke37852642507'
							},
							{
								duration: '一年',
								months: 12,
								price: response.data.data.actualcost12,
								des: "原价" + (response.data.data.cost12),
								level: level,
								productId: level == 1 ? '21ke37852642501' : '21ke37852642506'
							},
							{
								duration: '6个月',
								months: 6,
								price: response.data.data.actualcost6,
								des: "原价" + (response.data.data.cost6),
								level: level,
								productId: level == 1 ? '21ke37852642502' : '21ke37852642505'
							},
							{
								duration: '3个月',
								months: 3,
								price: response.data.data.actualcost3,
								des: "原价" + (response.data.data.cost3),
								level: level,
								productId: level == 1 ? '21ke37852642503' : '21ke37852642504'
							}
						]
					},
					warnings: (response) => {
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: (response) => {
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					},
				});

				//加载特权
				if (level == 1) {
					self.privilegeList = [{
							pic: '/pagesC/static/memercent/xihuan.png',
							text: '无限喜欢次数',
							desc: '每天右滑次数不受限制'
						},
						{
							pic: '/pagesC/static/memercent/tuijian.png',
							text: '优先推荐',
							desc: '系统优先推荐，增加配对成功率'
						},
						{
							pic: '/pagesC/static/memercent/kefu.png',
							text: '专属客服',
							desc: '专属客户，一对一服务'
						}
					]
				} else if (level == 2) {
					self.privilegeList = [{
							pic: '/pagesC/static/memercent/xihuan.png',
							text: '无限喜欢次数',
							desc: '每天右滑次数不受限制'
						},
						{
							pic: '/pagesC/static/memercent/renkou.png',
							text: '查看谁喜欢我',
							desc: '当有人喜欢我时，可以查看谁喜欢了我'
						},
						{
							pic: '/pagesC/static/memercent/yao.png',
							text: '后悔药',
							desc: '当选择了不喜欢对方后,可以反悔重新选择'
						},
						{
							pic: '/pagesC/static/memercent/changjin.png',
							text: '任意场景喜欢',
							desc: '无论在哪里看到的对方，都可以选择喜欢对方'
						},
						{
							pic: '/pagesC/static/memercent/tuijian.png',
							text: '优先推荐',
							desc: '系统优先推荐，增加配对成功率'
						},
						{
							pic: '/pagesC/static/memercent/kefu.png',
							text: '专属客服',
							desc: '专属客户，一对一服务'
						}
					]
				}

			},
			chaneviplevel(level) {
				this.viplevel = level;
				this.initlevel(level);
			},
			confirm() {
				if (this.operation == "initlevel") {
					this.initlevel(1)
				}
				this.operation = "";
			},

			requestOrder() {
				console.log("获取订单信息")
				iapChannel.requestOrder(productIds, (orderList) => { //必须调用此方法才能进行 iap 支付

					console.log('requestOrder success666: ' + JSON.stringify(orderList));

				}, (e) => {
					console.log('requestOrder failed: ' + JSON.stringify(e));

					this.errorMsg()
				});
			},
			requestPayment(e) {
				let self = this;
				console.log("发起ios支付")
				uni.requestPayment({
					provider: 'appleiap',
					orderInfo: {
						productid: this.rechargeOptions[this.current].productId
					},
					success: (e) => {
						Server.post("/user/iosaddVip/", {
							"months": self.rechargeOptions[self.current].months,
							"vipLevel": self.rechargeOptions[self.current].level
						}, {
							success: (response) => {
								self.modelcontent = '订阅成功';
								self.modeltitle = "提示";
								self.modelshow = true;
							},
							warnings: (response) => {
								self.modelcontent = response;
								self.modeltitle = "警告";
								self.modelshow = true;
							},
							error: (response) => {
								self.modelcontent = response;
								self.modeltitle = "错误";
								self.modelshow = true;
							},
						});
					},
					fail: (e) => {

						uni.showModal({
							content: "支付失败,原因为: " + e.errMsg,
							showCancel: false
						})
						console.log("支付失败,原因为: " + e.errMsg)
					},
					complete: () => {
						console.log("payment结束")
					}
				})
			},
			errorMsg() {
				uni.showModal({
					content: "暂不支持苹果 iap 支付",
					showCancel: false
				})
			}
		}
	}
</script>

<style lang="scss">
	.main-title {
		padding: 30rpx 30rpx;
		font-size: 34rpx;
		color: #1C1C1C;
	}

	.tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #A5A3A2;
	}

	.rmb {
		font-size: 26rpx;
		color: #E3BE83;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 400rpx;
		z-index: -2;

		&-img {
			width: 100%;
			height: 100%;
		}
	}

	.hover {
		opacity: 0.7;
	}

	.nav {
		position: fixed;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 750rpx;
		height: 44rpx;
		padding: 0 30rpx;
		background-image: url('~@/pagesC/static/memercent/nav-bg.png');
		background-size: 100%;
		z-index: 99;

		&-back {
			width: 20rpx;
			height: 40rpx;
		}

		&-title {
			color: #FFFFFF;
			font-size: 42rpx;
		}

		&-space {
			width: 70rpx;
			height: 40rpx;
		}
	}

	.info {
		position: relative;
		padding: 0 15rpx;
		width: 730rpx;
		height: 360rpx;

		&-bg {
			position: absolute;
			width: 730rpx;
			height: 360rpx;
			z-index: -1;
		}

		&-content {
			padding: 70rpx 50rpx 0 50rpx;
			margin-bottom: 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		&-avatar {
			margin-right: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			width: 85rpx;
			height: 85rpx;
			background-color: #fff;
			padding: 1rpx;
			border-radius: 50%;

			&-pic {
				width: 83rpx;
				height: 83rpx;
			}
		}

		&-name {
			display: flex;
			flex-direction: column;
			color: #FFFFFF;
			font-size: 35rpx;
		}

		&-level {
			margin-top: 15rpx;
			font-size: 24rpx;
		}

		&-asset {
			padding: 0 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-item {
				display: flex;
				flex-direction: column;
			}
		}
	}

	.iai {
		&-title {
			margin-bottom: 20rpx;
			margin-right: 100rpx;
			font-size: 24rpx;
			color: #CFB386;
		}

		&-value {
			font-size: 35rpx;
			color: #FFFFFF;
		}
	}

	.recharge {
		position: relative;
		margin-bottom: 35rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&-tag {
			position: absolute;
			top: -2rpx;
			left: -2rpx;
			width: 170rpx;
			height: 36rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			background-image: url('~@/pagesC/static/memercent/tag.png');
			background-size: 100%;

			&-text {
				font-size: 20rpx;
				color: #FFFFFF;
				text-align: center;
			}
		}

		&-item {
			position: relative;
			padding: 40rpx 0;
			margin-left: 15rpx;
			width: 200rpx;
			height: 230rpx;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: solid 2rpx #F2F2F3;
			border-radius: 12rpx;

			&-active {
				border-color: #EDD2A9;
				background-color: #FBF1E5;
			}

			&-duration {
				margin-bottom: 30rpx;
				font-size: 26rpx;
				color: #1C1C1C;
			}

			&-price {
				margin-bottom: 20rpx;
				display: flex;
				flex-direction: row;
				align-items: baseline;

				&-text {
					font-size: 48rpx;
					color: #E3BE83;
				}
			}

			&-des {
				font-size: 22rpx;
				color: #A5A3A2;
			}
		}
	}

	.button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 85rpx;
		border-radius: 50rpx;
		background-image: linear-gradient(#EFCF9E, #E4BF85);

		&-text {
			font-size: 30rpx;
			color: #1C1C1C;
		}
	}

	.update {
		margin: 35rpx 30rpx 20rpx 30rpx;
	}

	.privilege {
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;

		&-item {
			margin: 0 23rpx;
			margin-bottom: 25rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-pic {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 20rpx;
			}

			&-text {
				font-size: 24rpx;
				color: #383738;
			}
		}
	}

	.level {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		height: 466rpx;
		background-image: url('~@/pagesC/static/memercent/vip-bg.png');
		background-size: 100%;

		&-rate {
			position: absolute;
			top: 43rpx;
			left: 33rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-text1 {
				margin-right: 20rpx;
				color: #1C1C1C;
				font-size: 34rpx;
			}

			&-text2 {
				font-size: 34rpx;
				color: #C07C07;
			}
		}

		&-info {
			// position: absolute;
			// top: 188rpx;
			// left: 350rpx;
			margin-top: 70rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-icon {
				margin-bottom: 20rpx;
				width: 48rpx;
				height: 38rpx;
			}

			&-text {
				margin-bottom: 20rpx;
				font-size: 26rpx;
				color: #292929;
			}

			&-integral {
				font-size: 40rpx;
				color: #C07C07;
			}
		}

		&-distance {
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			bottom: 35rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			&-text {
				font-size: 26rpx;
				color: #292929;
			}

			&-button {
				padding: 0 30rpx;
				height: 60rpx;
			}
		}
	}

	.nav-title {
		margin: 0 auto;
	}
</style>
