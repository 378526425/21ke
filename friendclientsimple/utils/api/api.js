import {
	Request
} from "./http.js"

export default {
	// 微信小程序登录			登录---------------------------
	getDiary: params => {
		return Request.doInvoke(`getDiary`, 'GET', params)
	}
}
