<template>
	<view>
		<u-navbar :is-back="true" title="重置密码" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"  back-text="返回"  :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
	    <view class="mine-wrap" :style="{ minHeight: mineBoxHeight}">
	    	<view class="login_line">
	    		<view class="login_line_title">手机号</view>
	    		<input class="login_line_input" type="number" disabled="true" v-model="loginNum" name="" id="" placeholder="请输入手机号码" />
	    	</view>
	    	<view class="login_line">
	    		<view class="login_line_title">密码</view>
	    		<input class="login_line_input" type="password" v-model="password" name="" id="" placeholder="请输入密码" />
	    	</view>
	    	<view class="login_line">
	    		<view class="login_line_title">确认密码</view>
	    		<input class="login_line_input" type="password" v-model="truePassword" name="" id="" placeholder="请再次输入密码" />
	    	</view>
	    	<view class="login_btn" @tap="updatepwd">确定</view>
	    </view>
	    <!-- 弹出层 -->
	    <u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"  @confirm="confirm()"></u-modal>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	export default {
		components: {
		},
		onLoad(e) {
			this.loginNum = e.phone;
			this.code = e.code;
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
		data() {
			return {
				code: "",
				loginNum: "",
				password: "",
				truePassword: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				actiontype:""
			}
		},
		methods: {
			updatepwd() {
				Server.post("/Iqnore/resetPassword", {
					loginNum: this.loginNum,
					code: this.code,
					password: this.password,
					truePassword: this.truePassword
				}, {
					success: response => {
						this.actiontype="tologin"
						this.modelcontent = "已重置密码，可以使用新密码进行登陆了！";
						this.modeltitle = "重置成功";
						this.modelshow = true;
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
			confirm()
			{
				if(this.actiontype=="tologin")
				{
					this.actiontype="";
					uni.reLaunch({
						url: '/pagesH/login/login'
					})
				}
			}
		}
	}
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
