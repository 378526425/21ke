<template>
  <scroll-view>
    <!-- <swiper class="swiper-top" :circular="true">
      <swiper-item class="swiper-item-top">
        <image
          class="img"
          src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1170509971,3861269768&fm=26&gp=0.jpg"
        />
      </swiper-item>
      <swiper-item class="swiper-item-top">
        <image
          class="img"
          src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1816366408,1729518576&fm=26&gp=0.jpg"
        />
      </swiper-item>
    </swiper> -->

   <!-- <view class="filter-list">
      <view class="wrapper">
        <uni-collapse class="my-uni-collapse" accordion="true">
          <uni-collapse-item
            title="全部联系人"
            titleClass="my-collapse-item-title"
            :showAnimation="true"
          >
            <text class="count" slot="icon">11</text>
            <view class="filter-item">
              <image
                class="count-icon"
                :src="require('@/static/icon/friend.png')"
              />
              <view class="right">
                <text>全部好友</text>
              </view>
            </view>
            <view class="filter-item">
              <image
                class="count-icon"
                :src="require('@/static/icon/beckoning.png')"
              />
              <view class="right">
                <text>相互心动</text>
              </view>
            </view>
            <view class="filter-item">
              <image
                class="count-icon"
                :src="require('@/static/icon/star.png')"
              />
              <view class="right">
                <text>星标好友</text>
              </view>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </view>
    </view> -->

    <view class="message-list">
      <template v-if="messagelist && messagelist.length > 0">
        <view
          v-for="item in messagelist"
          :key="item.id"
          @tap="toChat(item.userId, item.nickName, item.sendUserId)"
          class="row message-item"
        >
          <view class="avatar left">
			 <!-- <u-avatar :src="geturl(item.headPortrait)" mode="circle"></u-avatar> -->
            <image class="img" :src="geturl(item.headPortrait)" />
          </view>
          <view class="right">
            <view>
              <view class="title">
                <text class="name">{{ item.nickName }}</text>
                <!-- <text class="offical-flag">官方</text> -->
              </view>
              <view class="message">
			  <!-- 文字消息 -->
			  <view class="richtext" v-if="item.messageContentViewModel!=null&&item.messageContentViewModel.messageFormat!=null&&(item.messageContentViewModel.messageFormat=='text'||item.messageContentViewModel.messageFormat=='blog'||item.messageContentViewModel.messageFormat=='matching'||item.messageContentViewModel.messageFormat=='praise')">
				<rich-text :nodes="item.messageContentViewModel.messageContent" ></rich-text>
			  </view>
			  <view class="richtext" v-else-if="item.messageContentViewModel!=null&&item.messageContentViewModel.messageFormat!=null&&item.messageContentViewModel.messageFormat=='emoji'">
			  	<rich-text :nodes="item.messageContentViewModel.times" ></rich-text>
			  </view>
			  <view class="richtext" v-else-if="item.messageContentViewModel!=null&&item.messageContentViewModel.messageFormat!=null&&item.messageContentViewModel.messageFormat=='img'">
			  	图片
			  </view>
			  <view class="richtext" v-else-if="item.messageContentViewModel!=null&&item.messageContentViewModel.messageFormat!=null&&item.messageContentViewModel.messageFormat=='voice'">
			  	语音
			  </view>
			  <view class="richtext" v-else-if="item.messageContentViewModel!=null&&item.messageContentViewModel.messageFormat!=null&&item.messageContentViewModel.messageFormat=='game'">
			  	有人邀请了你的组局
			  </view>
			  <view class="richtext" v-else>
			  	我们相互喜欢了,快和我聊天吧
			  </view>
			    </view>
            </view>
            <view class="attrbox">
              <text class="time">{{ item.latelyTimeStr }}</text>
              <view v-if="item.unreadCount > 0" class="star-wrapper">{{
                item.unreadCount
              }}</view>
            </view>
          </view>
        </view>
      </template>
      <template v-else-if="empty==true">
        <y-Empty emptyText="还没有任何消息" />
      </template>
    </view>
  </scroll-view>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import uniCollapse from "@/components/uni-collapse/uni-collapse.vue";
