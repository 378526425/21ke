<template>
	<view>
		<u-navbar :is-back="true" title="我的动态" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>

		<view class="line-box">

			<template v-if="cardList.length > 0">
				<y-Refresh ref="mixPulldownRefresh" :top="100" @refresh="onPulldownReresh">
					<view class="cu-timeline" v-for="(item,index) in cardList" :key="index">
						<!-- <view class="cu-time">{{item.publishTime}}</view> -->
						<view class="cu-item text-cyan">
							<u-collapse style="float: right">
								<u-collapse-item>
									<text @tap="deleteblog(item.id)">删除</text>
								</u-collapse-item>
							</u-collapse>
							<view class="content">
								<view class="cu-capsule radius" @tap="toDetails(item.id)">
									<view class="cu-tag bg-cyan">{{item.publishTime}}</view>
								</view>

								<view class="margin-top line-text" @tap="toDetails(item.id)">{{item.textContent}}</view>
								<scroll-view scroll-x class="img-info nav margin-top" v-if="item.imgList.length > 0" scroll-with-animation>
									<view class="img-box flex-center" v-for="(child,idx) in item.imgList" :key="idx">
										<image :src="geturl(child.url)" mode="aspectFill" class="img" @tap="ViewImage(item.imgList,idx)"></image>
									</view>
								</scroll-view>
								<view class="address_label">
									<template v-if="item.address!=null&&item.address!=''">
										<u-icon name="map"></u-icon>{{item.address.replace("市","")}}
									</template>
									<!-- <text style="float: right;" @tap="deleteblog(item.id)">删除</text> -->
								</view>
							</view>

						</view>
					</view>
					<y-LoadMore style="margin-top: 50rpx;" :status="loadMoreStatus" />
				</y-Refresh>

			</template>
			<template v-else-if="empty==true">
				<y-Empty emptyText="你还没有发表任何动态额" />
			</template>

		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"
		 :show-cancel-button="iscancel" @confirm="confirm()"></u-modal>
	</view>
</template>

<script>
	var that;
	import Vue from 'vue'
	import Server from "@/common/serverutil.js";
	export default {
		data() {
			return {
				startNum: 0,
				cardList: [],
				loadMoreStatus: 1, //0加载前，1加载中，2没有更多了
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				pageSize: 10,
				iscancel: false,
				operator: "",
				deleteblogid: "",
				empty: false
			};
		},
		onLoad() {
			that = this
			that.initdata();
		},
		onReachBottom() {
			that.startNum++;
			//上滑加载
			that.initdata();
		},
		methods: {
			// 预览图片
			ViewImage(list, index) {
				let that = this
				let arr = []
				for (let i = 0; i < list.length; i++) {
					arr.push(that.geturl(list[i].url))
				}
				uni.previewImage({
					current: index,
					urls: arr
				})
			},
			initdata() {
				let list = that.cardList;
				//左边
				if (list.length > 0) {
					//增加 加载左边的列表
					Server.get("/blog/getBlogList", {
						pageIndex: that.startNum + 1,
						pageSize: that.pageSize,
						condition: "{'mySelf':'true'}"
					}, {
						success: response => {
							if (response.data.data.rows.length > 0) {
								//封装数据
								that.cardList = that.cardList.concat(response.data.data.rows);
							}
							if (response.data.data.rows.length < that.pageSize) {
								// 2 判断没有更多了
								that.loadMoreStatus = 2;
							}
							if (response.data.data.total == 0) {
								this.empty = true;
							} else {
								this.empty = false;
							}
						},
						warnings: response => {
							that.modelcontent = response;
							that.modeltitle = "警告";
							that.iscancel = false;
							that.modelshow = true;
						},
						error: response => {
							that.modelcontent = response;
							that.modeltitle = "错误";
							that.iscancel = false;
							that.modelshow = true;
						}
					})

				} else {

					//第一次加载 左边
					Server.get("/blog/getBlogList", {
						pageIndex: that.startNum + 1,
						pageSize: that.pageSize,
						condition: "{'mySelf':'true'}"
					}, {
						success: response => {
							if (response.data.data.rows.length > 0) {
								//封装数据
								that.cardList = response.data.data.rows;
							}
							if (response.data.data.rows.length < that.pageSize) {
								// 2 判断没有更多了
								that.loadMoreStatus = 2;
							}
							if (response.data.data.total == 0) {
								this.empty = true;
							} else {
								this.empty = false;
							}
						},
						warnings: response => {
							that.modelcontent = response;
							that.modeltitle = "警告";
							that.iscancel = false;
							that.modelshow = true;
						},
						error: response => {
							that.modelcontent = response;
							that.modeltitle = "错误";
							that.iscancel = false;
							that.modelshow = true;
						}
					})

				}
			},
			geturl(url) {
				return Vue.prototype.serveraddress+"/" + url;
			},
			onPulldownReresh() {
				that.startNum = 0;
				that.cardList = [];
				//下拉刷新加载
				that.initdata();
				that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
			},
			deleteblog(id) {
				that.modelcontent = "你确定要删除这条动态吗？";
				that.modeltitle = "警告";
				that.iscancel = true;
				that.modelshow = true;
				that.operator = "deleteblog";
				that.deleteblogid = id;
			},
			confirm() {
				if (that.operator == "deleteblog") {
					//删除动态
					Server.delete("/blog/deleteBlog/" + that.deleteblogid, {}, {
						success: response => {
							that.startNum = 0;
							that.cardList = [];
							//下拉刷新加载
							that.initdata();
						},
						warnings: response => {
							that.modelcontent = response;
							that.modeltitle = "警告";
							that.iscancel = false;
							that.modelshow = true;
						},
						error: response => {
							that.modelcontent = response;
							that.modeltitle = "错误";
							that.iscancel = false;
							that.modelshow = true;
						}
					})
				}
			},
			toDetails(id) {
				uni.navigateTo({
					url: '../../pagesD/diary/details?id=' + id
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.line-box {
		min-height: 100vh;

		.cu-timeline {

			.content {
				background-color: #f5f8f9;
			}

			.cu-time {
				color: var(--mainColor);
			}

			.line-text {
				color: var(--mainColor);
				min-height: 1rpx;
			}

			.img-info {
				.img-box {
					width: 144rpx;
					height: 144rpx;
					overflow: hidden;
					display: inline-block;
					margin-right: 20rpx;
					border-radius: 16rpx;

					.img {
						height: 100%;
					}
				}
			}
		}
	}

	.address_label {
		color: #666666;
		font-size: 25rpx;
		margin-top: 10rpx;
	}
</style>
