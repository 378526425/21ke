<template>
	<view>
		<u-navbar :is-back="true" title="个人信息" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="page" :style="{ height: mineBoxHeight }">
			<!-- <view class="wrap">
	    			<view class="u-avatar-wrap">
	    				<image class="u-avatar-demo" :src="headPortrait" mode="aspectFill"></image>
	    			</view>
	    			<u-button @tap="chooseAvatar">进入裁剪页</u-button>
	    		</view> -->
			<view class="header">
				<image class="bg" style="width: 100%;" :src="geturl(headPortrait)" mode="aspectFill" />
				<view class="content">
					<view class="avatar-wrapper" @click="chooseAvatar" style="position: relative;">
						<image style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;border-radius: 100%;" :src="geturl(headPortrait)"
						 alt="" />
					</view>
				</view>
			</view>
			<view class="body">
				<view class="cell">
					<view class="left">
						<text class="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</text>
						<picker class="picker" @change="bindSexChange" :value="sex" :range="sexList" range-key="name">
							<view class="uni-input">{{ sexList[sex].name }}</view>
						</picker>
					</view>
				</view>

				<view class="cell">
					<view class="left">
						<text class="label">昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</text>
						<u-input placeholder="请输入昵称" v-model="nickName" />

					</view>
				</view>
				<view class="cell">
					<view class="left">
						<text class="label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</text>
						<picker mode="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{birthday}}</view>
						</picker>
					</view>
				</view>
				<view class="cell">
					<view class="left">
						<text class="label">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态</text>
						<picker class="picker" @change="bindstate" :value="state" :range="stateList" range-key="name">
							<view class="uni-input">{{ stateList[state].name }}</view>
						</picker>
					</view>
				</view>
				<view class="cell">
					<view class="left">
						<text class="label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</text>
						<u-input type="password" placeholder="请输入密码" v-model="password" />
					</view>
				</view>
				<view class="cell">
					<view class="left">
						<text class="label">确认密码</text>
						<u-input type="password" placeholder="请再次确认密码" v-model="truePassWord" />
					</view>
				</view>
				
				<text class="submit-btn" @tap="register">完成</text>
				<view style="margin-top: 20upx;">注意：性别和生日注册后不可修改</view>
				
			</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"
		 @confirm="confirm()"></u-modal>
	</view>
</template>

