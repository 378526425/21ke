<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="mine-wrap" :style="{ minHeight: mineBoxHeight }">
			<view class="login_line">
				<u-input class="desc" :custom-style="{'color':'white','font-size':'28upx','background-image': 'linear-gradient(to right, #fba3d9, #fb90bc)',
		'border-radius':'20upx','caret-color': 'white'}"
				 v-model="value" input-align="center" placeholder-style="color:white;" :maxlength="100" :clearable="false" height="250"
				 :type="type" />
			</view>
		
			<view class="row_btn" @click="chage">保存</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"></u-modal>
	</view>
</template>

<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'
	import Server from "@/common/serverutil.js";
	export default {
		name: 'Login',
		components: {

		},
		computed: {
			statusBarHeight() {
				const {
					statusBarHeight
				} = getApp().globalData
				return statusBarHeight
			},
			mineBoxHeight() {
				return `calc(100vh - 100px + ${this.statusBarHeight}px)`
			}
		},
		data() {
			return {
				title: "",
				fieldName: "",
				tableName: "",
				id: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				value: '',
				type: 'textarea'
			}
		},
		onLoad(options) {

			if (options) {
				this.title = options.title
				this.fieldName = options.fieldName;
				this.tableName = options.tableName;
				this.id = options.id;
				if(options.value!="undefined")
				{
					this.value = options.value
				}
				
			}

		},
		methods: {
			chage() {
				let self = this;
				Server.put("/common/updateField", {
					fieldName: self.fieldName,
					fieldValue: self.value,
					tableName: self.tableName,
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
<style>
	.login_img {
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		display: block;
		margin: 0 auto;
		margin-top: 120upx;
		margin-bottom: 40upx;
	}

	.login_line {
		width: 94%;
		margin: 60rpx auto;
		border-bottom: 1px solid #eeeeee;
		align-items: center;
	}

	.login_line_title {
		font-size: 28upx;
		color: #333;
		width: auto;
	}

	.login_line_input {
		width: 50%;
		font-size: 26upx;
	}

	.login_line_ver {
		font-size: 26upx;
		color: #333;
		border: 1px solid #333;
		padding: 2upx 5upx;
		border-radius: 6upx;
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

	.desc {
		;

	}
</style>
