<template>
	<view>
		<u-navbar :is-back="true" title="个性标签" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="main">
			<view class="row_title">
				个人需求
			</view>
			<view>
				<u-checkbox-group @change="checkboxGroupChange">
					<u-checkbox v-model="item.checked" v-for="(item, index) in makefriendsdeman" :key="item.id" :name="item.id"
					 active-color="#fe7e97">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>

			<view class="row_title">
				个性标签
			</view>
			<view>
				<u-checkbox-group @change="checkboxGroupChangepersonalitytag">
					<u-checkbox v-model="item.checked" v-for="(item, index) in personalitytag" :key="item.id" :name="item.id"
					 active-color="#fe7e97">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>

			<view class="row_title">
				音乐
			</view>
			<view>
				<u-checkbox-group @change="checkboxGroupChangemusic">
					<u-checkbox v-model="item.checked" v-for="(item, index) in music" :key="item.id" :name="item.id" active-color="#fe7e97">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>

			<view class="row_title">
				运动
			</view>
			<view>
				<u-checkbox-group @change="checkboxGroupChangemotion">
					<u-checkbox v-model="item.checked" v-for="(item, index) in motion" :key="item.id" :name="item.id" active-color="#fe7e97">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>

			<view class="row_title">
				话题
			</view>
			<view>
				<u-checkbox-group @change="checkboxGroupChangeconversation">
					<u-checkbox v-model="item.checked" v-for="(item, index) in conversation" :key="item.id" :name="item.id"
					 active-color="#fe7e97">{{item.name}}</u-checkbox>
				</u-checkbox-group>
			</view>
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
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				userId: "",
				userinfo: {},
				makefriendsdeman: [],
				personalitytag: [],
				music: [],
				motion: [],
				conversation: []

			}
		},
		onShow() {
			let self = this;
			try {
				const restoken = uni.getStorageSync('loginuserinfo');
				if (restoken) {
					self.userId = restoken.user.id;
				}
			} catch (e) {
				// error
			}
			this.initdata();

		},
		methods: {
			initdata() {
				let self = this;
				Server.get("/user/getUserInfo/" + self.userId, {}, {
					success: response => {
						self.userinfo = response.data.data;
						self.inittag();
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
			inittag() {
				let self = this;
				//加载交友需求
				Server.get("/common/datadictionary/8", {}, {
					success: response => {
						self.makefriendsdeman = [];
						for (var i = 0; i < response.data.data.length; i++) {
							let checked = false;
							for (var j = 0; j < self.userinfo.makefriendsdeman.length; j++) {
								if (self.userinfo.makefriendsdeman[j].name == response.data.data[i].name) {
									checked = true;
								}
							}

							self.makefriendsdeman.push({
								id: response.data.data[i].id,
								name: response.data.data[i].name,
								checked: checked
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

				//加载个性标签

				Server.get("/common/datadictionary/13", {}, {
					success: response => {
						self.personalitytag = [];
						for (var i = 0; i < response.data.data.length; i++) {
							let checked = false;
							for (var j = 0; j < self.userinfo.personalitytag.length; j++) {
								if (self.userinfo.personalitytag[j].name == response.data.data[i].name) {
									checked = true;
								}
							}

							self.personalitytag.push({
								id: response.data.data[i].id,
								name: response.data.data[i].name,
								checked: checked
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

				//音乐
				Server.get("/common/datadictionary/16", {}, {
					success: response => {
						self.music = [];
						for (var i = 0; i < response.data.data.length; i++) {
							let checked = false;
							for (var j = 0; j < self.userinfo.music.length; j++) {
								if (self.userinfo.music[j].name == response.data.data[i].name) {
									checked = true;
								}
							}

							self.music.push({
								id: response.data.data[i].id,
								name: response.data.data[i].name,
								checked: checked
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


				//运动
				Server.get("/common/datadictionary/20", {}, {
					success: response => {
						self.motion = [];
						for (var i = 0; i < response.data.data.length; i++) {
							let checked = false;
							for (var j = 0; j < self.userinfo.motion.length; j++) {
								if (self.userinfo.motion[j].name == response.data.data[i].name) {
									checked = true;
								}
							}

							self.motion.push({
								id: response.data.data[i].id,
								name: response.data.data[i].name,
								checked: checked
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
				//话题
				Server.get("/common/datadictionary/23", {}, {
					success: response => {
						self.conversation = [];
						for (var i = 0; i < response.data.data.length; i++) {
							let checked = false;
							for (var j = 0; j < self.userinfo.conversation.length; j++) {
								if (self.userinfo.conversation[j].name == response.data.data[i].name) {
									checked = true;
								}
							}

							self.conversation.push({
								id: response.data.data[i].id,
								name: response.data.data[i].name,
								checked: checked
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
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				let self = this;
				Server.put("/common/updateDataDictionary", {
					dataDictionaryIdList: e,
					label: "makefriendsdeman",
					userId: self.userId
				}, {
					success: response => {},
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
				},false)
			},
			checkboxGroupChangepersonalitytag(e) {
				let self = this;
				Server.put("/common/updateDataDictionary", {
					dataDictionaryIdList: e,
					label: "personalitytag",
					userId: self.userId
				}, {
					success: response => {},
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
				},false)
			},
			checkboxGroupChangemusic(e) {
				let self = this;
				Server.put("/common/updateDataDictionary", {
					dataDictionaryIdList: e,
					label: "music",
					userId: self.userId
				}, {
					success: response => {},
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
				},false)
			},
			checkboxGroupChangemotion(e) {
				let self = this;
				Server.put("/common/updateDataDictionary", {
					dataDictionaryIdList: e,
					label: "motion",
					userId: self.userId
				}, {
					success: response => {},
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
				},false)
			},
			checkboxGroupChangeconversation(e) {
				let self = this;
				Server.put("/common/updateDataDictionary", {
					dataDictionaryIdList: e,
					label: "conversation",
					userId: self.userId
				}, {
					success: response => {},
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
				},false)
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
</style>
