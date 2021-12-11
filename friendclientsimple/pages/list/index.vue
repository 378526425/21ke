<template>
	<view>
		<u-navbar :is-back="false" title="遇见" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{ backgroundColor: '#fe7e97' }">
		</u-navbar>
		
		<view class="content">
			<view class="tab-bar">
				<text :class="['item', { active: currentIndex === 0 }]" @click="tabbarClickHandler(0)">消息</text>
				<text  :class="['item', { active: currentIndex === 1 }]" @click="tabbarClickHandler(1)">好友</text>
			</view>
			<view v-if="currentIndex === 0">
				<message :messagelist="messagelist" :empty="empty"></message>
				<y-LoadMore v-if="messagelist && messagelist.length > 0" :status="loadMoreStatus" />
			</view>
			<view v-else>
				<beckoning ref="beckoning" :selfByAttitudeList="selfByAttitudeList" :empty="empty"/>
			</view>
			<!-- <button type="primary" @click="connect">连接websocket服务</button> -->
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{ color: '#fe7e97' }"></u-modal>
		</view>
	</view>
</template>

<script>
	import {
		Vue,
		Component
	} from "vue-property-decorator";

	// import { SwiperChangeEvent } from '@/typings'
	import Message from "./components/Message.vue";
	import Beckoning from "./components/Beckoning.vue";
	import Server from "@/common/serverutil.js";
	import Main from "@/main.js";
	export default {
		name: "ListIndex",
		components: {
			Message,
			Beckoning,
		},
		data() {
			return {
				currentIndex: 0,
				messagelist: [],
				selfByAttitudeList: [],
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				websocketTask: {},
				is_open_socket: false,
				is_init_connect: "",
				is_init_open: true,
				userId: "",
				userList: [],
				timeout: 30000, //每隔30S 就续约一次,
				timeoutObj: null,
				pageIndex: 0,
				pageSize: 12,
				loadMoreStatus: 1, //0加载前，1加载中，2没有更多了
				isloading: true,
				empty:false
			};
		},
		onLoad(options) {
                
		},
		// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
		beforeDestroy() {
			this.closeSocket();
			clearInterval(this.timeoutObj);//销毁定时器
		},
		onShow() {
			this.isloading = true;
			this.referesh();
			this.userId =
				uni.getStorageSync("loginuserinfo") &&
				uni.getStorageSync("loginuserinfo").user.id;
			this.connectSocketInit();
		},
		onReachBottom() {
			console.log("onReachBottom");
			if (this.currentIndex === 0) {
				this.pageIndex++;
				this.isloading = true;
				this.getMessageList();
			} else {
				this.$refs.beckoning.handleOnReachBottom();
			}
		},
		onPullDownRefresh() {
			console.log("onPullDownRefresh");
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
			this.tabbarClickHandler(0);
			this.referesh();
		},
		methods: {
			tabbarClickHandler(index) {
				this.currentIndex = index;
				if (this.currentIndex === 1) {
					this.getSelfByAttitude();
					uni.hideTabBarRedDot({
						index: 1,
						success: function(rep) {
							console.log("hideTabBarRedDot");
						},
					});
				}
			},
			getMessageList(pageIndex, pageSize, isReload = false) {
				let self=this;
				if(isReload)
				{
					self.pageIndex=0;
					self.pageSize=12;
				}
				Server.get(
					"/chat/messageList", {
						pageIndex:  self.pageIndex + 1,
						pageSize:  self.pageSize,
					}, {
						success: (response) => {
							if (response.data.data.rows.length > 0) {
								//封装数据
								if (isReload) {
									self.messagelist = response.data.data.rows;
								} else {
									self.messagelist = self.messagelist.concat(
										response.data.data.rows
									);
								}
							}
							if (response.data.data.rows.length <  self.pageSize) {
								// 2 判断没有更多了
								self.loadMoreStatus = 2;
							}else{
								self.loadMoreStatus = 0;
							}
							if(response.data.data.total==0)
							{
								self.empty=true;
							}else{
								self.empty=false;
							}
						},
						warnings: (response) => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.modelshow = true;
						},
						service: (response) => {
							self.modelcontent = response.data.msg;
							self.modeltitle = "警告";
							self.modelshow = true;
						},
						error: (response) => {
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.modelshow = true;
						},
					},
					self.isloading
				);
			},
			getSelfByAttitude() {
				Server.get(
					"/user/getPair", {
						pageIndex: 1,
						pageSize: 9,
					}, {
						success: (response) => {
							this.selfByAttitudeList = response.data.data.rows;
							if(response.data.data.total==0)
							{
								this.empty=true;
							}else{
								this.empty=false;
							}
						},
						warnings: (response) => {
							this.modelcontent = response;
							this.modeltitle = "警告";
							this.modelshow = true;
						},
						service: (response) => {
							this.modelcontent = response.data.msg;
							this.modeltitle = "警告";
							this.modelshow = true;
						},
						error: (response) => {
							this.modelcontent = response;
							this.modeltitle = "错误";
							this.modelshow = true;
						},
					}
				);
			},
			referesh() {
				// 刷新消息列表
				let pageSize = this.messagelist.length;
				this.getMessageList(0, pageSize || this.pageSize, true);
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				let self = this;
				self.websocketTask.close({
					success(res) {
						self.is_open_socket = false;
						console.log("关闭成功", res);
					},
					fail(err) {
						console.log("关闭失败", err);
					},
				});
			},
			connectSocketInit: function() {
				let self = this;
				console.log("连接socket");
				self.websocketTask = uni.connectSocket({
					url: Vue.prototype.websocketurl,
					success(data) {
						console.log("连接socket成功");
					},
					fail(data) {
						console.log("连接socket失败，继续连接");
						setTimeout(()=>{
							self.connectSocketInit();
						},1000)
						
					}
				});
				self.websocketTask.onOpen((res) => {
					//监听WebSocket连接打开事件
					let msgData = {
						messageType: "connect",
						messageContent: self.userId,
					};
					console.log("发送连接请求");
					self.websocketTasksend(msgData);
					self.websocketTaskMessage();
				});
			},
			websocketTasksend(msgData) {
				let self = this;
				self.websocketTask.send({
					data: JSON.stringify(msgData),
					success() {
						console.log("发送成功" + msgData);
					},
					fail() {
						console.log("发送失败，重新建立连接" + msgData);
						setTimeout(()=>{
							self.connectSocketInit();
							self.websocketTasksend(msgData);
						},1000)
						
					}
				});
			},
			// 启动心跳 start
			start() {
				let self = this;
				self.timeoutObj = setInterval(function() {
					self.websocketTask.send({
						data: "alive",
						success() {
							console.log("心跳续约成功。。。。");
							self.websocketTaskMessage();
						},
						fail() {
							console.log("心跳续约失败重新连接....");
							setTimeout(()=>{
								self.connectSocketInit();
							},1000)
							
						}
					});
				}, self.timeout);
			},

			// 检测心跳reset
			reset() {
				clearInterval(this.timeoutObj);
				this.start(); // 启动心跳
			},
			websocketTaskMessage() {
				let self = this;
				self.websocketTask.onMessage((res) => {
					if ("连接成功！" == res.data) {
						//建立连接成功后开始心跳
						this.reset(); // 检测心跳reset,防止长时间连接导致连接关闭
					} else {
						self.isloading = false;
						let ceiveMsg = JSON.parse(res.data).messageContent;
						console.log("消息内容：", ceiveMsg);
						self.referesh();
					}
				});
				self.websocketTask.onError((res) => {
					//连接错误重新连接
					self.connectSocketInit();
				});
			}
		},
	};
</script>

<style lang="less" scoped>
	.tab-bar {
		padding-left: 20upx;
		display: flex;
		color: #cccccc;

		>.item {
			&:last-child {
				margin-left: 50upx;
			}

			&.active {
				color: #f96f9c;
				display: flex;
				flex-direction: column;
				align-items: center;

				&::after {
					content: "";
					display: block;
					height: 6upx;
					width: 40upx;
					border-radius: 4upx;
					margin-top: 5upx;
					background-color: #f96f9c;
				}
			}
		}
	}

	.content {
		background-color: #ffffff;
		padding-top: 20upx;
	}
</style>
