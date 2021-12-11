<!-- ynGallery 画廊组件 -->
<template>
  <view class="ynGalleryPanel">
    <image :src="currentImg" class="current-img" mode="aspectFill"></image>
    <view
      class="gallerypanel"
      style="filter:brightness(1);border-radius:1upx"
      blurEffect="light"
      :style="{
        height: galleryheight + 'px',
        width: '100%'
      }"
    >
      <scroll-view
        class="scroll-view"
        scroll-x="true"
        scroll-with-animation="true"
        :scroll-into-view="toview"
        :scroll-left="scrollLeft"
        @scroll="scroll"
      >
        <!-- scroll-view-panle 容纳左右空块+中间img块 -->
        <view
          class="scroll-view-panle"
          @touchend="touchEndHandle"
          @touchstart="touchStartHandle"
          @touchmove="touchMoveHandle"
        >
          <!-- 左侧留空 必须用min-width属性 用width属性无效-->
          <view
            class="leftview"
            :style="{
              'min-width': sviewlst.leftview.w + 'px',
              height: galleryheight + 'px'
            }"
          ></view>
          <!-- 中间图像横向列表 ==-->
          <!-- 外层 高度与画廊高度一样 -->
          <view
            :id="'imgviewpanel' + index"
            :ref="'imgviewpanel' + index"
            :class="[activeviewindex == index ? 'trans-fadeout' : '']"
            @animationstart="animationstartHandle"
            @animationend="animationendHandle"
            v-for="(item, index) in sviewlst.imgsview"
            :key="index"
            :style="{ width: item.w + 'px', height: galleryheight + 'px' }"
            style="border: #BB6622 0px solid;display:flex;flex-direction: column;align-content:center;justify-content: flex-end;"
          >
            <!-- 内层 高度是图片容器的高度 -->
            <!-- 顶部圆角角标 -->
            <view
              v-if="showbadge && badegtype == 'round'"
              class="roundbadge"
              :style="{ background: [index % 2 == 0 ? 'red' : 'green'] }"
            >
              <text> {{ item.badeg }}</text>
            </view>
            <!-- 图片框 居中属性-->
            <view
              class="img-wrapper"
              style="display:flex; align-content:flex-end;justify-content: center;order-radius: 20px;overflow: hidden;"
              :style="{
                width: imgviewwidth + 'px',
                height: imgviewheight + 'px'
              }"
            >
              <image
                :ref="'image' + index"
                style="align-self: center;border-radius: 1px; "
                :style="{
                  width: item.w - 10 + 'px',
                  height: item.h - 10 + 'px'
                }"
                :src="item.url"
                @click="clickimg(index, item)"
                mode="scaleToFill"
              >
              </image>
            </view>
            <!-- 描述视图 -->
            <!-- <view
              style="display: flex;justify-content: center;margin-bottom: 4px;border:  #008000 0px solid;min-height: 10px;"
            >
            </view> -->
          </view>
          <!-- 右侧留空  必须用min-width属性 用width属性无效-->
          <view
            class="rightview"
            :style="{
              'min-width': sviewlst.rightview.w + 'px',
              height: galleryheight + 'px'
            }"
          ></view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import ynTriangleBadge from './ynTriangleBadge.vue'
