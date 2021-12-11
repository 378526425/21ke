<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="main">
			<view class="row_title">
				修改你的{{title}}
			</view>
			<view class="row_input">
				<u-radio-group v-model="value">
					<u-radio active-color="#fe7e97" @change="radioChange(item.stageId)" v-for="(item, index) in list" :key="index"
					 :name="item.name" :disabled="item.disabled">
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="row_btn" @click="chage">保存</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
		</view>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	export default {
		data() {
			return {
				title: "",
				fieldName: "",
				id: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				show: false,
				stageId: "",
				list: [],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: ""
			}
		},
		onLoad(options) {
			let self = this;
			if (options) {
				this.title = options.title;
				this.value = options.value;
				this.fieldName = options.fieldName;
				this.id = options.id;
				this.stageId = options.stageId;
			}
			//加载选择框
			Server.get("/common/datadictionary/4", {}, {
				success: response => {
					for (var i = 0; i < response.data.data.length; i++) {
						self.list.push({
							name: response.data.data[i].name,
							disabled: false,
							stageId: response.data.data[i].id
						})
					}
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
		},
		methods: {

			placehold() {
				return "请输入你的" + this.title;
			},
			chage() {
				let self = this;
				Server.put("/common/updateField", {
					fieldName: self.fieldName,
					fieldValue: self.stageId,
					tableName: 'user',
					id: self.id
				}, {
					success: response => {
						uni.navigateBack()
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
			}, // 选中某个单选框时，由radio时触发
			radioChange(stageId) {
				this.stageId = stageId;
			}
		}
	}
</script>

<style scoped>
	.main {
		height: 450upx;
		padding: 20upx;
	}

	.row_title {
		font-size: 35upx;
		height: 150upx;
		display: flex;
		align-items: center;
		color: #505061;
	}

	.row_input {

		height: 80upx;
		display: flex;
		align-items: center;
		color: #808080;
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
