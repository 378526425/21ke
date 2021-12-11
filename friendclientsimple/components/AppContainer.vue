<template>
  <view>
    <view
      class="header"
      :style="{
        height: (headerHeight || statusBarHeight + 50) + 'px',
        backgroundColor: headerBgColor
      }"
    >
      <view class="title" :style="{ paddingTop: statusBarHeight + 'px' }">
        <image
          v-if="hasBackBtn"
          class="back_icon"
          :src="require('@/static/icon/back_icon.png')"
          @click="pageBack"
        />
        <text>{{ title }}</text>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    hasBackBtn: {
      type: Boolean,
      default: false
    },
    headerBgColor: {
      type: String,
      default: '#FE7E97'
    },
    headerHeight: {
      type: Number,
      default: 0
    }
  },
  computed: {
    statusBarHeight() {
      const { statusBarHeight } = getApp().globalData
      return statusBarHeight
    },
    pageBack() {
      uni.navigateBack()
    }
  }
}

// @Component
// export default class AppContainer extends Vue {
//   @Prop({ default: '', type: String }) title!: string
//   @Prop({ type: Boolean, default: false }) hasBackBtn!: boolean
//   @Prop({ type: String, default: '#FE7E97' }) headerBgColor!: string
//   @Prop({ type: Number, default: 0 }) headerHeight!: number
//   get statusBarHeight() {
//     const { statusBarHeight } = getApp().globalData as any
//     return statusBarHeight
//   }

//   pageBack() {
//     uni.navigateBack()
//   }
// }
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;

  > .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 36upx;
    color: #fff;

    > .back_icon {
      position: absolute;
      left: 20upx;
      height: 40upx;
      width: 40upx;
    }
  }
}
</style>
