<template>
	<view>
		<u-navbar :is-back="true" title="组局" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="publish-wrap bg-white">
			<view class="input-box padding-sm">
				<textarea class="area-top" placeholder="说点什么..." v-model="content"></textarea>
			</view>
			<view class="cu-form-group img-box">
				<view class="next-title">选择组局类别</view>
				<u-radio-group style="margin-top: 20rpx;" v-model="gametypetext" @change="radioGroupChange">
					<u-radio active-color="#fe7e97" @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.name"
					 :disabled="false">
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="bottom-btn flex-center">
				<view class="row_btn" @click="pushcontent">发起组局</view>
			</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"
			 @confirm="confirm()"></u-modal>
		</view>
	</view>

</template>

<script>
	import Server from "@/common/serverutil.js";
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
				list: [{
						value: "1",
						name: "打游戏"
					},
					{
						value: "2",
						name: "约饭"
					},
					{
						value: "3",
						name: "看电影"
					},
					{
						value: "4",
						name: "酒吧蹦迪"
					}, {
						value: "5",
						name: "外出游玩"
					},
					{
						value: "6",
						name: "运动"
					}, {
						value: "7",
						name: "街拍摄影"
					}, {
						value: "8",
						name: "卡拉OK"
					}, {
						value: "9",
						name: "剧本杀"
					}, {
						value: "10",
						name: "看话剧"
					},
					{
						value: "11",
						name: "艺术展"
					}, {
						value: "12",
						name: "狼人杀"
					},
					{
						value: "13",
						name: "游泳"
					},
					{
						value: "14",
						name: "真人CS"
					},
					{
						value: "15",
						name: "滑板"
					},
					{
						value: "16",
						name: "演唱会"
					},
					{
						value: "17",
						name: "卡丁车"
					},
					{
						value: "18",
						name: "爬山"
					}, {
						value: "19",
						name: "图书馆"
					},
					{
						value: "20",
						name: "其他"
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				gametype: "",
				gametypetext: ""
			};
		},
		methods: {
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				this.gametypetext = e;
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].name == e) {
						this.gametype = this.list[i].value;
						break;
					}

				}
			},
			pushcontent()
			{
				let self = this;
				//发布动态
				Server.post("/Game/addGameInvit", {
					"content": self.content,
					"gameType":self.gametype
				}, {
					success: response => {
						//跳转到动态页
						uni.switchTab({
							url: '/pages/game/game'
						});
					},
					warnings: response => {
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: response => {
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					}
				})
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
