import {
	getStore,
	setStore
} from '@/util/service'
const login = {
	namespaced: true,
	state: {
		token: getStore('token'), //钱包地址
		password: '', //临时密码
		nodeUrl: getStore('nodeUrl') || 'https://liushao.cc:5013/', //节点地址
		configInfo: getStore('configInfo') || {}, //后端配置信息
		userInfo: getStore('userInfo') || {}, //用户信息
		keystore: getStore('keystore') || {}, //用户keyStore
		client: {}, //主网对象
	},
	getters: {},
	mutations: {
		SET_TOKEN: (state, params) => {
			state.token = params;
			setStore('token', params);
		},
		SET_PASSWORD: (state, params) => {
			state.password = params;
		},
		SET_NODEURL: (state, params) => {
			state.nodeUrl = params;
			setStore('nodeUrl', params);
		},
		SET_CONFIGINFO: (state, params) => {
			state.configInfo = params;
			setStore('configInfo', params);
		},
		SET_USERINFO: (state, params) => {
			state.userInfo = params;
			setStore('userInfo', params);
		},
		SET_KEYSTORE: (state, params) => {
			state.keystore = params;
			setStore('keystore', params);
		},
		SET_CLIENT: (state, params) => {
			state.client = params;
		},
	},
	actions: {}
}
export default login
