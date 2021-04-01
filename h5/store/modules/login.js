import {
	getStore,
	setStore
} from '@/util/service'
const login = {
	namespaced: true,
	state: {
		token: getStore('token') || '',
		role: getStore('role') || '',
		userInfo: getStore('userInfo') || {}
	},
	getters: {},
	mutations: {
		SET_OPENID: (state, params) => {
			state.openid = params;
			setStore('openid', params);
		},
		SET_TOKEN: (state, params) => {
			state.token = params;
			setStore('token', params);
		},
		SET_ROLE: (state, params) => {
			state.role = params;
			setStore('role', params);
		},
		SET_USERINFO: (state, params) => {
			state.userInfo = params;
			setStore('userInfo', params);
		}
	},
	actions: {}
}
export default login
