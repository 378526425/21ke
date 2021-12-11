<template>
	<view>
		<u-navbar :is-back="true" title="隐私设置" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="mine-wrap" :style="{ minHeight: mineBoxHeight }">
			<view class="login_line">
				<view class="login_line_title">动态仅好友可见：</view>
				<u-switch v-model="checked" active-color="#fe7e97" inactive-color="#eee"></u-switch>
			</view>
			<view class="login_btn" @tap="login">保存</view>
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
		name: 'Login',
		components: {

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
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				checked: false,
				perferenceset: {
					gender: null,
					stage: null,
					maxAge: null,
					minAge: null
				}
			}
		},
		methods: {
			onShow() {
				let self = this;
				Server.get("/user/getPreferenceSet", {}, {
					success: response => {
						console.log(response)
						if (response.data.data.gender != null && response.data.data.gender != undefined && response.data.data.gender !=
							'') {
							self.perferenceset.gender = response.data.data.gender;
						}
						if (response.data.data.stage != null && response.data.data.stage != undefined && response.data.data.stage !=
							'') {
							self.perferenceset.stage = response.data.data.stage;
						}
						if (response.data.data.maxAge != null && response.data.data.maxAge != undefined && response.data.data.maxAge !=
							'' && response.data.data.minAge != null && response.data.data.minAge != undefined && response.data.data.minAge !=
							'') {
							self.perferenceset.minAge = response.data.data.minAge;
							self.perferenceset.maxAge = response.data.data.maxAge;
						}
						if (response.data.data.seeRange != null && response.data.data.seeRange != undefined) {
							self.checked = !response.data.data.seeRange;
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
			login() {
				let self = this;
				Server.post("/user/addPreferenceSet", {
					gender: self.perferenceset.gender,
					maxAge: self.perferenceset.maxAge,
					minAge: self.perferenceset.minAge,
					stage: self.perferenceset.stage,
					seeRange: !self.checked
				}, {
					success: response => {
						this.modelcontent = "保存成功";
						this.modeltitle = "提示";
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
		width: auto;
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
</style>
