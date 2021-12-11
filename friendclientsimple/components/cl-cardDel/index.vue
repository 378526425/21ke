<template>
	<view v-if="cardcount>0" class="page" :style="{ height: `${sysHeight}px`, width: `${sysWidth}px` }">
		<!-- #ifndef APP-PLUS -->
		<movable-area class="move-area" :style="{
        height: `${3 * sysHeight}px`,
        width: `${3 * sysWidth}px`,
        top: `${-sysHeight}px`,
        left: `${-sysWidth}px`
      }">
			<movable-view id="move" class="move-view" v-for="(item, index) in dataList" :key="item._id" :style="{ 
			marginLeft:`${-sysWidth/2}px`,marginTop:`${-sysHeight/2}px`,
			zIndex: `${999 - item._id}`, height: `${sysHeight}px`, width: `${sysWidth}px` }"
			 direction="all" :x="item.moveX" :y="item.moveY" out-of-bounds v-if="index <= number" :disabled="index != 0"
			 :animation="item.animation" @tap="tapCard(item)" @touchend="touchend" @touchmove="touchMove" @touchstart="touchStart">
				<view class="cardBox" :animation="animationData[index]" :style="{
			   height: `${sysHeight}px`, width: `${sysWidth-4}px` ,
            transform:
              index < number
                ? `rotate(${rotate * index}deg) scale(${1 -
                    (1 - scale.x) * index},${1 -
                    (1 - scale.y) * index}) skew(${skew.x *
                    index}deg, ${skew.y * index}deg) translate(${translate.x *
                    index}px, ${translate.y * index}px)`
                : `rotate(${rotate * (number - 1)}deg) scale(${1 -
                    (1 - scale.x) * (number - 1)},${1 -
                    (1 - scale.y) * (number - 1)}) skew(${skew.x *
                    (number - 1)}deg, ${skew.y *
                    (number - 1)}deg) translate(${translate.x *
                    (number - 1)}px, ${translate.y * (number - 1)}px)`,
            opacity:
              index < number
                ? `${1 - (1 - opacity) * index}`
                : `${1 - (1 - opacity) * (number - 1)}`
          }">
					<card-box :src="item.src" :number="item.number" :name="item.name" :sex="item.sex" :constellation="item.constellation"
					 :address="item.address" :old="item.old" :latelyTimeStr="item.latelyTimeStr" ref="cardBox"></card-box>
				</view>
			</movable-view>
		</movable-area>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view v-if="index <= number" class="move-view" :key="item._id" @touchend="touchend" @tap="tapCard(item)" v-for="(item, index) in dataList"
		 @touchmove="touchMove" @touchstart="touchStart" :animation="animationData[index]" :style="{
		  height: `${sysHeight}px`, width: `${sysWidth-4}px`,
		  marginLeft:`${-sysWidth/2}px`,marginTop:`${-sysHeight/2}px`,
        transform:
          index < number
            ? `rotate(${rotate * index}deg) scale(${1 -
                (1 - scale.x) * index},${1 -
                (1 - scale.y) * index}) skew(${skew.x * index}deg, ${skew.y *
                index}deg) translate(${translate.x * index}px, ${translate.y *
                index}px)`
            : `rotate(${rotate * (number - 1)}deg) scale(${1 -
                (1 - scale.x) * (number - 1)},${1 -
                (1 - scale.y) * (number - 1)}) skew(${skew.x *
                (number - 1)}deg, ${skew.y *
                (number - 1)}deg) translate(${translate.x *
                (number - 1)}px, ${translate.y * (number - 1)}px)`,
        zIndex: `${999 - item._id}`,
        opacity:
          index < number
            ? `${1 - (1 - opacity) * index}`
            : `${1 - (1 - opacity) * (number - 1)}`
      }">
			<view class="cardBox">
				<card-box :src="item.src" :number="item.number" :name="item.name" :sex="item.sex" :constellation="item.constellation"
				 :address="item.address" :old="item.old" :latelyTimeStr="item.latelyTimeStr" ref="cardBox"></card-box>
			</view>
		</view>
		<!-- #endif -->
		<!-- <view class="love" >
			<view class="iconfont icon-xinaixin" :style="{fontSize:'40rpx'}"  @tap="tapLove"></view>
		</view>
		<view class="loathe">
			<view class="iconfont icon-chacha1" :style="{fontSize:'40rpx'}" @tap="tapLoathe"></view>
    </view>-->
		<!-- 弹出层 -->
		<u-modal v-model="show" :title="title" :content="content" width="70%" :show-cancel-button="showcancelbutton"
		 :confirm-style="{color: '#fe7e97'}" :confirm-text="confirmtext" :cancel-text="canceltext" @confirm="confirm()"
		 @cancel="cancel()"></u-modal>
	</view>
	<y-Empty v-else-if="cardcount==0&&empty==true" emptyText="休息一会吧,没有更多资料了" />
