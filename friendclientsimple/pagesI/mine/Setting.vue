<template>
	<view>
		<u-navbar :is-back="true" title="设置" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="mine-wrap" :style="{ minHeight: mineBoxHeight}">
			<view class="action-box">
				<view class="action-item" @click="jumpToPersonal">
					<text class="action-text">编辑个人资料</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>
				<view class="action-item" @click="jumpToTimeLine">
					<text class="action-text">我的动态</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>

			</view>


			<view class="action-box boxMargin">
				<view class="action-item" @click="jumpToView('/pagesK/ShowSet/ShowSet')">
					<text class="action-text">向我显示设置</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>
				<view class="action-item" @click="jumpToView('/pagesK/PrivacySet/PrivacySet')">
					<text class="action-text">隐私设置</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>
			</view>
			<view class="action-box boxMargin">
				<view @click="jumpToUseragress" class="action-item">
					<text class="action-text">用户协议及隐私条款</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>
				<view @click="gotouser" class="action-item">
					<text class="action-text">客服中心</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>
			</view>
			<view class="action-box boxMargin">
				<view class="action-item" @click="jumpToaddvip">
					<text class="action-text">会员中心</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>

			</view>
			<!-- <view class="action-box boxMargin">

				<view class="action-item">
					<text class="action-text">帐号与安全</text>
					<image class="action-icon" src="/static/arrow-right.png"></image>
				</view>
			</view> -->

			<!-- <view class="action-tip boxMargin">
				<text>隐身模式开启后，你将不会推荐给别人</text>
			</view> -->
			<view @click="logout()" class="action-box action-logout boxMargin">
				<text>退出登录</text>
			</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" :show-cancel-button="showcancelbutton"
		 @confirm="confirm()" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
	</view>

</template>

<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'

	import Server from "@/common/serverutil.js";
	export default {
		name: 'Setting',
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
		data() {
			return {
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				showcancelbutton: false
			}
		},
		methods: {
			onShow() {
				console.log('mine', getApp().globalData)
			},
			jumpToPersonal() {
				uni.navigateTo({
					url: '/pagesJ/personal/index'
				})
			},
			jumpToActivity() {
				uni.navigateTo({
					url: '/pages/activity/index'
				})
			},
			jumpToTimeLine() {
				uni.navigateTo({
					url: '/pagesI/mine/timeLine'
				})
			},
			jumpToUseragress() {
				uni.navigateTo({
					url: '/pagesH/useragreement/useragreement'
				})
			},
			jumpToView(urla) {
				uni.navigateTo({
					url: urla
				})
			},
			jumpToaddvip() {
				uni.navigateTo({
					url: '/pagesC/memberCenter/memberCenter?level=1'
				});
			},
			gotouser()
			{
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=1'
				})
			},
			logout() {
				this.modeltitle = "提示";
				this.modelcontent = "你确定要退出登陆吗？";
				this.showcancelbutton = true;
				this.modelshow = true;
			},
			confirm() {
				let self = this;
				Server.delete("/user/logout", {}, {
					success: response => {
						//保存登录信息
						try {
							uni.setStorageSync('loginuserinfo', {});
							//跳转登录页
							uni.reLaunch({
								url: '/pagesH/login/login'
							})
						} catch (e) {
							// error

							self.modeltitle = "提示";
							self.modelcontent = "网络错误";
							self.modelshow = true;
						}

					},
					warnings: response => {
						this.showcancelbutton = false
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.showcancelbutton = false
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
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

	//   jumpToPersonal() {
	//     uni.navigateTo({
	//       url: '/pages/personal/index'
	//     })
	//   }

	//   jumpToActivity() {
	//     uni.navigateTo({
	//       url: '/pages/activity/index'
	//     })
	//   }
	// }
</script>

<style lang="less" scoped>
	@import 'index.less';
</style>
