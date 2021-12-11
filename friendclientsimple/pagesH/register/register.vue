<template>
   <view>
	   <u-navbar :is-back="false" title="注册" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"  back-text="返回"  :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
	   <view class="mine-wrap" :style="{ minHeight: mineBoxHeight}">
	   	<view class="login_line">
	   		<input class="login_line_input" type="number" v-model="phone" placeholder="请输入手机号码" />
	   	</view>
	   	<view class="login_line">
	   		<input class="login_line_input" type="number" v-model="code" placeholder="请输入验证码" />
	   		<button class="mini-btn" type="default" size="mini" :disabled="disable" :class="{ codeGeting:isGeting }" @tap="getVerifyCode">{{getCode}}</button>
	   	</view>
	   	<view class="login_btn" @tap="checkCode">下一步</view>
	   <view style="float: left;margin-left: 30upx;" @tap="jumpToUseragress" class="uni-title">
	   	用户协议及隐私条款
	   </view>
		   <view style="float: right;margin-right: 30upx;" @tap="tologin" class="uni-title">
	   		返回登录
	   	</view>
	   </view>
	   <!-- 弹出层 -->
	   <u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
   </view>
</template>

<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'
	import Server from "@/common/serverutil.js";
	export default {
		name: 'Register',
		components: {
		},
		data() {
			return {
				getCode: '获取验证码',
				isGeting: false,
				count: 300,
				disable: false,
				phone: "",
				code: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: ""
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
				return `calc(100vh - 100px + ${this.statusBarHeight}px)`
			}
		},
		methods: {
			jumpToUseragress() {
				uni.navigateTo({
					url: '/pagesH/useragreement/useragreement'
				})
			},
			getVerifyCode() {
				Server.post("/Iqnore/SendSms", {
					phone: this.phone,
					messageType: "REGISTER"
				}, {
					success: response => {
						var countDown = setInterval(() => {
							if (this.count < 1) {
								this.isGeting = false;
								this.disable = false;
								this.getCode = '获取验证码';
								this.count = 300;
								clearInterval(countDown);
							} else {
								this.isGeting = true;
								this.disable = true;
								this.getCode = this.count-- + 's后重发';
							}
						}, 1000);
					},
					warnings: response => {
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
				})

			},
			checkCode() {
				//跳转注册界面
				Server.post("/Iqnore/checkPhoneCode", {
					phone: this.phone,
					code: this.code,
					templateCode: "REGISTER"
				}, {
					success: response => {
						//跳转注册界面
						uni.navigateTo({
							url: '/pagesH/step2/step2?phone=' + this.phone + '&code=' + this.code
						});
					},
					warnings: response => {
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
				})
			},
			onShow() {
				console.log('mine', getApp().globalData)
			},
			toStep2() {
				uni.navigateTo({
					url: '/pagesH/step2/step2'
				})
			},
			tologin() {
				uni.reLaunch({
					url: '/pagesH/login/login'
				})
			}

		}
	}

	// @Component({
	//   components: {
	//     AppContainer
	//   }
	// })
	// export default class extends Vue {
	//   get statusBarHeight() {
	//     const { statusBarHeight } = getApp().globalData as any
	//     return statusBarHeight
	//   }

	//   get mineBoxHeight() {
	//     return `calc(100vh - 100px + ${this.statusBarHeight}px)`
	//   }

	//   onShow() {
	//     console.log('mine', getApp().globalData)
	//   }

	//   toStep2() {
	//     uni.navigateTo({
	//       url: '/pages/step2/step2'
	//     })
	//   }

	// }
</script>
<style>
	.login_img {
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		display: block;
		margin: 0 auto;
		margin-top: 120upx;
		margin-bottom: 40upx;
	}

	.login_line {
		width: 94%;
		margin: 60upx auto;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		align-items: center;
		height: 60upx;
	}

	.login_line_title {
		font-size: 28upx;
		color: #333;
		width: 130upx;
	}

	.login_line_input {
		width: 70%;
		font-size: 26upx;
	}

	.login_line_ver {
		font-size: 26upx;
		color: #333;
		border: 1px solid #333;
		padding: 2upx 5upx;
		border-radius: 6upx;
	}

	.login_btn {
		width: 94%;
		height: 80upx;
		text-align: center;
		background: #fe7e97;
		color: #ffffff;
		margin: 100upx auto;
		border-radius: 10upx;
		line-height: 80upx;
	}
</style>
