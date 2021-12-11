<template>
	<view>
		<u-navbar :is-back="false" title="登录" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="mine-wrap" :style="{ minHeight: mineBoxHeight }">
			<!-- <image class="login_img" src="https://img2.woyaogexing.com/2020/06/20/c956bf6d164c40c28a7a288dd010da26!400x400.jpeg"
			 mode=""></image> -->
			<view class="login_line">
				<view class="login_line_title">手机号</view>
				<input class="login_line_input" type="number" v-model="loginNum" name="" id="" placeholder="请输入手机号码" />
			</view>
			<view class="login_line">
				<view class="login_line_title">密码</view>
				<input class="login_line_input" type="password" v-model="password" name="" id="" placeholder="请输入密码" />
			</view>
			<view class="login_btn" @tap="login">登录</view>
			<view style="float: left;margin-left: 30upx;" @tap="jumpToResetpwd" class="uni-title">
				忘记密码？
			</view>
			<view style="float: left;margin-left: 10upx;" @tap="jumpToindex" class="uni-title">
				游客访问
			</view>
			<view style="float: right;margin-right: 30upx;" @tap="toregister" class="uni-title">
				新用户注册
			</view>

		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>


		<u-popup mode="center" :mask-close-able="false" v-model="showpopup">
			<view class="useragement">
				<view class="title">服务协议和隐私政策</view>

				<view class="content">
					尊敬的用户，欢迎您注册成为用户，在注册前请您仔细阅读<text @click="gotouseragement()" style="color:#fe7e97;">《用户协议及隐私政策》</text>，了解我们对您使用我们APP制定的规则，您个人信息的处理以及申请权限的目的和使用范围。
					　　经您确认后，本用户协议和隐私权政策即在您和cp圈之间产生法律效力。请您务必在注册之前认真阅读全部服务协议内容，如有任何疑问，可向cp圈客服咨询。
				</view>
				<view class="agebtn">
					<view class="disagement_btn" @click="disagement()">不同意</view>
					<view class="agement_btn" @click="agement()">同意</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'

	import Server from "@/common/serverutil.js";
	export default {
		name: 'Login',
		components: {},
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
		onLoad() {
			try {
				const useragreement = uni.getStorageSync('useragreement');
				if (useragreement) {

				} else {
					//还没有点击过同意 需要弹出用户协议
					this.showpopup = true;
				}
			} catch (e) {
				// error
			}
		},
		data() {
			return {
				loginNum: "",
				password: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				showpopup: false
			}
		},
		methods: {
			onShow() {
				console.log('mine', getApp().globalData)
			},
			jumpToindex() {
				//跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			login() {
				let self = this;
				Server.post("/user/login", {
					loginNum: this.loginNum,
					password: this.password
				}, {
					success: response => {
						//保存登录信息
						try {
							uni.setStorageSync('loginuserinfo', response.data.data);
							//跳转到首页
							uni.switchTab({
								url: '/pages/index/index'
							});
						} catch (e) {
							// error
							self.modelcontent = "网络错误";
							self.modeltitle = "警告";
							self.modelshow = true;
						}
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
			toregister() {
				uni.navigateTo({
					url: '/pagesH/register/register'
				});
			},
			jumpToResetpwd() {
				uni.navigateTo({
					url: '/pagesH/resetpwd/resetpwd'
				})
			},
			gotouseragement() {
				uni.navigateTo({
					url: '/pagesH/useragreement/useragreement'
				})
			},
			agement() {
				this.showpopup = false;
				try {
					uni.setStorageSync('useragreement', true);

				} catch (e) {
					// error

				}
			},
			disagement() {
				this.modelcontent = "如果要使用本应用，请同意相关《用户协议及隐私政策》";
				this.modeltitle = "提示";
				this.showpopup = false;
				this.modelshow = true;
				try {
					uni.setStorageSync('useragreement', false);

				} catch (e) {
					// error

				}
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

	//   jumpToRegister() {
	//     uni.request({
	//         url: Vue.prototype.websiteUrl+"/user/login", //仅为示例，并非真实接口地址。
	//         data: {
	//             loginNum: '15261133553',
	// 			password:'123456'
	//         },
	// 		header:{
	// 			"Content-Type":"application/json"
	// 		},
	// 		method:"POST",
	//         success: (res) => {
	// 			debugger
	//             console.log(res.data);
	//         }
	//     });
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
		width: 50%;
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

	.useragement {
		padding: 50rpx;
		border-radius: 10upx;
	}

	.title {
		text-align: center;
		font-size: 35rpx;
	}

	.content {
		margin-top: 20rpx;


	}

	.agebtn {
		padding-bottom: 50rpx;
		padding-top: 50rpx;
		width: 70%;
		margin: 0 auto;
	}

	.agement_btn {
		width: 30%;
		height: 80upx;
		text-align: center;
		background: #fe7e97;
		color: #ffffff;
		float: right;
		border-radius: 10upx;
		line-height: 80upx;
	}

	.disagement_btn {
		width: 30%;
		height: 80upx;
		text-align: center;
		background: #b9b9b9;
		color: #ffffff;
		float: left;
		border-radius: 10upx;
		line-height: 80upx;
	}
</style>