export default {
  components: {
    ynTriangleBadge
  },
  name: 'ynGallery',
  props: {
    //背景起始色
    bkstart: {
      type: [String],
      default: '#000000'
    },
    // 背景结束色
    bkend: {
      type: [String],
      default: '#000000'
    },
    // 画廊高度 单位px
    galleryheight: {
      type: [Number, String],
      default: 165 * 1.0
    },
    //图像源对象列表
    images: {
      type: Array
    },
    //图像容器宽度
    imgviewwidth: {
      type: [Number],
      default: parseInt(170 * 0.5)
    },
    //图像容器高度
    imgviewheight: {
      type: [Number],
      default: parseInt(235 * 0.45)
    },
    showbadge: {
      type: [Boolean],
      default: false
    },
    showdec: {
      type: [Boolean],
      default: false
    },
    badegtype: {
      type: [String],
      default: 'trian' //round trian
    },
    badegwidth: {
      type: [String],
      default: '25'
    },
    badegheight: {
      type: [String],
      default: '25'
    }
  },

  data() {
    return {
      //bkstart bkend不能在组件内赋值 该元素做中转
      bkstartcolor: this.bkstart,
      bkendcolor: this.bkend,

      badegcolor: 'red',
      // 定时器 用来判断滑动是否结束
      TTT: null,
      // 这个变量用来判断是否进行了滑动操作
      istouchmove: false,
      // 手指是否离开了屏幕
      isEndTouch: true,
      // 屏幕中心点
      screencenterpos: 0,
      //当前焦点view块index序
      activeviewindex: 0,
      //焦点图中间点与屏幕中间点的偏移，通常不滑动的时候，焦点图总是显示在中间，且图的中间点总是与屏幕中间重合
      offset: 0,
      //这个用来定位具体的位置
      scrollLeft: 0,
      //当前距离左边的距离
      newleft: 0,
      //上一次距离左边的距离
      oldleft: {
        scrollleft: 0
      },
      //滚动组件内视图块数据定义
      sviewlst: {
        leftview: {}, //左则空块
        rightview: {}, //右侧空块
        imgsview: [] //中间image图像数组块
      },
      toview: 'viewitem0'
    }
  },
  created: function() {
    if (this.images.length > 0) {
      this.screencenterpos = parseInt(uni.upx2px(750) / 2)
      this.upDataScrollviewLayout(this.activeviewindex)
    }
    // console.log=()=>{};
  },
  mounted: function() {},
  watch: {
    async images() {
      var that = this
      console.log('watch监控到images属性变化')
      this.screencenterpos = parseInt(uni.upx2px(750) / 2)
      console.log('屏幕中点pos位置:' + this.screencenterpos + 'px')
      this.upDataScrollviewLayout(this.activeviewindex)
    }
  },
  computed: {
    // 返回径向渐变样式值 用来设置背景  如果定义了每个image的主色（domiant）则会设置该主色作为径向渐变的起始色
    bkstyle() {
      return `radial-gradient(circle,${this.bkstartcolor}, ${this.bkendcolor})`
    },
    currentImg() {
      return this.images[this.activeviewindex].url
    }
  },
  methods: {
    SetBkRightAnimate: function(startcolor) {
      var that = this
      var nums = 10
      //取2个颜色之间的过渡色
      var colorarr = this.gradientColor(startcolor, this.bkendcolor, nums)
      // console.log(colorarr)
      let num = 10
      //渐显
      var i = setInterval(function() {
        that.bkstartcolor = colorarr[num - 1]
        num--
        //0=最亮  所以这里也可以控制明暗
        if (num < 10 / 2) clearInterval(i)
      }, 50)
    },
    endscroll: function(e) {
      // console.log('endscorll')
    },
    //实时监控scrol位置  计算焦点图中点偏移
    scroll: function(e) {
      // console.log('检测到scroll 被触发......')
      var that = this
      // console.log(e)
      this.newleft = e.mp.detail.scrollLeft
      this.oldleft.scrollleft = this.newleft
      //scroll左边点+屏幕中点 总是随着拖动而变化
      let cenpos = e.mp.detail.scrollLeft + this.screencenterpos
      // console.log('中锚点位置:'+cenpos);
      for (let i in this.sviewlst.imgsview) {
        let item = this.sviewlst.imgsview[i]
        if (item.l <= cenpos && item.r >= cenpos) {
          let imgcpos = item.l + parseInt(item.w / 2)
          let aoffset = cenpos - imgcpos
          this.offset = aoffset
          this.upDataScrollviewLayout(i)
          break
        }
      }
    },

    //$emit 向上传递 所有父或者父父组件会依次接收到emit事件
    clickimg(idx, imgviewobj) {
      this.activeviewindex = idx
      this.scrollLeft =
        this.sviewlst.imgsview[idx].l -
        parseInt(this.screencenterpos) +
        parseInt(this.sviewlst.imgsview[idx].w / 2)
      this.$emit('clickimg', imgviewobj)
    },

    touchStartHandle(e) {
      // 手指按到屏幕
      this.istouchmove = false
      this.isEndTouch = false
    },
    touchMoveHandle(e) {
      // 手指滑动中
      this.istouchmove = true
    },
    touchEndHandle(e) {
      // 手指离开屏幕
      this.isEndTouch = true
    },
    animationstartHandle() {
      // 元素css动画开始事件
      // console.log('animate is start')
    },
    animationendHandle() {
      //渲染背景颜色(right动画)
      let color = this.sviewlst.imgsview[this.activeviewindex].dominant
      //触发背景动画
      this.SetBkRightAnimate(color)
    },

    //更新Scrollview内view块布局
    //offset: 为实现滑动动画效果,需要临近的2张图片做呼吸效果(焦点图逐渐放大缩小,相领的图逐渐缩小放大)，需要这个参数，
    // offset参数在 滑动scrollview的实时回调函数中计算 offset暂时设置为全局变量
    // offset相对于中点偏移,中点左边为负 右边为正 类似于线段图（） 本函数会根据offset和最大放大系数来计算放大系数
    // 焦点图中间点与屏幕中间点的偏移，通常不滑动的时候，焦点图总是显示在中间，且图的中间点总是与屏幕中间重合
    // 当为负的时候,与左边的index 进行互斥放大和缩小,
    // 当为0的时候,当前焦点图放到了最大
    // 当为正的时候,与右边的index 进行互斥放大和缩小
    upDataScrollviewLayout(activeindex) {
      console.log('检测到 initScrollviewLayout', activeindex)
      this.$emit('onIndexChange', activeindex)
      var that = this

      this.upbkcolor = false

      var that = this
      if (this.images.length <= 0) {
        return
      }
      var offset = this.offset

      //一、构造滚动组件内view块分布
      //1、左view块 留空用  为了让第一张图片可以居中
      var lview = {}
      lview.dec = 'left view'
      lview.w = this.screencenterpos
      lview.h = this.imgviewheight
      lview.l = 0
      lview.r = lview.l + lview.w

      //2、处理中间imagelist块
      //2.1、设计默认大小的imageview块布局
      var arrimgview = []
      var i = 0
      while (i <= this.images.length - 1) {
        let obj = {
          index: i,
          url: '', //源
          dec: '', //图像描述信息
          badeg: '', //角标文字
          badegcolor: this.badegcolor, //角标默认颜色
          dominant: this.bkstartcolor, //默认主色
          w: 0, //该view宽度
          h: 0, //该view高度
          l: 0, //该view块左边距scroll容器左边距离
          r: 0 //该view右边距scroll容器左边距离
        }

        //合并外界传来image对象属性 若有重合的属性 后面的覆盖前面
        let imgview = Object.assign(obj, this.images[i])

        //添加长宽等数据
        imgview.w = this.imgviewwidth
        imgview.h = this.imgviewheight

        if (i == 0) {
          imgview.l = lview.r + 0
        } else {
          imgview.l = arrimgview[i - 1].r + 0
        }
        imgview.r = imgview.l + imgview.w

        arrimgview.push(imgview)
        i++
      }

      //3、右边view块  留空用 为了让最后一张图片可以居中
      let rview = {}
      rview.dec = 'right view'
      //使得最后一张图片中间部分对齐屏幕正中间
      rview.w = this.screencenterpos
      rview.h = this.imgviewheight
      if (arrimgview.length <= 0) {
        rview.l = lview.r + 0
      } else {
        rview.l = arrimgview[arrimgview.length - 1].r + 0
      }
      rview.r = rview.l + rview.w

      //二、计算焦点图 焦点图左右临图的放大系数关系 修改相应块的高宽
      var leftaf = 1
      var rightaf = 1
      var activeaf = 1
      var af = 0.18
      //左右临图与焦点图的系数计算（焦点图总是与左临图 或者 右临图发生进退大小关系（2张图的关系 构成视觉动画））
      if (arrimgview.length > 0) {
        let aindex = activeindex
        let lindex = parseInt(aindex) - 1
        let rindex = parseInt(aindex) + 1

        //取焦点imgview块(默认放大1.18倍)）宽度的一半
        let lw = (this.imgviewwidth * 1.18) / 2
        //根据偏移取计算百分比
        let bl = Math.abs(offset) / lw
        // 计算焦点放大系数 默认最大1.18
        if (offset == 0) {
          activeaf = 1.18
          leftaf = 1
          rightaf = 1
        }

        if (offset > 0) {
          activeaf = 1 + 0.18 * (1 - bl / 2)
          rightaf = 1 + (1.18 - activeaf)
          leftaf = 1
        }

        if (offset < 0) {
          activeaf = 1 + 0.18 * (1 - bl / 2)
          leftaf = 1 + (1.18 - activeaf)
          rightaf = 1
        }
        //设置焦点图放大系数
        if (aindex >= 0 && aindex <= arrimgview.length - 1) {
          arrimgview[aindex].w = this.imgviewwidth * activeaf
          arrimgview[aindex].h = this.imgviewheight * activeaf
        } else {
          console.log('焦点图越界')
          return
        }

        //设置左临图 当offset小于0时,当前焦点图与左则相领图做拉扯动画
        if (offset < 0) {
          if (lindex >= 0) {
            arrimgview[lindex].w = this.imgviewwidth * leftaf
            arrimgview[lindex].h = this.imgviewheight * leftaf
          }
        }

        //设置右临图 当offset大于0时,当前焦点图与右则相领图做拉扯动画
        if (offset > 0) {
          if (rindex <= arrimgview.length - 1) {
            arrimgview[rindex].w = this.imgviewwidth * rightaf
            arrimgview[rindex].h = this.imgviewheight * rightaf
          }
        }
      }

      //三、 修正左右边距，lveiw rview视图大小等
      if (arrimgview.length > 0) {
        lview.w = lview.w - arrimgview[0].w / 2
        lview.r = lview.l + lview.w
        for (let i = 0; i <= arrimgview.length - 1; i++) {
          if (i == 0) {
            arrimgview[i].l = lview.r + 0
          } else {
            arrimgview[i].l = arrimgview[i - 1].r + 0
          }
          arrimgview[i].r = arrimgview[i].l + arrimgview[i].w
        }
        rview.w = rview.w - arrimgview[arrimgview.length - 1].w / 2 + 0
        rview.l = arrimgview[arrimgview.length - 1].r + 0
        rview.r = rview.l + rview.w
      }
      //四、更新data数据 因为在template中进行了绑定 根据vue双向数据特性 会更新界面
      var obj = {
        leftview: lview,
        rightview: rview,
        imgsview: arrimgview
      }

      this.activeviewindex = activeindex
      this.sviewlst = obj

      this.$nextTick(function() {
        var that = this
        if (this.istouchmove == true) {
          clearTimeout(that.TTT)
          var ai = that.activeviewindex
          var TTT = setTimeout(function() {
            if (that.activeviewindex == ai) {
              that.$emit(
                'clickimg',
                that.sviewlst.imgsview[that.activeviewindex]
              )
            }
          }, 300)
        }
      })
    },

    /* 取2个颜色之间的过渡色  参考自网络
			// startColor：开始颜色hex
			// endColor  ：结束颜色hex
			// count     : 产生几个    也就是步长
			// sample: colorarr = gradientColor(startcolor,endcolor,5);  生成5个过渡颜色
			*/
    gradientColor(startColor, endColor, count) {
      let startRGB = this.colorToRgb(startColor) //转换为rgb数组模式
      let startR = startRGB[0]
      let startG = startRGB[1]
      let startB = startRGB[2]

      let endRGB = this.colorToRgb(endColor)
      let endR = endRGB[0]
      let endG = endRGB[1]
      let endB = endRGB[2]

      let sR = (endR - startR) / count //总差值
      let sG = (endG - startG) / count
      let sB = (endB - startB) / count

      var colorArr = []
      for (var i = 0; i < count; i++) {
        //计算每一步的hex值
        var hex = this.colorToHex(
          'rgb(' +
            parseInt(sR * i + startR) +
            ',' +
            parseInt(sG * i + startG) +
            ',' +
            parseInt(sB * i + startB) +
            ')'
        )
        colorArr.push(hex)
      }
      return colorArr
    },

    // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
    colorToRgb(sColor) {
      // <http://www.w3.org/TR/css3-color/#svg-color>
      var names = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '0ff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000',
        blanchedalmond: 'ffebcd',
        blue: '00f',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        burntsienna: 'ea7e5d',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '0ff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkgrey: 'a9a9a9',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkslategrey: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dimgrey: '696969',
        dodgerblue: '1e90ff',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'f0f',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        grey: '808080',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred: 'cd5c5c',
        indigo: '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgray: 'd3d3d3',
        lightgreen: '90ee90',
        lightgrey: 'd3d3d3',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslategray: '789',
        lightslategrey: '789',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '0f0',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'f0f',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370db',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'db7093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        rebeccapurple: '663399',
        red: 'f00',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        slategrey: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        wheat: 'f5deb3',
        white: 'fff',
        whitesmoke: 'f5f5f5',
        yellow: 'ff0',
        yellowgreen: '9acd32'
      }
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      var sColor = sColor.toLowerCase()

      //颜色常量转换
      if (sColor.slice(0, 1) != '#') {
        for (var name in names) {
          if (name == sColor) {
            var sColor = '#' + names[name]
          }
        }
      }
      {
        if (sColor && reg.test(sColor)) {
          if (sColor.length === 4) {
            var sColorNew = '#'
            for (var i = 1; i < 4; i += 1) {
              sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
            }
            sColor = sColorNew
          }
          //处理6位的颜色值
          var sColorChange = []
          for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
          }
          return sColorChange
        } else {
          return sColor
        }
      }
    },

    // 将rgb表示方式转换为hex表示方式
    colorToHex(rgb) {
      var _this = rgb
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      if (/^(rgb|RGB)/.test(_this)) {
        var aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
        var strHex = '#'
        for (var i = 0; i < aColor.length; i++) {
          var hex = Number(aColor[i]).toString(16)
          hex = hex < 10 ? 0 + '' + hex : hex // 保证每个rgb的值为2位
          if (hex === '0') {
            hex += hex
          }
          strHex += hex
        }
        if (strHex.length !== 7) {
          strHex = _this
        }

        return strHex
      } else if (reg.test(_this)) {
        var aNum = _this.replace(/#/, '').split('')
        if (aNum.length === 6) {
          return _this
        } else if (aNum.length === 3) {
          var numHex = '#'
          for (var i = 0; i < aNum.length; i += 1) {
            numHex += aNum[i] + aNum[i]
          }
          return numHex
        }
      } else {
        return _this
      }
    }
  }
}
</script>

