<template>
	<view class="login">
		<div class="login-box">
			<div class="title">
				<u-image width="92rpx" height="46rpx" src="../../static/logo.png" class="inline mr-5"></u-image>
				{{i18n.login.login}}
			</div>
			<u-gap height="60"></u-gap>
			<div class="form">
				<div class="form-title">{{i18n.ImportCreate}}</div>
				<u-gap height="14"></u-gap>
				<u-input v-model="form.mnemonic" type="textarea" class="textarea" :clearable="false" height="160"
					:custom-style="{padding:'15rpx'}" placeholder="one two three..." />
				<div class="warnning" v-show="warning.mnemonic">{{i18n.login.mnemonicWarning}}</div>
				<u-gap height="30"></u-gap>
				<div class="form-title">{{i18n.Setpassword}}</div>
				<u-gap height="14"></u-gap>
				<u-input v-model="form.pass" type="text" class="textarea" :clearable="false"
					:custom-style="{padding:'0 15rpx'}" placeholder="Password..." maxlength="20" />
				<div class="warnning" v-show="warning.pass">{{i18n.login.passWarning}}</div>
			</div>
			<u-gap height="40"></u-gap>
			<u-button size="default" type="primary" shape="circle" ripple @tap="importMnemonic" :loading="loading"
				:throttle-time="1000">
				{{i18n.login.login}}
			</u-button>
			<u-gap height="25"></u-gap>
			<div class="clearfix">
				<div class="pull-left mnemonic" @tap="reLaunchUrl('../index/index')">{{i18n.index}}</div>
				<div class="pull-right mnemonic" @tap="goUrl('mnemonic')">{{i18n.Create + ''+ i18n.Mnemonic}}</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		getHdWalletAccountFromMnemonic
	} from '@aeternity/aepp-sdk/es/utils/hd-wallet'
	import {
		dump
	} from '@aeternity/aepp-sdk/es/utils/keystore'
	export default {
		data() {
			return {
				//表单
				form: {
					mnemonic: '',
					pass: ''
				},
				//表单验证
				warning: {
					mnemonic: false,
					pass: false,
				},
				loading: false, //按钮加载状态
			}
		},
		onLoad() {

		},
		computed: {
			i18n() {
				return this.$_i18n.messages[this.$_i18n.locale]
			},
		},
		methods: {
			//导入助记词
			async importMnemonic() {
				if (!this.form.mnemonic) {
					this.warning.mnemonic = true;
					return;
				} else {
					this.warning.mnemonic = false;
				}
				if (!this.form.pass || this.form.pass.length < 3) {
					this.warning.pass = true;
					return;
				} else {
					this.warning.pass = false;
				}
				this.loading = true;
				//助记词转换成钱包地址和秘钥
				let publicKeyInsecretKey = await getHdWalletAccountFromMnemonic(this.form.mnemonic, 0);
				//通过密码和私钥生成keystore
				await dump('WeTrueWallet', this.form.pass, publicKeyInsecretKey.secretKey).then(keystore => {
					this.$store.commit('user/SET_KEYSTORE', keystore);
					this.$store.commit('user/SET_PASSWORD', this.form.pass);
				})
				this.login(publicKeyInsecretKey.publicKey);
			},
			//登陆
			login(address) {
				let params = {
					userAddress: address,
					type: 'login'
				}
				this.$http.post('/User/info', params).then(res => {
					if (res.code === 200) {
						this.$store.commit('user/SET_TOKEN', address);
						this.$store.commit('user/SET_USERINFO', res.data || {});
						this.getConfigInfo();
						this.connectAe();
						this.reLaunchUrl('../index/index');
					}
					this.loading = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f04a82;
	}

	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;

		.login-box {
			box-sizing: border-box;
			width: 90%;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			min-height: 200rpx;
			padding: 60rpx 30rpx;
			box-shadow: 0rpx 5rpx 18rpx rgba($color: #666, $alpha:0.7);

			.title {
				font-size: 46rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.form {
				.textarea {
					border: 1px solid #ccc;
					border-radius: 10rpx;
				}

				.warnning {
					font-size: 20rpx;
					color: #F00;
					margin-top: 10rpx;
				}
			}

			.mnemonic {
				font-size: 24rpx;
				color: #2196f3;
			}
		}
	}
</style>
