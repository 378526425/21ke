<template>
	<view class="main">
		<u-navbar :is-back="true" :title="title" title-color="#fff" back-icon-color="#fff"
			:back-text-style="{ color: '#fff' }" back-text="返回" :background="{ backgroundColor: '#fe7e97' }">
		</u-navbar>
		<!-- <u-search placeholder="搜索组局" @search="saerch()" :clearabled="false" v-model="keyword" :show-action="true" action-text="搜索"
		 :animation="true"></u-search> -->
		<view class="main_param">
			<view v-if="!myself" class="main_param_left">
				<view class="main_param_left_cent">
					<view class="main_param_left_img">
						<image class="main_param_left_img" :src="geturl('/system/zuju/dingwei.png')" mode="aspectFit">
						</image>
					</view>

					<view v-if="samecitybool" class="main_param_left_txt">
						<text @click="allcity()">推荐</text>
						<text>/</text>
						<text style="color:#fe7e97;">同城</text>
					</view>
					<view v-else class="main_param_left_txt">
						<text style="color:#fe7e97;">推荐</text>
						<text>/</text>
						<text @click="samecity()">同城</text>
					</view>
				</view>

			</view>
			<view class="main_param_right">
				<u-tag v-if="!myself" @click="selectsex()" text="性别" mode="light" shape="circle" bg-color="#EFF9FE"
					color="#8FD3F5" border-color="#EFF9FE" />
				<!-- 运动-->
				<u-tag v-if="myself" @click="selecttype()" style="margin-left:10rpx;" text="类型" mode="light"
					shape="circle" bg-color="#EFFEF6" color="#72CD9D" border-color="#EFFEF6" />
			</view>
			<u-select v-model="show" mode="single-column" :list="selectlist" @confirm="confirmsex"
				confirm-color="#fe7e97"></u-select>
			<u-select v-model="showtype" mode="single-column" :list="selectlist" @confirm="confirmtype"
				confirm-color="#fe7e97"></u-select>
		</view>

		<view class="main_info">
			<view v-if="emptycardList">
				<y-Empty emptyText="暂时没有组局" />
			</view>
			<view v-else class="list-item" @click="clickHandler(item.id)" v-for="(item, index) in gameList"
				:key="index">
				<image class="img" :src="geturlimg(item.firstSelfiePath)" mode="aspectFill" />
				<view class="star-count">
					<image class="heart-icon" :src="require('@/static/icon/locationicon.png')" />
					<text>{{item.distanceStr}}</text>
				</view>

				<text class="text"> {{item.address}}</text>
				<view class="main_info_avatar">
					<u-avatar :src="geturlimg(item.headPortrait)" size="mini" mode="circle" :showSex="true"
						:sex-icon="item.gender" :sex-bg-color="item.sexbgColor"></u-avatar>
				</view>

				<view class="main_info_content">

					<text>
						{{item.content}}
					</text>

				</view>
				<view class="main_info_content_tag">

					<u-tag :text="gameTypeText(item.gameType)" mode="light" size="mini" shape="circle"
						bg-color="#FAF0FE" color="#E6BBF8" border-color="#FAF0FE" />
				</view>
			</view>
		</view>

		<view v-if="!emptycardList">
			<y-LoadMore :status="loadMoreStatus" />
		</view>
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%"
			:show-cancel-button="showcancelbutton" :confirm-style="{color: '#fe7e97'}" :confirm-text="confirmtext"
			:cancel-text="canceltext" @confirm="confirm()" @cancel="cancel()"></u-modal>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	//import permision from "@/common/permission.js"
	import Vue from 'vue'
	export default {
		data() {
			return {
				keyword: '',
				show: false,
				showtype: false,
				selectlist: [],
				gameList: [],
				gametypeList: [{
						value: "",
						label: "不限"
					},
					{
						value: "1",
						label: "打游戏"
					},
					{
						value: "2",
						label: "约饭"
					},
					{
						value: "3",
						label: "看电影"
					},
					{
						value: "4",
						label: "酒吧蹦迪"
					}, {
						value: "5",
						label: "外出游玩"
					},
					{
						value: "6",
						label: "运动"
					}, {
						value: "7",
						label: "街拍摄影"
					}, {
						value: "8",
						label: "卡拉OK"
					}, {
						value: "9",
						label: "剧本杀"
					}, {
						value: "10",
						label: "看话剧"
					},
					{
						value: "11",
						label: "艺术展"
					}, {
						value: "12",
						label: "狼人杀"
					},
					{
						value: "13",
						label: "游泳"
					},
					{
						value: "14",
						label: "真人CS"
					},
					{
						value: "15",
						label: "滑板"
					},
					{
						value: "16",
						label: "演唱会"
					},
					{
						value: "17",
						label: "卡丁车"
					},
					{
						value: "18",
						label: "爬山"
					}, {
						value: "19",
						label: "图书馆"
					},
					{
						value: "20",
						label: "其他"
					}
				],
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				showcancelbutton: false,
				actionoperation: "",
				confirmtext: '确认',
				canceltext: '取消',
				loadMoreStatus: 1, //0加载前，1加载中，2没有更多了
				emptycardList: false,
				pageIndex: 1,
				pageSize: 10,
				address: "",
				addresstemp: "",
				genderId: "",
				gameType: "",
				samecitybool: false,
				title: "",
				myself: false,
				loginUserId: ""
			}
		},
		onLoad(options) {
			try {
				uni.setStorageSync('cancellocatin', 'false');
			} catch (e) {

			}
			if (options && options.gametype) {
				this.gameType = options.gametype;
			}
			if (options && options.title) {
				this.title = options.title;
			}
			if (options && options.myself) {
				this.myself = options.myself;
				this.loginUserId =
					uni.getStorageSync("loginuserinfo") &&
					uni.getStorageSync("loginuserinfo").user.id;
			}

		},
		onReachBottom() {
			this.pageIndex++;
			this.initdata();
		},
		onShow() {
			this.samecitybool = false;
			this.pageIndex = 1;
			this.initdata();
			//this.saveaddress(false);
		},
		methods: {
			saerch() {
				this.pageIndex = 1;
				this.initdata();
			},
			confirmsex(e) {
				this.genderId = e[0].value;
				this.pageIndex = 1;
				this.initdata();
			},
			confirmtype(e) {
				this.gameType = e[0].value;
				this.pageIndex = 1;
				this.initdata();
			},
			selectsex() {
				this.selectlist = [{
						value: "",
						label: "不限"
					},
					{
						value: "2",
						label: "男"
					},
					{
						value: "3",
						label: "女"
					}
				];
				this.show = true;
			},
			selecttype() {
				this.selectlist = this.gametypeList;
				this.showtype = true;
			},
			initdata() {
				let self = this;
				Server.get(
					"/Game/getGameInvitList", {
						condition: "{'address':'" + self.address + "','gameType':'" + self.gameType +
							"','genderId':'" + self.genderId +
							"','keyword':'" + self.keyword + "','userId':'" + self.loginUserId + "'}",
						pageIndex: self.pageIndex,
						pageSize: self.pageSize
					}, {
						success: (response) => {
							if (self.pageIndex == 1) {
								self.gameList = [];
							}
							if (response.data.data.rows.length > 0) {
								//封装数据
								self.gameList = self.gameList.concat(response.data.data.rows);
							}
							if (response.data.data.rows.length < self.pageSize) {
								// 2 判断没有更多了
								self.loadMoreStatus = 2;
							}

							if (response.data.data.total == 0) {
								self.emptycardList = true;
							} else {
								self.emptycardList = false;
							}

						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.modelshow = true;
						},
						service: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response.data.msg;
							self.modeltitle = "提示";
							self.modelshow = true;
						},
						error: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.modelshow = true;
						}
					}
				);
			},
			gameTypeText(type) {
				for (var i = 0; i < this.gametypeList.length; i++) {
					if (type == this.gametypeList[i].value) {
						return this.gametypeList[i].label;
					}
				}
				return "其他";
			},
			saveaddress(isinitdata) {
				let self = this;
				//获取位置信息
				console.log("判断用户是否授权位置信息")

				let isloaction = permision.checkSystemEnableLocation();


				if (isloaction == false) {
					//接口调用完成执行 关闭loading
					uni.hideLoading();
					try {
						const canceladdress = uni.getStorageSync('cancellocatin');

						if (canceladdress != 'true') {
							//没有授权，引导用户打开授权
							self.showcancelbutton = true; //修改取消按钮
							self.modelcontent = "我们需要获取定位信息用于向您推荐附近的人";
							self.modeltitle = "警告";
							//self.modelshow = true;
							self.actionoperation = "gotoAppPermissionSetting";
						}

					} catch (e) {
						// error
					}
				} else {
					//有授权信息
					console.log("获取定位")
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							self.addresstemp = (res.address != undefined && res.address.city != undefined) ?
								res.address.city : "";
							//修改用户位置
							Server.put("/user/updateUserAddress", {
								"longitude": res.longitude,
								"latitude": res.latitude,
								"address": self.addresstemp
							}, {
								success: response => {
									console.log("修改用户位置完成")
									if (isinitdata) {
										self.address = self.addresstemp;
										self.initdata();
									}
								},
								warnings: response => {
									//接口调用完成执行 关闭loading
									uni.hideLoading();

									self.showcancelbutton = false; //修改取消按钮
									self.modelcontent = response;
									self.modeltitle = "警告";
									self.modelshow = true;
								},
								error: response => {
									//接口调用完成执行 关闭loading
									uni.hideLoading();
									self.showcancelbutton = false; //修改取消按钮
									self.modelcontent = response;
									self.modeltitle = "错误";
									self.modelshow = true;
								}
							}, false)
						},
						fail: function(res) {
							//接口调用完成执行 关闭loading
							uni.hideLoading();
							//self.showcancelbutton = false; //修改取消按钮


							try {
								const canceladdress = uni.getStorageSync('cancellocatin');

								if (canceladdress != 'true') {
									//没有授权，引导用户打开授权
									self.showcancelbutton = true; //修改取消按钮
									self.modelcontent = "我们需要获取定位信息用于向您推荐附近的人";
									self.modeltitle = "警告";
									self.modelshow = true;
									self.actionoperation = "gotoAppPermissionSetting";
								}

							} catch (e) {
								// error
							}
							console.log('获取位置失败：' + res)
						},
						complete: function(res) {
							console.log('获取位置完成：' + res)
						}
					});

				}
			},
			confirm() {
				console.log("点击了确认")
				if (this.actionoperation == "gotoAppPermissionSetting") {
					//引导用户授权
					//permision.gotoAppPermissionSetting();
				}
				if (this.actionoperation == "deletegame") {
					this.pageIndex = 1;
					this.initdata();
				}
				this.actionoperation = ""; //置空防止干扰
			},
			cancel() {
				console.log("点击了取消")
				this.samecitybool = false;
				try {
					uni.setStorageSync('cancellocatin', 'true');
				} catch (e) {

				}
			},
			samecity() {
				this.samecitybool = true;
				this.pageIndex = 1;
				if (this.addresstemp != '') {
					this.address = this.addresstemp;
					this.initdata();
				} else {
					try {
						uni.setStorageSync('cancellocatin', 'false');
					} catch (e) {

					}
					//this.saveaddress(true);
				}

			},
			allcity() {
				this.samecitybool = false;
				this.pageIndex = 1;
				this.address = "";
				this.initdata();
			},
			deletegame(id) {
				let self = this;
				Server.delete(
					"/Game/deleteGameInvit/" + id, {}, {
						success: (response) => {
							self.modelcontent = "已删除";
							self.modeltitle = "提示";
							self.actionoperation = "deletegame";
							self.modelshow = true;
						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.modelshow = true;
						},
						service: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response.data.msg;
							self.modeltitle = "提示";
							self.modelshow = true;
						},
						error: response => {
							//接口调用完成执行 关闭loading
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.modelshow = true;
						}
					}
				);
			},
			clickHandler(id) {
				uni.navigateTo({
					url: '/pagesE/gamedetail/gamedetail?id=' + id
				});
			},
			geturl(url) {
				return Vue.prototype.serveraddress + "/file/" + url;
			},
			geturlimg(url) {
				return Vue.prototype.serveraddress + "/" + url;
			}
		}
	}
