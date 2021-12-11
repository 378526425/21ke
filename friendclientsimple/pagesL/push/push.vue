<template>
	<view>
		<u-navbar :is-back="true" title="发布" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="publish-wrap bg-white">
			<view class="input-box padding-sm">
				<textarea class="area-top" placeholder="碎碎念..." v-model="content"></textarea>
			</view>
			<view class="cu-form-group img-box">
				<view class="next-title">上传图片（最多9张）</view>
				<view class="img-wrap margin-none">
					<view class="grid col-4 grid-square flex-sub padding-top-lg">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index">
							<image :src="imgList[index]" mode="aspectFill" @tap="ViewImage(index)" class="img-item"></image>
							<image src="@/static/img/publish/img_close.png" @tap.stop="DelImg" :data-index="index" mode="widthFix" class="close-img"></image>
						</view>
						<view class="add-img" @tap="ChooseImage" v-if="imgList.length<9">
							<text class='cuIcon-add link-color'></text>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom-btn flex-center">
				<view class="row_btn" @click="pushcontent">发布</view>
			</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"
			 @confirm="confirm()"></u-modal>
		</view>
	</view>

</template>

<script>
	import Server from "@/common/serverutil.js";
	import amap from '@/common/amap-wx.130.js';
	import Vue from 'vue';
	export default {
		data() {
			return {
				imgList: [],
				imguploadList: [],
				content: '',
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				actiontype: "",
				address: "",
				amapPlugin: null,
				key: '87b470386b2e45e0d16bb3599a7b6831'
			};
		},
		onLoad() {
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});
		},
		methods: {
			// 选择图片
			ChooseImage() {
				let that = this
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					//sourceType: ['album'], //从相册选择
					success: (res) => {
						if (that.imgList.length != 0) {
							that.imgList = that.imgList.concat(res.tempFilePaths)
						} else {
							that.imgList = res.tempFilePaths
						}
					}
				});
			},
			//显示删除弹窗
			DelImg(e) {
				let that = this
				that.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			// 预览图片
			ViewImage(index) {
				let that = this
				uni.previewImage({
					current: index,
					urls: that.imgList
				})
			},
			pushcontent() {
				uni.showLoading({
					title: '玩命加载中..',
					mask: true
				});
				let self = this;
				console.log("获取定位")
				self.amapPlugin.getRegeo({
					success: (data) => {
						//修改用户位置
						if (data[0].regeocodeData.addressComponent.city.length == 0) {
							self.address = data[0].regeocodeData.addressComponent.province;
						} else {
							self.address = data[0].regeocodeData.addressComponent.city;
						}
						console.log("动态位置：" + self.address)
						self.imgpush();
					},
					fail: (err) => {
						console.log('获取位置失败：' + err)
						self.imgpush();
					}
				});
			},
			confirm() {

			},
			postcontent() {
				let self = this;
				//发布动态
				Server.post("/blog/addblog", {
					"address": self.address,
					"labelList": [],
					"fileList": self.imguploadList,
					"textContent": self.content
				}, {
					success: response => {
						try {
							uni.setStorageSync('pushblogback', true);

							//接口调用完成执行 关闭loading
							uni.hideLoading();

							//跳转到动态页
							uni.switchTab({
								url: '/pages/compass/index'
							});
						} catch (e) {
							// error
							//接口调用完成执行 关闭loading
							uni.hideLoading();
							self.modelcontent = "网络错误";
							self.modeltitle = "警告";
							self.modelshow = true;
						}
					},
					warnings: response => {
						//接口调用完成执行 关闭loading
						uni.hideLoading();
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: response => {
						//接口调用完成执行 关闭loading
						uni.hideLoading();
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					}
				}, false)
			},
			imgpush() {
				let self = this;
				self.imguploadList = [];
				if (self.imgList.length > 9) {
					//接口调用完成执行 关闭loading
					uni.hideLoading();
					self.modelcontent = "最多选择9张图片";
					self.modeltitle = "警告";
					self.modelshow = true;
				} else if (self.imgList.length > 0) {
					//内容包含图片
					for (var i = 0; i < self.imgList.length; i++) {
						uni.uploadFile({
							url: Vue.prototype.serveraddress + '/fileutil/tempFile', //仅为示例，非真实的接口地址
							filePath: self.imgList[i],
							name: 'file',
							success: (uploadFileRes) => {
								var data = JSON.parse(uploadFileRes.data)
								if (data.code == 200) {
									console.log(data.msg)
									self.imguploadList.push(data.msg)
								}else{
									//接口调用完成执行 关闭loading
									uni.hideLoading();
									self.modelcontent = data.msg;
									self.modeltitle = "警告";
									self.modelshow = true;
								}
							},
							fail: (uploadFileRes) => {
								console.log(uploadFileRes);
							},
							complete: (uploadFileRes) => {
								//当最后一个图片上传完成 则发布内容
								if (self.imguploadList.length == self.imgList.length) {
									self.postcontent();
								}

							}
						});
					}
				} else {
					//内容没有图片
					self.postcontent();
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.publish-wrap {
		.input-box {
			.area-top {
				width: 100%;
				box-shadow: inset 0 -1px 0 0 #ECECEC;
				min-height: 280rpx;
			}
		}

		.img-box {
			padding: 30rpx;
			display: flex;
			flex-direction: column;
			margin-top: 20rpx;
			margin-bottom: 160rpx;

			.next-title {
				width: 100%;
				font-size: 36rpx;
				color: var(--mainColor);
			}

			.font-red {
				color: #ff0000;
			}

			.img-wrap {
				width: 100%;
				font-size: 28rpx;
				line-height: 44rpx;
				color: #999999;
				margin: 20rpx 0;
			}

			.add-img {
				border: 4rpx dashed #999;
				font-size: 40rpx;
			}
		}

		.bottom-btn {
			position: fixed;
			bottom: 0;
			width: 100%;
			padding: 20rpx 0;

			.btn {
				border-radius: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #FFFFFF;
				border: 1rpx solid var(--activeColor);
				background-color: var(--activeColor);
				box-shadow: 0 1px 10px 0px var(--activeColor);
				width: 400rpx;
				height: 80rpx;
			}
		}
	}

	.bg-img {
		overflow: visible !important;

		.img-item {
			border-radius: 20rpx;
		}

		.close-img {
			position: absolute;
			width: 36rpx !important;
			top: -18rpx;
			right: -18rpx;
		}
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
</style>