<style lang="less" scoped="">
// 创建一张隐藏的画布 用于取色
.canvas-box {
  margin-left: 500upx;
  width: 0;
  height: 0;
  overflow: hidden;
}

.ynGalleryPanel {
  // position: relative;

  .current-img {
    // content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
	width: 100%;
    -webkit-filter: blur(60upx);
    -moz-filter: blur(60upx);
    -o-filter: blur(60upx);
    -ms-filter: blur(60upx);
    filter: blur(60upx);
  }
}

//画廊总容器 静态样式放这里  动态样式放template
.gallerypanel {
  position: absolute;
  top: 0;

  .scroll-view {
    background-color: transparent;
    .scroll-view-panle {
      display: flex;
      height: 100%;
      width: 100%;
      white-space: nowrap;
      .leftview {
        //动态
      }
      .imgviewpanel {
        .角标 {
        }
        .imgview {
          .图片 {
          }
        }
        .描述 {
          .文本 {
          }
        }
      }
      .rightview {
        //动态
      }
    }
  }
}

// 隐藏滚动条 hbx1.8版本 这样写有错误（伪类错误） 需要把这代码放到小程序工具的main.wsxx中去
// .gallerypanel ::-webkit-scrollbar {display: none;}
// 	.scroll-view ::-webkit-scrollbar {
// 	    display: none;
// 	}

.roundbadge {
  z-index: 2;
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  border-radius: 8px;
  min-width: 12px;
  min-height: 12px;
  max-height: 12px;
  padding: 3px 5px;
  margin-bottom: -17px; //17=12+5  12是圆角角标高度  5是图片中间的边距
  margin-right: 3px; //右边距是5px 这里取3
}

* {
  -webkit-overflow-scrolling: touch;
}

// 呼吸帧
@keyframes living {
  0% {
    // transform-origin:'center bottom';
    transform: scale(1);
    opacity: 1;
  }

  50% {
    // transform-origin:'center bottom';
    transform: scale(1.05);
    opacity: 1;
    /*圆形放大的同时，透明度逐渐减小为0*/
  }

  100% {
    // transform-origin:'center bottom';
    transform: scale(1);
    opacity: 1;
  }
}

.trans-fadeout {
  //    -webkit-transition:all 0.2s linear;
  //    -moz-transition:all 0.2s linear;
  //    -ms-transition:all 0.2s linear;
  //    -o-transition:all 0.2s linear;
  animation: living 1s ease-in-out 1;
}

.img-wrapper {
  border-radius: 20px;
  overflow: hidden;
}
</style>
