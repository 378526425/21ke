import Vue from 'vue'
import App from './App'


import common from './utils/common.js'
Vue.prototype.$common = common

import api from './utils/api/api.js'
Vue.prototype.$api = api

// 挂载全局状态管理
import store from './store/index.js'
Vue.prototype.$store = store

//格式化时间  此处应该写在公共方法里面  但本人习惯写这
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
// new Date(1542274800000).Format('yy-MM-dd hh:mm:ss'); //"2018-11-15 17:40:00"

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.websocketurl = 'wss://www.wxmblog.com/wss'
Vue.prototype.serveraddress = 'https://www.wxmblog.com/serverapi'

Vue.prototype.defaultheadportrait="/file/system/defaultheadPortrait.png"
Vue.prototype.defaulwomantheadportrait="/file/system/defaulwomantheadportrait.png"
const app = new Vue({
	...App
})
app.$mount()
