<template>
	<view>
		<u-navbar :is-back="true" title="详情" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#fe7e97'}"> 
		 <view style="margin-right: 24rpx;" @click="popupshow=true" slot="right">
		 	<u-icon name="more-dot-fill" size="40" color="#fff"></u-icon>
		 </view>
		 </u-navbar>
<u-popup v-model="popupshow"  mode="bottom">
		<view @click="jubao" class="close-btn">
			举报
		</view>
	</u-popup>
		<view class="detail-wrap">
			<view class="item-head">
				<view class="left-info">
					<view class="flex-center" @tap="toOthers(detail.userId)">
						<u-avatar :src="geturl(detail.headPortrait)" mode="circle" :showSex="true" :sex-icon="detail.gender"
						 :sex-bg-color="detail.sexbgColor"></u-avatar>
					</view>
					<view class="head-name" @tap="toOthers(detail.userId)">{{ detail.nickName }}</view>
				</view>
				<view :class="['follow-btn flex-center','followed']" @tap="toOthers(detail.userId)">ta的主页</view>
			</view>
			<view v-if="imglength>0" class="swiper-wrap">
				<swiper class="swiper-box" @change="swiperChange">
					<swiper-item v-for="(item, index) in detail.imgList" :key="index" class="swipers flex-center">
						<image :src="geturl(item.url)" mode="widthFix" @tap="ViewImage(index, detail.imgList)" class="img"></image>
					</swiper-item>
				</swiper>
				<div class="custom-indicator flex-center">{{ current+1 }} / {{imglength}}</div>
			</view>
			<view class="content-box" v-html="detail.textContent"></view>
			<view class="bottom-time">
				<text>{{detail.publishTime}}</text>
			</view>
			<view class="comment-wrap">
				<view class="scroll-wrap">
					<view v-if="detail.commentCount!=null" class="top-num padding-tb">共{{detail.commentCount}}条评论</view>
					<template v-if="commentList && commentList.length > 0">
						<view class="comment-item margin-bottom-lg" v-for="(item, index) in commentList" :key="index">
							<view @tap="toOthers(item.userId)" class="left-avatar">
								<u-avatar :src="geturl(item.userHeadPortrait)" mode="circle" size="mini"></u-avatar>
								<!-- <image class="avatar" :src="geturl(item.userHeadPortrait)" mode="widthFix"></image> -->
							</view>
							<view class="right-box">
								<view class="right-mine">
									<view class="right-top">
										<view class="reply">
											<p @tap="toOthers(item.userId)" class="title">
												{{ item.userNickName }}
												<text v-if="detail.userId==item.userId" class="author">作者</text>
											</p>
											<text v-if="item.replyNickName!=null" class="padding-lr-xs">回复</text>
											<u-avatar @tap="toOthers(item.replyId)" v-if="item.replyHeadPortrait!=null" :src="geturl(item.replyHeadPortrait)" mode="circle" size="40"></u-avatar>
											<p @tap="toOthers(item.replyId)" v-if="item.replyNickName!=null" class="title active">{{ item.replyNickName }}</p>
											<text @tap="toOthers(item.replyId)" v-if="detail.userId==item.replyId" class="author">作者</text>
										</view>
									</view>
									<p @tap="commmonreply(item.userId,item.userNickName)" class="content">{{ item.content }}</p>
									<text class="time">{{item.commentTime}}</text>
									<text class="time" v-if="logininuserid==item.userId||logininuserid==detail.userId" @tap="deletecommon(item.id)"
									 style="float: right;margin-top: 13rpx;">删除</text>
								</view>
							</view>
						</view>
						<view v-if="showmore" class="commentmore" @tap="morecommon()"> 更多评论</view>
					</template>
					<template v-else-if="empty==true">
						<view class="flex-center margin">
							<y-Empty emptyText="还没有任何评论" />
						</view>
					</template>
				</view>
			</view>
			<view class="comment-input">
				<input type="text" v-model="commentVal" @blur="blur" :focus="isfocus" class="top-input" placeholder="说点什么吧..." />
				<view class="send-btn" @tap="addCommon">发送</view>
			</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#fe7e97'}"
			 :show-cancel-button="iscancel" @confirm="confirm"></u-modal>
		</view>
	</view>

</template>

