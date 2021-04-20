import {
	getStore,
	setStore
} from '@/util/service'
const login = {
	namespaced: true,
	state: {
		token: getStore('token'),
		userInfo: getStore('userInfo') || {},
		keyStore: getStore('keyStore') || {}
	},
	getters: {},
	mutations: {
		SET_TOKEN: (state, params) => {
			state.token = params;
			setStore('token', params);
		},
		SET_USERINFO: (state, params) => {
			state.userInfo = params;
			setStore('userInfo', params);
		},
		SET_KEYSTORE: (state, params) => {
			state.keyStore = params;
			setStore('keyStore', params);
		}
	},
	actions: {}
}
export default login
