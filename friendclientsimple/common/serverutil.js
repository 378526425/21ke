import Vue from 'vue'
export default {
	async post(url, data, events, showModel) {
		this.requestmethod(url, data, events, showModel, "post")
	},
	async put(url, data, events, showModel) {
		this.requestmethod(url, data, events, showModel, "put")
	},
	async get(url, data, events, showModel) {
		this.requestmethod(url, data, events, showModel, "get")
	},
	async delete(url, data, events, showModel) {
		this.requestmethod(url, data, events, showModel, "delete")
	},
	async requestmethod(url, data, events, showModel, methodtype) {
		if (showModel == undefined || showModel == true) {
			if (methodtype == "get") {
				uni.showLoading({
					title: '玩命加载中..'
				});
			} else {
				uni.showLoading({
					title: '玩命加载中..',
					mask: true
				});
			}
		}
		let token = ''
		try {
			const restoken = uni.getStorageSync('loginuserinfo');
			if (restoken) {
				token = restoken.token
			}
		} catch (e) {
			// error
		}
		let headerbody;
		if (methodtype == "get") {
			headerbody = {
				url: Vue.prototype.serveraddress + url,
				dataType: 'json',
				data: data,
				header: {
					'Authorization': token //自定义请求头信息
				}
			};
		} else if (methodtype == "post") {
			headerbody = {
				url: Vue.prototype.serveraddress + url, //仅为示例，并非真实接口地址。
				data: data,
				header: {
					"Content-Type": "application/json",
					'Authorization': token //自定义请求头信息
				},
				method: "POST"
			};
		} else if (methodtype == "put") {
			headerbody = {
				url: Vue.prototype.serveraddress + url, //仅为示例，并非真实接口地址。
				data: data,
				header: {
					"Content-Type": "application/json",
					'Authorization': token //自定义请求头信息
				},
				method: "PUT"
			};
		} else if (methodtype == "delete") {
			headerbody = {
				url: Vue.prototype.serveraddress + url,
				dataType: 'json',
				data: data,
				header: {
					'Authorization': token //自定义请求头信息
				},
				method: "DELETE"
			};
		}
		var [error, res] = await uni.request(headerbody);
		if (res != undefined) {
			//如果为505 则跳转到登录页面
			if (res.data.code == 505) {
				uni.reLaunch({
					url: '/pagesH/login/login'
				})

			}
			if (res.data.code == 200) {
				//业务成功
				events.success(res);
			} else if (res.data.code == 506 || res.data.code == 507 || res.data.code == 508) {
				//特殊逻辑业务
				events.service(res);
			} else {
				events.warnings(res.data.msg == null ? "网络繁忙" : res.data.msg);
				//业务失败
			}
		}
		if (error != undefined) {
			//接口调用失败执行
			events.error("网络繁忙，请检查网络");
		}
		//接口调用完成执行 关闭loading
		uni.hideLoading();
	}
	
}
