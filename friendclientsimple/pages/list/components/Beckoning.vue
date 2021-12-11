<template>
	<view>
		<view class="tab">
			<view :class="['tab-item', { active: currentTab === 0 }]" @click="tabClickHandler(0)">
				<text>相互心动</text>
			</view>
			<view :class="['tab-item', { active: currentTab === 1 }]" @click="tabClickHandler(1)">
				<text>我心动的</text>
			</view>
			<view :class="['tab-item', { active: currentTab === 2 }]" @click="tabClickHandler(2)">
				<text>心动我的</text>
			</view>
		</view>
		<view class="list">
			<template v-if="beckoningList && beckoningList.length > 0">
				<view class="list-item" @click="clickHandler(item.id)" v-for="(item, index) in beckoningList" :key="index">
					<image class="img" :src="geturl(item.firstSelfiePath)" mode="aspectFill" />
					<view class="star-count">
						<image class="heart-icon" :src="require('@/static/icon/locationicon.png')" />
						<text>{{item.distanceStr}}</text>
					</view>
					<view v-if="item.genderId==2" class="sex-group" style="background-color: #0FBCF9;">
						<image class="sex" :src="require('@/static/icon/male.png')" />
					</view>
					<view v-else class="sex-group" style="background-color: #fe7e97;">
						<image class="sex" :src="require('@/static/icon/female.png')" />
					</view>
					<text class="text">上次活跃 {{item.latelyTimeStr}}</text>
				</view>

			</template>
			<template v-else-if="empty==true">
				<y-Empty style="margin: 0 auto;" :emptyText="emptyText" />
			</template>

		</view>
		<y-LoadMore v-if="beckoningList && beckoningList.length > 0" :status="loadMoreStatus" />
		<!-- <u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{ color: '#fe7e97' }"
		 @confirm="confirm"></u-modal> -->

		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :show-cancel-button="showcancelbutton"
		 :confirm-style="{color: '#fe7e97'}" :confirm-text="confirmtext" :cancel-text="canceltext" @confirm="confirm()"
		 @cancel="cancel()"></u-modal>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	import Vuee from 'vue';
	export default {
		name: "Beckoning",
		props: {
			selfByAttitudeList: {
				type: Array,
				default: [],
			}
		},
		data() {
			return {
				empty: true,
				currentTab: 0,
				beckoningList: this.selfByAttitudeList,
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				emptyText: "还没有配对的好友",
				isHasMoreData: true, // 是否有更多数据
				// 我心动的
				attitudePageIndex: 0,
				attitudePageSize: 9,
				// 心动我的
				likeMePageIndex: 0,
				likeMepageSize: 9,
				// 心动我的
				frendsPageIndex: 0,
				frendspageSize: 9,
				operatioin: "",
				loadMoreStatus: 0, //0加载前，1加载中，2没有更多了
				showcancelbutton: false,
				confirmtext: "确定",
				canceltext: "取消"
			};
		},
		watch: {
			selfByAttitudeList: function(val) {
				this.beckoningList = val;
				if (this.beckoningList && this.beckoningList.length < this.frendspageSize) {
					this.loadMoreStatus = 2;
				}
			},
		},
		methods: {
			getSelfByAttitude() {
				let self = this;
				if (!self.isHasMoreData) {
					self.loadMoreStatus = 2;
					return;
				}

				Server.get(
					"/user/getSelfByAttitude", {
						attitude: true,
						pageIndex: self.attitudePageIndex + 1,
						pageSize: self.attitudePageSize,
					}, {
						success: (response) => {
							if (response.data.data.rows.length > 0) {
								//封装数据
								self.beckoningList = self.beckoningList.concat(
									response.data.data.rows
								);
							}
							if (response.data.data.rows.length < self.attitudePageSize) {
								// 2 判断没有更多了
								self.isHasMoreData = false;
								self.loadMoreStatus = 2;
							} else {
								self.loadMoreStatus = 0;
							}
							if (response.data.data.total == 0) {
								this.empty = true;
							} else {
								this.empty = false;
							}
						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						},
						service: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response.data.msg;
							self.modeltitle = "提示";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						},
						error: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						}
					}
				);
			},
			getLikeMe() {
				let self = this;
				if (!self.isHasMoreData) {
					self.loadMoreStatus = 2;
					return;
				}
				Server.get(
					"/user/getLikeMe", {
						pageIndex: self.likeMePageIndex + 1,
						pageSize: self.likeMepageSize,
					}, {
						success: (response) => {
							if (response.data.data.rows.length > 0) {
								//封装数据
								self.beckoningList = self.beckoningList.concat(
									response.data.data.rows
								);
							}
							if (response.data.data.rows.length < self.likeMepageSize) {
								// 2 判断没有更多了
								self.isHasMoreData = false;
								self.loadMoreStatus = 2;
							} else {
								self.loadMoreStatus = 0;
							}
							if (response.data.data.total == 0) {
								this.empty = true;
							} else {
								this.empty = false;
							}
						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						},
						service: response => {
							//接口调用完成执行 关闭loading
							self.operatioin = "chageindex";

							self.modelcontent = response.data.msg;
							self.modeltitle = "提示";
							self.canceltext = "再看看";
							self.confirmtext = "立刻升级";
							self.showcancelbutton = true;
							self.modelshow = true;

						},
						error: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						}
					}
				);
			},
			getFrends() {
				let self = this;
				if (!self.isHasMoreData) {
					self.loadMoreStatus = 2;
					return;
				}
				Server.get(
					"/user/getPair", {
						pageIndex: self.frendsPageIndex + 1,
						pageSize: self.frendspageSize,
					}, {
						success: (response) => {
							if (response.data.data.rows.length > 0) {
								//封装数据
								self.beckoningList = self.beckoningList.concat(
									response.data.data.rows
								);
							}
							if (response.data.data.rows.length < self.frendspageSize) {
								// 2 判断没有更多了
								self.isHasMoreData = false;
								self.loadMoreStatus = 2;
							} else {
								self.loadMoreStatus = 0;
							}
							if (response.data.data.total == 0) {
								this.empty = true;
							} else {
								this.empty = false;
							}
						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						},
						service: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response.data.msg;
							self.modeltitle = "提示";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						},
						error: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.canceltext = "取消";
							self.confirmtext = "确定";
							self.showcancelbutton = false;
							self.modelshow = true;
						}
					}
				);
			},
			tabClickHandler(index) {
				this.empty = false;
				this.currentTab = index;
				this.isHasMoreData = true;
				this.beckoningList = [];
				this.loadMoreStatus = 0;

				if (this.currentTab === 1) {
					this.emptyText = "你还没有心动的人";
					this.attitudePageIndex = 0;
					this.getSelfByAttitude();
				} else if (this.currentTab === 2) {
					this.emptyText = "还没有人心动你";
					this.likeMePageIndex = 0;
					this.getLikeMe();
				} else {
					this.emptyText = "还没有配对的好友";
					this.frendsPageIndex = 0;
					this.getFrends();
				}
			},
			clickHandler(id) {
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=' + id
				})
				/* uni.navigateTo({
					url: '/pages/profile/index?userId=' + id
				}) */
			},
			// 处理滚动到底部分页逻辑
			handleOnReachBottom() {
				this.loadMoreStatus = 1;
				if (this.currentTab === 1) {
					this.attitudePageIndex++;
					this.getSelfByAttitude();
				} else if (this.currentTab === 2) {
					this.likeMePageIndex++;
					this.getLikeMe();
				} else {
					this.frendsPageIndex++;
					this.getFrends();
				}
			},
			confirm() {
				if (this.operatioin == "chageindex") {
					this.tabClickHandler(1);
					uni.navigateTo({
						url: '/pagesC/memberCenter/memberCenter?level=2'
					});
				}

				this.operatioin = "";
			},
			cancel() {
				if (this.operatioin == "chageindex") {
					this.tabClickHandler(1);
				}
				this.operatioin = "";
			},
			geturl(url) {
				return Vuee.prototype.serveraddress + "/" + url;
			}
		},
	};