<script>
	var that;
	import Vue from 'vue'
	import Server from "@/common/serverutil.js";
	export default {
		data() {
			return {
				detailId: '',
				commentVal: '',
				current: 0,
				imglength: 0,
				commentList: [],
				detail: {},
				pageIndex: 1,
				pageSize: 10,
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				replyid: "",
				replyname: "",
				showmore: true,
				logininuserid: "",
				iscancel: false,
				operator: "",
				deletecommonid: "",
				isfocus: false,
				empty:false,
				popupshow:false
			};
		},
		onLoad(options) {
			that = this;
			if (options && options.id) {
				that.detailId = options.id;
				this.initdata();
			}


			// 分享微信好友和朋友圈
			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif

			uni.getStorage({
				key: 'loginuserinfo',
				success: function(res) {
					that.logininuserid = res.data.user.id; //当前登录用户的id
				}
			});
		},

		methods: {
			ViewImage(index, arr) {
				let list = [];
				for (let i = 0; i < arr.length; i++) {
					list.push(this.geturl(arr[i].url));
				}
				uni.previewImage({
					current: index,
					urls: list
				});
			},
			addCommon() {
				let self = this;
				if (that.commentVal.indexOf(that.replyname) != -1) {
					that.commentVal = that.commentVal.replace(that.replyname, "");
				} else {
					that.replyid = "";
				}
				//发布评论
				Server.post("/blog/addComment", {
					"blogId": that.detailId,
					"content": that.commentVal,
					"replyId": that.replyid,
				}, {
					success: response => {
						//发表成功后重新加载评论
						that.pageIndex = 1;
						Server.get("/blog/getBlogComment", {
							"blogId": that.detailId,
							"pageIndex": that.pageIndex,
							"pageSize": that.pageSize
						}, {
							success: response => {
								that.commentVal = '';
								that.commentList = response.data.data.rows;
								that.detail.commentCount = response.data.data.total;
								if (response.data.data.rows.length < that.pageSize) {
									that.showmore = false; //不显示加载更多按钮
								} else {
									that.showmore = true
								}
								if(response.data.data.total==0)
								{
									that.empty=true;
								}else{
									that.empty=false;
								}
							},
							warnings: response => {
								that.modelcontent = response;
								that.modeltitle = "警告";
								that.modelshow = true;
							},
							error: response => {
								that.modelcontent = response;
								that.modeltitle = "错误";
								that.modelshow = true;
							}
						})
					},
					warnings: response => {
						//接口调用完成执行 关闭loading
						uni.hideLoading();
						self.modelcontent = response;
						self.modeltitle = "警告";
						self.modelshow = true;
					},
					error: response => {
						//接口调用完成执行 关闭loading
						uni.hideLoading();
						self.modelcontent = response;
						self.modeltitle = "错误";
						self.modelshow = true;
					}
				})

			},
			swiperChange(e) {
				this.current = e.detail.current;
			},
			toOthers(userid) {
				uni.navigateTo({
					url: '/pagesA/userinfo/userinfo?userId=' + userid
				})
			},
			handleFollow(id) {
				let that = this;
				that.detail.follow = !that.detail.follow;
			},
			geturl(url) {
				return Vue.prototype.serveraddress +"/"+ url;
			},
			morecommon() {
				that.pageIndex = that.pageIndex + 1;
				//加载评论
				Server.get("/blog/getBlogComment", {
					"blogId": that.detailId,
					"pageIndex": that.pageIndex,
					"pageSize": that.pageSize
				}, {
					success: response => {
						if (response.data.data.rows.length > 0) {
							that.commentList = that.commentList.concat(response.data.data.rows);
						} else {
							that.showmore = false; //不显示加载更多按钮
							that.modelcontent = "没有更多评论了";
							that.modeltitle = "提示";
							that.modelshow = true;
						}
						if (response.data.data.rows.length < that.pageSize) {
							that.showmore = false; //不显示加载更多按钮
						}
						if(response.data.data.total==0)
						{
							that.empty=true;
						}else{
							that.empty=false;
						}
					},
					warnings: response => {
						that.modelcontent = response;
						that.modeltitle = "警告";
						that.modelshow = true;
					},
					error: response => {
						that.modelcontent = response;
						that.modeltitle = "错误";
						that.modelshow = true;
					}
				})
			},
			commmonreply(reid, rename) {
				that.replyid = reid;
				that.replyname = "回复@" + rename + ":";
				that.commentVal = "回复@" + rename + ":";
				if (that.isfocus == false) {
					that.isfocus = true;
				}
			},
			deletecommon(id) {
				that.modelcontent = "你确定要删除这条评论吗？";
				that.modeltitle = "提示";
				that.iscancel = true;
				that.modelshow = true;
				that.operator = "deletecommon";
				that.deletecommonid = id;
			},
			initdata() {
				//加载动态
				Server.get("/blog/getBlogById/" + that.detailId, {}, {
					success: response => {
						that.detail = response.data.data
						that.imglength = that.detail.imgList.length;
						that.detailId = that.detail.id
					},
					warnings: response => {
						that.modelcontent = response;
						that.modeltitle = "警告";
						that.modelshow = true;
					},
					error: response => {
						that.modelcontent = response;
						that.modeltitle = "错误";
						that.modelshow = true;
					}
				})
				//加载评论
				Server.get("/blog/getBlogComment", {
					"blogId": that.detailId,
					"pageIndex": that.pageIndex,
					"pageSize": that.pageSize
				}, {
					success: response => {
						that.commentList = response.data.data.rows;
						if (response.data.data.rows.length < that.pageSize) {
							that.showmore = false; //不显示加载更多按钮
						} else {
							that.showmore = true;
						}
						if(response.data.data.total==0)
						{
							that.empty=true;
						}else{
							that.empty=false;
						}
					},
					warnings: response => {
						that.modelcontent = response;
						that.modeltitle = "警告";
						that.modelshow = true;
					},
					error: response => {
						that.modelcontent = response;
						that.modeltitle = "错误";
						that.modelshow = true;
					}
				})

			},
			confirm() {
				if (that.operator == "deletecommon") {
					//删除动态
					Server.delete("/blog/deleteComment/" + that.deletecommonid, {}, {
						success: response => {
							that.pageIndex = 1;
							that.commentList = [];
							//重新加载评论
							that.initdata();
						},
						warnings: response => {
							that.modelcontent = response;
							that.modeltitle = "警告";
							that.iscancel = false;
							that.modelshow = true;
						},
						error: response => {
							that.modelcontent = response;
							that.modeltitle = "错误";
							that.iscancel = false;
							that.modelshow = true;
						}
					})
				}
			},
			blur() {
				if(that.isfocus ==true)
				{
					that.isfocus = false;
				}
				
			},
			jubao()
			{
				uni.navigateTo({
					url: "/pagesG/jubao/jubao"
				});
			}
		},


	};
