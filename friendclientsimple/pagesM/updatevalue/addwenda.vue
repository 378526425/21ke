<template>
	<view>
		<u-navbar :is-back="true" title="我的问答" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="content">
			<view class="row" v-for="(item, index) in data" @click="addanswer(item)">
				{{item.problemTitle}}
			</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	export default {
		data() {
			return {
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				data: [],
				userId: ""
			}
		},
		onShow() {
			let self = this;
			Server.get("/common/problem", {
				userId: self.userId
			}, {
				success: response => {
					self.data = response.data.data;
				},
				warnings: response => {
					self.modelcontent = response;
					self.modeltitle = "警告";
					self.modelshow = true;
				},
				service: response => {
					self.modelcontent = response.data.msg;
					self.modeltitle = "警告";
					self.modelshow = true;
				},
				error: response => {
					self.modelcontent = response;
					self.modeltitle = "错误";
					self.modelshow = true;
				}
			})
		},
		onLoad(options) {
			if (options) {
				this.userId = options.userId;
			}
		},
		methods: {
			addanswer(item) {
				uni.navigateTo({
					url: '/pagesM/updatevalue/addanswer?problemId='+item.id+'&answerContent='+item.answerContent+'&problemTitle='+item.problemTitle
				});
			}
		}
	}
</script>

<style scoped>
	.content {
		border: 7upx solid #F7F7F7;
		border-radius: 20upx;
		margin: 50upx 30upx 50upx 30upx;
		padding: 10upx;
		padding-bottom: 80rpx;
	}

	.row {
		border-bottom: 5upx solid #F7F7F7;
		padding-left: 15upx;
		padding-top: 30upx;
		padding-bottom: 30upx;
		margin-left: 10upx;
		margin-right: 10upx;
		font-size: 28upx;
		color: #545454;
	}
</style>
