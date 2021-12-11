// 域名测试环境与正式环境
// let URL_PREV = "https://insapi.51rry.com/";
let URL_PREV = "https://matchbox-79a395.service.tcloudbase.com/";
//一级封装：封装wx通用请求（get/post/put/delete)
//1. 有用户登录请求头带有token，无用户登录请求头不带token
//2. 添加请求url域名前缀
//3. 请求成功（code==200）执行成功回调函数，请求失败执行失败回调函数

const global = {
	doInvoke: function(url, method, data, isThird, successCb, errorCb) {
		let token = uni.getStorageSync('token')
		let header = {
			"content-type": "application/json",
			"X-requested-With": "XMLHttpRequest",
			'Access-Control-Allow-Origin': true,
			'accessToken': token || undefined
		};
		uni.request({
			url: (isThird ? `${url}` : `${URL_PREV}${url}`),
			header: header,
			method: method,
			data: data,
			success: function(res) {
				successCb(res.data);
			},
			fail: function(err) {
				errorCb(err);
			},
			complete: function() {
				uni.hideLoading();
			}
		});
	}
}

//二级封装：对一级封装做处理
//1. 返回 promise 
//2. 捕捉异常。请求失败抛出异常，进行toast弹框提示用户请求结果失败
export const Request = {
	doInvoke: function(url, method, data, isThird) {
		return new Promise((resolve, reject) => {
			global.doInvoke(url, method, data, isThird, function(res) {
				resolve(res);
			}, function(err) {
				reject(err)
			});
		}).catch(function(e) {
			if (e != "token_not_provided") {
				uni.showToast({
					title: e,
					icon: 'none',
					duration: 1500
				})
			}
		});
	}
}