</script>

<style lang="less" scoped>
	.detail-wrap {
		background-color: #ffffff;
		padding: 0rpx 0 100rpx;

		.item-head {
			display: flex;
			align-items: center;
			padding: 20rpx 40rpx;
			width: 100%;
			justify-content: space-between;
			border-bottom: 1rpx solid var(--mainColor);
			position: relative;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			background-color: #fff;
			height: 120rpx;

			.left-info {
				display: flex;
				align-items: center;

				.img-wrap {
					width: 80rpx;
					height: 80rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
					}
				}

				.head-name {
					padding-left: 40rpx;
					color: #666666;
					font-size: 32rpx;
				}
			}

			.follow-btn {
				width: 140rpx;
				height: 60rpx;
				border: 1rpx solid var(--mainColor);
				color: var(--mainColor);
				border-radius: 40rpx;
			}

			.followed {
				/* color: #fff;
				background: var(--activeColor); */
				border: 1rpx solid #fe7e97;
			}
		}

		.swiper-wrap {
			position: relative;

			.swiper-box {
				margin: 0rpx 0 40rpx;
				height: 600rpx;
				background-color: #cccccc;
			}

			.custom-indicator {
				position: absolute;
				right: 10px;
				top: 10px;
				background: rgba(0, 0, 0, 0.5);
				padding: 3px 5px;
				border-radius: 12px;
				color: #fff;
			}
		}

		.content-box {
			padding: 0 40rpx;
			font-size: 32rpx;
			line-height: 50rpx;
			margin-top: 30rpx;
		}

		.bottom-time {
			padding: 20rpx 40rpx;
			font-size: 24rpx;
			color: #999999;
		}

		.comment-wrap {
			background-color: #fff;
			padding: 0 40rpx 40rpx;

			.scroll-wrap {
				height: 100%;
				border-top: 1rpx solid var(--mainColor);
			}

			.comment-item {
				display: flex;
				justify-content: space-between;

				.left-avatar {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					overflow: hidden;
					border: 1rpx solid #ECECEC;

					.avatar {
						width: 100%;
					}
				}

				.right-box {
					margin-left: 20rpx;
					flex: 1;

					.right-mine {
						padding: 20rpx;
						background-color: #f5f8f9;
						border-radius: 10rpx;
						flex: 1;
					}

					.right-top {
						display: flex;
						justify-content: space-between;

						.reply {
							display: flex;
							font-size: 28rpx;
						}

						.active {
							color: var(--activeColor) !important;
						}




					}

					.content {
						padding: 10rpx 0;
					}
				}
			}
		}

		.comment-input {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;
			padding: 20rpx 40rpx;
			border-top: 1rpx solid #ECECEC;

			.top-input {
				width: 100%;
				height: 60rpx;
				display: flex;
				align-items: center;
				padding: 0 40rpx;
				background-color: #f5f5f5;
				color: #000;
				border-radius: 80rpx;
				flex: 1;
			}

			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60rpx;
				width: 140rpx;
				margin-left: 20rpx;
				border-radius: 40rpx;
				border: 1rpx solid var(--activeColor);
				color: var(--activeColor);
				background-color: #ffffff;
			}
		}
	}

	.author {
		background-color: var(--activeColor);
		color: #ffffff;
		padding: 0 8rpx;
		margin-left: 10rpx;
		border-radius: 6rpx;
	}

	.time {
		color: #999;
		font-size: 19rpx;
	}

	.commentmore {
		text-align: right;
		color: #fe7e97;
	}
	.close-btn {
		text-align: center;
		padding:30rpx;
	}
</style>