import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue";
import Vuee from 'vue';
export default {
  name: "Message",
  components: {
    uniCollapse,
    uniCollapseItem,
  },
  props: {
    messagelist: {
      type: Array,
      default: [],
    },
	empty:{
		type: Boolean,
		default: false,
	}
  },
  data() {
    return {};
  },
  // 下拉刷新
  methods: {
    change() {},
    toChat(userId, nickName, sendUserId) {
      // uni.navigateTo({
      // 	url: '/pages/HM-chat/HM-chat?id='+id+'&nickName='+nickName
      // });
      uni.navigateTo({
        url: "/pagesB/HM-chat/HM-chat?userId="+userId+"&nickName="+nickName+"&sendUserId="+sendUserId,
      });
    },
	geturl(url) {
		return Vuee.prototype.serveraddress + "/" + url;
	}
  },
};

// @Component({
//   components: {
//     uniCollapse,
//     uniCollapseItem
//   }
// })
// export default class Message extends Vue {
//   change() {}
// }
</script>

<style lang="less" scoped>
@import "../../../styles/app.less";

.full-height {
  height: 100vh;
}
.row {
  display: flex;
  align-items: center;
}

.filter-list {
  position: relative;
  margin-left: 20upx;
  margin-right: 20upx;
  font-size: 30upx;
  margin-top: 40upx;
  margin-bottom: 40upx;
  min-height: 70upx;

  .wrapper {
    // height: 70upx;
    overflow: hidden;
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    box-shadow: 0upx 0upx 20upx #ecf0f1;
    border-radius: 50upx;

    .my-uni-collapse {
      /deep/ .my-collapse-item-title {
        height: 70upx;
      }

      .count,
      .count-icon {
        display: inline-block;
        color: #ffffff;
        border-radius: 50%;
        width: 40upx;
        height: 40upx;
        line-height: 40upx;
        text-align: center;

        margin-right: 20upx;
      }

      .count {
        background-color: @primary-color;
      }
    }

    .filter-item {
      // padding: 20upx;
      // margin: 0 20upx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:first-child {
        .right {
          border-top: 1upx solid #ecf0f1;
        }
      }

      .right {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1upx solid #ecf0f1;
      }

      .img {
        height: 20upx;
        width: 30upx;
      }
    }
  }
}

.message-list {
  padding: 0 20upx;
  margin-top: 30upx;
}

.message-item {
  margin-top: 10upx;
 border-bottom: 1upx solid #ecf0f1;
  > .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100upx;
    width: 100upx;
    border: 1upx solid #f96f9c;
    border-radius: 50%;
    overflow: hidden;

    > .img {
      height: 90upx;
      width: 90upx;
      border-radius: 50%;
      overflow: hidden;
    }

    > .bell-icon {
      height: 50upx;
      width: 50upx;
    }
  }

  > .right {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 20upx;
   
    height: 140upx;

    .add-wx-btn {
      color: #fff;
      font-size: 24upx;
      padding: 5upx 10upx;
      border-radius: 20upx;
      background-color: @primary-color;
    }

    .attrbox {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .time {
      font-size: 24upx;
      color: #cccccc;
      margin-bottom: 4upx;
    }

    .star-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fe7e97;
      font-size: 24upx;
      color: #fff;
      height: 30upx;
      width: 30upx;
      border-radius: 50%;
    }

    .title {
      display: flex;
      align-items: center;

      .name {
        &.official {
          color: @primary-color;
        }

        font-size: 24upx;
      }

      .offical-flag {
        font-size: 15upx;
        border: 1px solid @primary-color;
        color: @primary-color;
        padding: 5upx 10upx;
        border-radius: 10upx;
        margin-left: 10upx;
      }
    }

    .message {
      font-size: 20upx;
      color: #cccccc;
	 margin-top: 15upx;
    }
  }
}

.swiper-top {
  padding: 0 20upx;
  height: 120upx;
  border-radius: 10upx;
  overflow: hidden;

  .swiper-item-top {
    > .img {
      width: 100%;
    }
  }

}
.richtext{
	max-width: 400upx;
	overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
</style>