</script>

<style lang="less" scoped>
	.main {
		//border: 1px solid #000000;
		padding: 30rpx;
	}

	.main_bar {

		margin-top: 30rpx;
		text-align: center;
	}

	.main_bar_info {

		width: 130rpx;
		height: 130rpx;
		margin-top: 10rpx;
		display: inline-block;
	}

	.main_bar_info_img {
		width: 100rpx;
		height: 100rpx;
	}

	.main_param {

		margin-top: 30rpx;
		height: 80rpx;

	}

	.main_param_left {

		width: 200rpx;
		height: 80rpx;
		float: left;
		margin: 15rpx;

	}

	.main_param_left_cent {

		height: 50rpx;

	}

	.main_param_left_img {
		width: 50rpx;
		height: 50rpx;
		float: left;
	}

	.main_param_left_txt {

		float: right;
		margin-left: 20rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-weight: bold;
	}

	.main_param_right {
		float: right;
		width: 300rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: right;
	}

	/* .main_info{
		margin-top: 30rpx;
		text-align: center;
		border: 1rpx solid red;
	} */
	.main_info {

		margin-top: 30rpx;
		//display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.list-item {
			position: relative;
			width: 47%;
			height: 480rpx;
			display: inline-block;
			border-radius: 10upx;
			overflow: hidden;
			margin: 10rpx;
			border: 1px solid #F5C8E0;

			.sex-group {
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				bottom: 140upx;
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
				bottom: 160upx;
				right: 20upx;
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
				height: 320rpx;
			}

			.main_info_avatar {
				width: 100%;
				height: 100rpx;

				align-items: center;
				position: absolute;
				display: flex;
				padding-left: 20rpx;
				bottom: 110upx;
			}

			.main_info_content {
				width: 100%;
				height: 50rpx;

				align-items: center;
				position: absolute;

				padding-left: 20rpx;
				bottom: 60upx;
				display: block;
				/*内联对象需加*/
				word-break: keep-all;
				/* 不换行 */
				white-space: nowrap;
				/* 不换行 */
				overflow: hidden;
				/* 内容超出宽度时隐藏超出部分的内容 */
				text-overflow: ellipsis;
				/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/

			}

			.main_info_content_tag {
				width: 100%;
				height: 60rpx;

				align-items: center;
				position: absolute;
				display: flex;
				padding-left: 20rpx;
				bottom: 0upx;
			}
		}
	}
</style>
