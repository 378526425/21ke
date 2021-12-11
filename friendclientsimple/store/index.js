import Vue from 'vue'
import Vuex from 'vuex'
// 模块
import user from './model/user.js'
import diary from './model/diary.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: {},
		diary: {},
	},
	mutations: {

	},
	actions: {

	},
	modules: {
		user,
		diary
	}
})

export default store