<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'
	import Server from "@/common/serverutil.js";

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}
	export default {
		name: 'Step2',
		components: {},
		onLoad(e) {
			this.loginNum = e.phone;
			this.code = e.code;
		},
		data() {
			return {
				sex: 0,
				state: 0,
				sexList: [{
					name: '男',
					value: '2'
				}, {
					name: '女',
					value: '3'
				}],
				stateList: [{
					name: '学生党',
					value: '5'
				}, {
					name: '工作党',
					value: '6'
				}, {
					name: '保密',
					value: '7'
				}],
				nickName: "",
				code: "",
				loginNum: "",
				password: "",
				genderId: 2,
				stageId: 5,
				truePassWord: "",
				birthday: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),
				headPortrait: Vue.prototype.defaultheadportrait,
				uploadcount: 0,
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				actiontype: ""
			}
		},
		created() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				let self = this;
				if (self.uploadcount == 0) {
					
					uni.uploadFile({
						url: Vue.prototype.serveraddress + '/fileutil/tempFile', //仅为示例，非真实的接口地址
						filePath: path,
						name: 'file',
						success: (uploadFileRes) => {
							var data = JSON.parse(uploadFileRes.data)
							if (data.code == 200) {
								console.log(data.msg)
								self.headPortrait = data.msg;
								self.uploadcount = 1;
							}else
							{
								//接口调用完成执行 关闭loading
								uni.hideLoading();
								self.modelcontent = data.msg;
								self.modeltitle = "警告";
								self.modelshow = true;
							}
						},
						fail: (uploadFileRes) => {
							console.log(uploadFileRes);
						}

					});
				}



			})
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
		methods: {
			geturl(url) {
				return Vue.prototype.serveraddress + "/" + url;
			},
			bindSexChange({
				detail: {
					value
				}
			}) {
				this.sex = value;
				this.genderId = this.sexList[value].value;
				if (this.genderId == 2) {
					if (this.uploadcount == 0) {
						this.headPortrait = Vue.prototype.defaultheadportrait;
					}

				} else {
					if (this.uploadcount == 0) {
						this.headPortrait = Vue.prototype.defaulwomantheadportrait

					}
				}

			},
			bindstate({
				detail: {
					value
				}
			}) {
				this.state = value
				this.stageId = this.stateList[value].value
			},
			chooseImage() {
				uni.chooseImage()
			},
			goToSetting() {
				uni.navigateTo({
					url: '/pagesI/mine/Setting'
				})
			},
			bindDateChange: function(e) {
				this.birthday = e.detail.value
			},
			register() {
				let self = this;
				Server.post("/user/register", {
					"nickName": this.nickName,
					"birthday": this.birthday,
					"loginNum": this.loginNum,
					"genderId": this.genderId,
					"stageId": this.stageId,
					"password": this.password,
					"truePassWord": this.truePassWord,
					"headPortrait": this.headPortrait,
					"code": this.code
				}, {
					success: response => {
						//注册成功 跳转登录页面
						this.actiontype = "tologin"
						this.modelcontent = "快去打开新世界吧！";
						this.modeltitle = "注册成功";
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
			chooseAvatar() {
				this.uploadcount = 0;
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			confirm() {
				if (this.actiontype == "tologin") {
					let self = this;
					this.actiontype = "";
					//自动登录
					Server.post("/user/login", {
						loginNum: self.loginNum,
						password: self.password
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
	//   sex: any = 0
	//   sexList: string[] = ['男', '女']

	//   school: number = 0
	//   schoolList: string[] = ['湖南大学', '长沙理工']
	//   get statusBarHeight() {
	//     const { statusBarHeight } = getApp().globalData as any
	//     return statusBarHeight
	//   }

	//   get mineBoxHeight() {
	//     return `calc(100vh - 100upx + ${this.statusBarHeight}px)`
	//   }

	//   bindSexChange({ detail: { value } }: any) {
	//     this.sex = value
	//   }

	//   bindSchoolChange({ detail: { value } }: any) {
	//     this.school = value
	//   }

	//   chooseImage() {
	//     uni.chooseImage()
	//   }

	//   goToSetting() {
	//     uni.navigateTo({ url: '/pages/mine/Setting' })
	//   }
	// }
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
			height: 500upx;

			.bg {
				// content: '';
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				-webkit-filter: blur(60upx);
				-moz-filter: blur(60upx);
				-o-filter: blur(60upx);
				-ms-filter: blur(60upx);
				filter: blur(60upx);
				height: 500upx;
			}

			.content {
				position: relative;
				z-index: 99;
				height: 500upx;

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
					transform: translate(-50%, 50%);
					box-sizing: border-box;
					// border: 30upx solid rgba(245, 245, 245, 0.6);
					width: 200upx;
					height: 200upx;
					border-radius: 50%;
					// display: flex;
					// align-items: center;
					// justify-content: center;

					&::after {
						content: '';
						display: inline-block;
						background-image: url('@/static/edit_avatar.png');
						background-size: 100% 100%;
						height: 50upx;
						width: 50upx;
						position: absolute;
						bottom: 10upx;
						right: 0upx;
					}

					.img {
						height: 100%;
						width: 100%;
						border-radius: 50%;
						// border: 1upx solid #ffffff;
						position: relative;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}
		}

		.body {
			background-color: #ffffff;
			position: relative;
			z-index: 99;
			margin-top: 500upx;
			border-top-left-radius: 50upx;
			border-top-right-radius: 50upx;
			padding: 40upx;
			min-height: calc(100vh - 500upx);

			.cell {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30upx;
				padding: 20upx 0;

				>.left {
					display: flex;
					align-items: center;
					flex: 1;

					.picker {
						// width: 30%;
						flex: 1;
					}

					.label {
						margin-right: 40upx;
					}

					.value {
						font-size: 25upx;
						color: #999999;

						.input {
							font-size: 30upx;
						}
					}
				}

				.arrow-right {
					width: 40upx;
					height: 40upx;
				}
			}
		}

		.submit-btn {
			display: block;
			text-align: center;
			background-color: rgb(254, 126, 151);
			color: #ffffff;
			padding: 20upx 0;
			margin-top: 40upx;
			border-radius: 20upx;
		}
	}

	.wrap {
		padding: 40rpx;
	}

	.u-avatar-wrap {
		margin-top: 80rpx;
		overflow: hidden;
		margin-bottom: 80rpx;
		text-align: center;
	}

	.u-avatar-demo {
		width: 150rpx;
		height: 150rpx;
		border-radius: 100rpx;
	}
</style>