</script>

<style lang="less" scoped>
	.tab {
		font-size: 30upx;
		display: flex;
		justify-content: space-between;

		>.tab-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20upx;
			color: #b2bec3;
			position: relative;

			&.active {
				color: #fe7e97;

				&::after {
					content: "";
					width: 100upx;
					height: 2px;
					background-color: #fe7e97;
					position: absolute;
					bottom: 0;
				}
			}
		}
	}

	.list {
		display: flex;
		// justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 10upx;
		padding-top: 20upx;

		.list-item {
			position: relative;
			width: 32.5%;
			height: 400upx;
			border-radius: 10upx;
			overflow: hidden;
			margin-bottom: 10upx;
			margin-right: 7upx;

			.sex-group {
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				bottom: 50upx;
				left: 10upx;
				height: 35upx;
				width: 35upx;
				padding: 5upx;

				.sex {
					width: 20upx;
					height: 20upx;
				}
			}

			.text {
				font-size: 20upx;
				color: #ffffff;
				position: absolute;
				bottom: 15upx;
				left: 10upx;
			}

			.star-count {
				position: absolute;
				display: flex;
				align-items: center;
				top: 10upx;
				left: 10upx;
				font-size: 20upx;
				padding: 2upx 10upx;
				border-radius: 20upx;
				color: #fe7e97;
				border: 1px solid currentColor;

				.heart-icon {
					width: 25upx;
					height: 25upx;
					margin-right: 5upx;
				}
			}

			.img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