</template>

<script>
	import clCardDel from './cl-cardDel'
	import cardBox from './CardBox.vue'
	import Server from "@/common/serverutil.js";
	import Vue from 'vue'
	export default {
		mixins: [clCardDel],
		components: {
			cardBox
		},
		data() {
			return {
				pageIndex: 1,
				pageSize: 10,
				show: false,
				content: '',
				title: '提示',
				confirmtext: '确认',
				canceltext: '取消',
				showcancelbutton: true,
				actionoperation: "",
				cardcount: 0,
				empty: false,
				showloading: true,
				chatuseridA:"",
				chatuseridB:"",
				chatusername:""
			}
		},
		onLoad() {},
		async mounted() {},
		methods: {
			tapLove() {
				if (this.dataList.length == 0) return
				this.moveX = 10 //设置角度y为0水平
				this.moveY = 1
				this._del()
			},
			tapLoathe() {
				if (this.dataList.length == 0) return
				this.moveX = -10 //设置角度
				this.moveY = 1
				this._del()
			},
			//设置初始参数
			init() {
				this.number = 2 //card 3
				this.translate = {
					x: 0,
					y: 8
				} //y下移10px
				this.scale = {
					x: 0.95,
					y: 1
				} //x 缩小0.9
				this.type = true

				this.moveRotate = {
					//设置位移图片旋转角度距离  card中心点 - 指向坐标
					x: 0,
					y: uni.getSystemInfoSync().screenHeight
				}
			},
			//获取数据
			getData() {
				console.log("开始查询用户列表")
				let self = this;
				let promise;
				Server.get("/user/getUserList", {
					pageIndex: this.pageIndex,
					pageSize: this.pageSize
				}, {
					success: response => {
						console.log("获取到数据:" + response.data.data.rows.length)
						self.cardcount = response.data.data.rows.length;
						if (self.cardcount == 0) {
							self.empty = true;
						} else {
							self.empty = false;
						}
						//debugger
						promise = new Promise((resolve, reject) => {
							let dataGroup = []
							for (var i = 0; i < response.data.data.rows.length; i++) {
								console.log(response.data.data.rows[i].id)
								dataGroup.push({
									src: Vue.prototype.serveraddress + "/" + self.getString(response.data.data.rows[i].firstSelfiePath),
									sex: response.data.data.rows[i].genderId - 2,
									address: self.getString(response.data.data.rows[i].address).replace("市", "") +(response.data.data.rows[i].distanceStr!=null&&response.data.data.rows[i].distanceStr!=''? "(" + self.getString(
										response.data.data.rows[i].distanceStr) + ")":""),
									name: self.getString(response.data.data.rows[i].nickName),
									constellation: self.getString(response.data.data.rows[i].xinzuo),
									number: self.getString(response.data.data.rows[i].imgCount),
									old: self.getString(response.data.data.rows[i].age),
									id: self.getString(response.data.data.rows[i].id),
									latelyTimeStr: self.getString(response.data.data.rows[i].latelyTimeStr)
								})
							}
							this.dataList = [...this.dataList, ...dataGroup]
							resolve()
						})
					},
					warnings: response => {
						//接口调用完成执行 关闭loading

						self.showcancelbutton = false; //修改取消按钮
						self.content = response;
						self.title = "警告";
						self.show = true;
					},
					service: response => {
						//接口调用完成执行 关闭loading

						if (response.data.code == 508) {
							console.log("查询用户列表没有位置信息")
							//没有授权，引导用户打开授权
							self.showcancelbutton = false; //修改取消按钮
							self.content = response.data.msg;
							self.title = "警告";
							self.show = true;
							self.actionoperation = "gotoAppPermissionSetting";
						}

					},
					error: response => {
						//接口调用完成执行 关闭loading

						self.showcancelbutton = false; //修改取消按钮
						self.content = response;
						self.title = "错误";
						self.show = true;
					}
				}, false)
				//接口调用完成执行 关闭loading

				return promise
			},
			//触摸中判断
			moveJudge(x, y, ratio) {
				let el = this.$refs.cardBox[0]
				if (x > 20) {
					el.moveRight(ratio)
				} else if (x < -20) {
					el.moveLeft(ratio)
				} else {
					el.moveCenter()
				}

			},
			//触摸结束判断
			endJudge(x, y) {
				let el = this.$refs.cardBox[0]
				if (Math.abs(x) < 40) {
					this._back()
					el._back()
				} else {
					Server.get("/user/getBalance", {}, {
						success: response => {
							this._del()
							el.clearAnimation()
						},
						service: response => {
							this._back()
							el._back()
							this.actionoperation = "addvip";
							this.showcancelbutton = true //修改取消按钮
							this.content = response.data.msg;
							this.title = "权限不足";
							this.confirmtext = "立刻升级";
							this.canceltext = "再看看";
							this.show = true;
						},
						warnings: response => {
							this._back()
							el._back()
							this.showcancelbutton = false
							this.content = response;
							this.title = "警告";
							this.show = true;
						},
						error: response => {
							this._back()
							el._back()
							this.showcancelbutton = false
							this.content = response;
							this.title = "错误";
							this.show = true;
						}
					}, false)


				}
			},
			//删除card时
			delCard(x, y) {
				console.log("删除卡片时")
				for (var i = 0; i < this.dataList.length; i++) {
					console.log(this.dataList[i].id)
				}
				if (x > 0) {
					this.matching(true, this.dataList[0].id);
					this.chatusername=this.dataList[0].name;
					console.log(this.dataList[0].name, '喜欢')
				} else {
					this.matching(false, this.dataList[0].id);
					console.log(this.dataList[0].id, '不喜欢')
				}
			},
			tapCard(item) {
				console.log(item, '点击')
				/* uni.navigateTo({
					url: '/pages/profile/index?userId=' + item.id
				}) */
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=' + item.id+'&iqnorevip=true'
				})
				
			},
			matching(attitude, useridb) {
				Server.post("/user/matching", {
					attitude: attitude,
					userIdB: useridb
				}, {
					success: response => {
						console.log("入库结束")
						if (response.data.data.result == true) {
							this.showcancelbutton = true;
							this.content = "你们相互喜欢了,是否立刻开启聊天";
							this.title = "太赞了"
							this.confirmtext = "开始聊天";
							this.canceltext = "再看看";
							this.show = true;
							this.actionoperation="tochat";
							this.chatuseridA=response.data.data.userIdA;
							this.chatuseridB=response.data.data.userIdB;
						}
					},
					service: response => {
						this.showcancelbutton = false //修改取消按钮
						this.content = response.data.msg;
						this.show = true;
					},
					warnings: response => {
						this.showcancelbutton = false
						this.content = response;
						this.title = "警告";
						this.show = true;
					},
					error: response => {
						this.showcancelbutton = false
						this.content = response;
						this.title = "错误";
						this.show = true;
					}
				}, false)
			},
			confirm() {
				let self = this;
				console.log("点击了确认")
				if (self.actionoperation == "gotoAppPermissionSetting") {
					//引导用户授权
					uni.getLocation();
				}
				if (self.actionoperation == "addvip") {
					uni.navigateTo({
						url: '/pagesC/memberCenter/memberCenter?level=1'
					});
				}
				if (self.actionoperation == "tochat")
				{
					self.toChat(self.chatuseridA,self.chatuseridB);
				}
				
				self.actionoperation = ""; //置空防止干扰
			},
			cancel() {
				console.log("点击了取消")
			},
			getString(data) {
				if (data == null || data == undefined) {
					return "";
				}
				return data;
			},
			toChat(userId, sendUserId) {
			  // uni.navigateTo({
			  // 	url: '/pages/HM-chat/HM-chat?id='+id+'&nickName='+nickName
			  // });
			  uni.navigateTo({
			    url: "/pagesB/HM-chat/HM-chat?userId="+userId+"&nickName="+this.chatusername+"&sendUserId="+sendUserId,
			  });
			}
		}
	}
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: 'iconfont';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.iconfont {
		font-family: 'iconfont' !important;
		font-size: 12px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-xinaixin:before {
		content: '\e601';
	}

	.icon-chacha1:before {
		content: '\e646';
	}

	.page {
		width: 100%;
		position: absolute;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.move-area {
		position: absolute;
	}

	.move-view {
		// width: 100vw;
		// height: calc(100vh - 50px);
		position: absolute;
		left: 50%;
		top: 50%;
	}

	.cardBox {
		position: relative;
		width: 100%;
		height: 100%;
		// width: 100vw;
		// height: calc(100vh - 50px);
	}

	.love {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		top: 10rpx;
		left: 10rpx;
		border-radius: 50%;
		background-color: #ea2a36;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
		color: #ffffff;
	}

	.loathe {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		top: 10rpx;
		right: 10rpx;
		border-radius: 50%;
		background-color: #a09e9f;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
		color: #ffffff;
	}
</style>
