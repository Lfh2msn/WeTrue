import {
	getStore,
	setStore
} from '@/util/service'
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
				delta:delta
			});
		},
		getProviderData() {
			uni.getProvider({
				service: 'oauth',
				success: (res) => {
					console.log(res);
				}
			})
		},
		getLogin() {
			uni.login({
				provider: '',
				success: (res) => {
					console.log(res);
				},
				fail: (error) => {
					console.log(error);
				}
			})
		},
	}
}
const mixinsMobile = {
	install: function(Vue, options) {
		Vue.mixin(mixins)
	}
}

export default mixinsMobile
