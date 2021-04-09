<template>
	<view class="login">
		<div class="login-box">
			<div class="title">
				<u-image width="92rpx" height="46rpx" src="../../static/logo.png" class="inline mr-5"></u-image>
				{{i18n.Create+''+i18n.Account}}
			</div>
			<u-gap height="60"></u-gap>
			<div class="form">
				<div class="form-title">{{i18n.Create+''+i18n.Account}}</div>
				<u-gap height="14"></u-gap>
				<u-input v-model="form.address" type="textarea" class="address" :clearable="false" height="120"
					:custom-style="{padding:'15rpx'}" disabled />
				<u-gap height="30"></u-gap>
				<div class="form-title">{{i18n.MnemonicTips}}</div>
				<u-gap height="14"></u-gap>
				<u-input v-model="form.mnemonic" type="textarea" class="textarea" :clearable="false" height="160" disabled
					:custom-style="{padding:'15rpx',wordWrap:'break-word',wordBreak:'normal'}" />
			</div>
			<u-gap height="40"></u-gap>
			<u-button size="default" type="primary" shape="circle" ripple @tap="createAccount" :throttle-time="200">{{i18n.login.rebuild}}</u-button>
			<u-gap height="25"></u-gap>
			<div class="clearfix">
				<div class="pull-left mnemonic" @tap="reLaunchUrl('../index/index')">{{i18n.index}}</div>
				<div class="pull-right mnemonic" @tap="goUrl('login')">{{i18n.login.mnemonicLogin}}</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		generateMnemonic,
		getHdWalletAccountFromMnemonic
	} from '@aeternity/aepp-sdk/es/utils/hd-wallet'
	export default {
		data() {
			return {
				form: {
					address: '',
					mnemonic: '',
				}
			}
		},
		onLoad() {
			this.createAccount();
		},
		computed: {
			i18n() {
				return this.$_i18n.messages[this.$_i18n.locale]
			},
		},
		methods: {
			createAccount() {
				const mnemonic = generateMnemonic();
				const key = getHdWalletAccountFromMnemonic(mnemonic,0);
				this.form.address=key.publicKey;
				this.form.mnemonic = mnemonic;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #667eea;
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
				.address {
					background-color: #f5f5f5;
					border: 1px solid #ccc;
					border-radius: 10rpx;
				}

				.textarea {
					border: 1px solid #ccc;
					border-radius: 10rpx;
				}
			}

			.mnemonic {
				font-size: 24rpx;
				color: #2196f3;
			}
		}
	}
</style>
