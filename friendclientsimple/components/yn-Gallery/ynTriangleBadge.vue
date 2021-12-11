<!-- 三角角标组件 -
use:
   <ynTriangleBadge width="60" height="60" text="金8" bgcolor="green" fontsize="12"></ynTriangleBadge>
-->
<template>
  <!-- 定义三角面板，包含2个元素 三角绘制和文字 -->
  <view
    class="trianglePanel"
    :style="{
      'max-width': width + 'px',
      'min-width': width + 'px',
      'max-height': height + 'px',
      'min-height': height + 'px'
    }"
  >
    <view
      class="triangle-topright"
      :style="{
        'border-top': height + 'px solid ' + bgcolor,
        'border-left': width + 'px solid transparent'
      }"
    ></view>
    <!-- 用margin-left重叠三角 -->
    <view
      class="textbox"
      :style="{
        width: width * 0.5 + 'px',
        height: height * 0.5 + 'px',
        'font-size': fontsize + 'px',
        'margin-left': width * -0.5 + 'px'
      }"
    >
      {{ text }}
    </view>
  </view>
</template>

<script>
export default {
  //组件名称  非必须
  name: 'ynTriangleBadge',
  props: {
    //组件背景颜色
    bgcolor: {
      type: String,
      default: 'blue'
    },
    width: {
      type: String,
      default: '50'
    },
    height: {
      type: String,
      default: '50'
    },
    text: {
      type: String,
      default: 'N'
    },
    // 一般字体大小是12px 网页端不能再小了  移动端可以再小 可以显示出来
    fontsize: {
      type: String,
      default: '12'
    }
  },
  data() {
    return {}
  },
  methods: {},
  created: function() {},
  // computed相当于属性的一个实时计算
  computed: {}
}
</script>

<style>
.trianglePanel {
  display: flex;
  align-self: flex-end;
  color: white;
  /* border: red 1px solid; */
}

.textbox {
  align-self: flex-start;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  margin: 1px;
  /* 字符空格不忽略 */
  white-space: pre;
  word-break: break-all;
}

/* 右上三角	上 左有宽度  下 右 无宽度 */
.triangle-topright {
  /*   top:0;
   left:0; */
  z-index: 0;
  width: 0;
  height: 0;
}
</style>
