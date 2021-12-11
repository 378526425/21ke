// 微信小程序登录
const loginByWeixin = () => {
	getWeixinCode().then((code) => {
		return uniCloud.callFunction({
			name: 'user-center',
			data: {
				action: 'loginByWeixin',
				params: {
					code
				}
			}
		})
	}).then((res) => {
		if (res.result.code === 0) {
			uni.setStorageSync('uni_id_token', res.result.token)
			uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
		}
	}).catch((err) => {
		uni.showModal({
			showCancel: false,
			content: '微信登录失败，请稍后再试'
		})
	})
}

// 微信小程序获取code
const getWeixinCode = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success(res) {
				resolve(res.code)
			},
			fail(err) {
				reject(new Error('微信登录失败'))
			}
		})
	})
}

export default {
	getWeixinCode,
	loginByWeixin
}
