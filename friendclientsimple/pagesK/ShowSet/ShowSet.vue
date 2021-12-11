<template>
	<view>
		<u-navbar :is-back="true" title="向我显示设置" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="mine-wrap" :style="{ minHeight: mineBoxHeight }">
			<view class="login_line">
				<view class="login_line_title">性别：</view>
				<view style="width: 100%;" @tap="showselect">{{genderText}}</view>
				<u-select v-model="showgender" :default-value="defaultgender" mode="single-column" :list="list" @confirm="confirmgender"
				 confirm-color="#fe7e97"></u-select>
			</view>
			<view class="login_line">
				<view class="login_line_title">年龄：</view>
				<RangeSlider :width="slideWidth" :height="slideHeight" :blockSize="slideBlockSize" :min="slideMin" :max="slideMax"
				 :values="rangeValues" :step="step" :liveMode="isLiveMode" active-color="#fe7e97" @rangechange="onRangeChange">
					<view slot="minBlock" class="range-slider-block"></view>
					<!-- 左边滑块的内容 -->
					<view slot="maxBlock" class="range-slider-block"></view>
					<!-- 右边滑块的内容 -->
				</RangeSlider>

				<view style="color:#fe7e97;margin-left: 20rpx;">
					{{rangeValues[0]}}~{{rangeValues[1]}}
				</view>
			</view>
			<view class="login_line">
				<view class="login_line_title">阶段：</view>
				<view style="width: 100%;" @tap="stageshowselect">{{stageText}}</view>
				<u-select v-model="showstage" :default-value="defaultstage" mode="single-column" :list="liststage" @confirm="confirmstage"
				 confirm-color="#fe7e97"></u-select>
			</view>
			<view class="login_btn" @tap="login">保存</view>
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
	import RangeSlider from '@/components/range-slider/range-slider.vue';
	import Server from "@/common/serverutil.js";
	export default {
		name: 'Login',
		components: {
			RangeSlider
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
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				showgender: false,
				gendervalue: null,
				genderText: "不限",
				list: [{
						value: '2',
						label: '男'
					},
					{
						value: '3',
						label: '女'
					},
					{
						value: null,
						label: '不限'
					}
				],
				defaultgender: [0],
				age: 16,

				slideWidth: 350,
				slideHeight: 80,
				slideBlockSize: 30,

				slideMin: 16,
				slideMax: 100,
				rangeValues: [18, 80],
				isLiveMode: true,
				step: 1,

				showstage: false,
				stagevalue: null,
				stageText: "不限",
				liststage: [{
						value: '5',
						label: '学生'
					},
					{
						value: '6',
						label: '工作'
					},
					{
						value: null,
						label: '不限'
					}
				],
				defaultstage: [0],
				seeRange: null
			}
		},
		methods: {
			onShow() {
				console.log('mine', getApp().globalData)
				let self = this;
				Server.get("/user/getPreferenceSet", {}, {
					success: response => {
						console.log(response)
						if (response.data.data.gender != null && response.data.data.gender != undefined && response.data.data.gender !=
							'') {
							self.gendervalue = response.data.data.gender;
							self.genderText = response.data.data.gender == 2 ? "男" : "女";
							for (var i = 0; i < self.list.length; i++) {
								if (self.list[i].value == self.gendervalue) {
									self.defaultgender = [i];
									break;
								}
							}
						} else {
							self.defaultgender = [2];
						}
						if (response.data.data.stage != null && response.data.data.stage != undefined && response.data.data.stage !=
							'') {
							self.stagevalue = response.data.data.stage;
							self.stageText = response.data.data.stage == 5 ? "学生" : "工作";
							for (var i = 0; i < self.liststage.length; i++) {
								if (self.liststage[i].value == self.stagevalue) {
									self.defaultstage = [i];
									break;
								}
							}
						}else {
							self.defaultstage = [2];
						}
						if (response.data.data.maxAge != null && response.data.data.maxAge != undefined && response.data.data.maxAge !=
							'' && response.data.data.minAge != null && response.data.data.minAge != undefined && response.data.data.minAge !=
							'') {
							self.rangeValues = [response.data.data.minAge, response.data.data.maxAge]
						}
						if (response.data.data.seeRange != null && response.data.data.seeRange != undefined) {
							self.seeRange = response.data.data.seeRange;
						}
					},
					warnings: response => {
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
				})
			},
			login() {
				let self = this;
				Server.post("/user/addPreferenceSet", {
					gender: this.gendervalue,
					maxAge: this.rangeValues[1],
					minAge: this.rangeValues[0],
					stage: this.stagevalue,
					seeRange: self.seeRange
				}, {
					success: response => {
						this.modelcontent = "保存成功";
						this.modeltitle = "提示";
						this.modelshow = true;
					},
					warnings: response => {
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
				})
			},

			// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
			confirmgender(e) {
				this.genderText = e[0].label;
				this.gendervalue = e[0].value;
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].value == this.gendervalue) {
						this.defaultgender = [i];
						break;
					}
				}

			},
			showselect() {
				this.showgender = true;
			},
			onRangeChange: function(e) {
				this.rangeValues = [e.minValue, e.maxValue];
			},
			confirmstage(e) {
				let self=this;
				this.stageText = e[0].label;
				this.stagevalue = e[0].value;
				for (var i = 0; i < self.liststage.length; i++) {
					if (self.liststage[i].value == self.stagevalue) {
						self.defaultstage = [i];
						break;
					}
				}
			},
			stageshowselect() {
				this.showstage = true;
			},
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
		margin: 60upx auto;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		align-items: center;
		height: 60upx;
	}

	.login_line_title {
		font-size: 28upx;
		color: #333;
		width: 130upx;
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

	.login_btn {
		width: 94%;
		height: 80upx;
		text-align: center;
		background: #fe7e97;
		color: #ffffff;
		margin: 100upx auto;
		border-radius: 10upx;
		line-height: 80upx;
	}
</style>
