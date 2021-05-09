import {
	getStore,
	setStore
} from '@/util/service'
import store from '@/store';
import {
	Node,
	Wallet,
	Keystore,
	MemoryAccount
} from '@aeternity/aepp-sdk/es/index'
const mixins = {
	data() {
		return {}
	},
	onLoad() {},
	methods: {
		uShowToast(title, icon) {
			uni.showToast({
				icon: icon == null ? 'none' : icon,
				title: title
			});
		},
		uHideToast() {
			uni.hideToast();
		},
		uShowLoading(title) {
			uni.showLoading({
				title: title
			});
		},
		uHideLoading() {
			uni.hideLoading();
		},
		uShowModel(title, content, callback) {
			uni.showModal({
				title: title,
				content: content,
				success: function(res) {
					if (res.confirm) {
						callback()
						// console.log('用户点击确定');
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		goUrl(url) {
			uni.navigateTo({
				url: url
			})
		},
		redirectUrl(url) {
			uni.redirectTo({
				url: url
			})
		},
		reLaunchUrl(url) {
			uni.reLaunch({
				url: url
			});
		},
		switchTabUrl(url) {
			uni.switchTab({
				url: url
			});
		},
		goBackUrl(delta) {
			// let current = getCurrentPages();
			uni.navigateBack({
				delta: delta
			});
		},
		//获取后端信息
		getConfigInfo() {
			this.$http.post('/Config/info').then(res => {
				if (res.code === 200) {
					store.commit('user/SET_CONFIGINFO', res.data);
				}
			})
		},
		//keystore通过密码转换成私钥
		keystoreToSecretKey(password) {
			const keystore = getStore('keystore')
			return Keystore.recover(password, keystore).then(strhex => {
				return strhex;
			});
		},
		//验证是否登录
		validLogin() {
			if (getStore('keystore')) {
				return true;
			} else {
				return false;
			}
		},
		//AE交易
		async connectAe(payload, type) {
			try {
				const secretKey = await this.keystoreToSecretKey(store.state.user.password);
				const node = await Node({
					url: store.state.user.nodeUrl
				});
				const client = await Wallet({
					compilerUrl: 'https://compiler.aechina.io',
					nodes: [{
						name: "WeTrue",
						instance: node
					}],
					accounts: [
						MemoryAccount({
							keypair: {
								secretKey: secretKey,
								publicKey: getStore('keystore').public_key
							}
						})
					],
					address: getStore('keystore').public_key
				});
				store.commit('user/SET_CLIENT', client);
			} catch (error) {
				alert(error)
			}
		},
		//发送评论
		async sendComment(payload) {
			const client = store.state.user.client;
			const configInfo = getStore('configInfo');
			let content = {
				WeTrue: configInfo.WeTrue,
				type: "comment",
				toHash: payload.hash,
				content: payload.content
			};
			const res = await client.spend(configInfo.commentAmount, configInfo.receivingAccount, {
				payload: JSON.stringify(content)
			})
			this.$http.post('/Submit/hash', {
				hash: res.hash
			});
			return res;
		},
		//发送回复
		async sendReply(payload) {
			const client = store.state.user.client;
			const configInfo = getStore('configInfo');
			let content = {
				WeTrue: configInfo.WeTrue,
				type: "reply",
				reply_type: payload.type,
				to_hash: payload.hash,
				to_address: payload.address,
				reply_hash: payload.replyHash,
				content: payload.content
			};
			const res = await client.spend(configInfo.commentAmount, configInfo.receivingAccount, {
				payload: JSON.stringify(content)
			})
			this.$http.post('/Submit/hash', {
				hash: res.hash
			});
			return res;
		}
	}
}
const mixinsMobile = {
	install: function(Vue, options) {
		Vue.mixin(mixins)
	}
}

export default mixinsMobile
