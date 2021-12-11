<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="main">
			<view class="row_title">
				修改你的{{title}}
			</view>
			<view class="row_input" @click="show = true">
				{{value}}
			</view>
			<view class="row_btn" @click="chage">保存</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
			<u-select v-model="show" mode="single-column" :default-value="defaultlist" :list="list" @confirm="confirm" confirm-color="#fe7e97"></u-select>
		</view>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	export default {
		data() {
			return {
				title: "",
				value: "",
				fieldName: "",
				id: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				show: false,
				list: [],
				defaultlist:[0]
			}
		},
		onLoad(options) {
			if (options) {
				this.title = options.title;
				if(options.value!="undefined")
				{
					this.value = options.value
				}
				this.fieldName = options.fieldName;
				this.id = options.id;
			}
			for (var i = 140; i <= 250; i++) {
				this.list.push({
					value: i,
					label: i
				})
				if(this.value==i)
				{
					this.defaultlist=[i-140]
				}
			}
		},
		methods: {
			confirm(e) {
				this.value = e[0].value;
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].value == this.value) {
						this.defaultlist = [i];
						break;
					}
				}
			},
			placehold() {
				return "请输入你的" + this.title;
			},
			chage() {
				let self = this;
				Server.put("/common/updateField", {
					fieldName: self.fieldName,
					fieldValue: self.value,
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
		border-bottom: 1px solid #cccccc;
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
