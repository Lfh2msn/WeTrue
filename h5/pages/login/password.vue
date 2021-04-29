<template>
	<view class="check">
		<div class="check-box">
			<div class="title">
				<u-image width="92rpx" height="46rpx" src="../../static/logo.png" class="inline mr-5"></u-image>
				验证临时密码
			</div>
			<u-gap height="60"></u-gap>
			<div class="form">
				<u-gap height="14"></u-gap>
				<u-input v-model="form.password" class="password" placeholder="请输入临时密码"
					:custom-style="{padding:'10rpx 20rpx'}" />
			</div>
			<u-gap height="40"></u-gap>
			<u-button size="default" type="primary" shape="circle" ripple @tap="check" :throttle-time="1000"
				:loading="loading">验证
			</u-button>
			<u-gap height="25"></u-gap>
			<div class="t-c">
				<div class="mnemonic" @tap="goUrl('login')">{{i18n.login.mnemonicLogin}}</div>
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
					password: ''
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
			//检查密码是否和keystore匹配
			async check() {
				this.loading = true;
				try {
					const secretKey = await this.keystoreToSecretKey(this.form.password);
					if (!!secretKey) {
						this.uShowToast('验证成功');
						this.$store.commit('user/SET_PASSWORD', this.form.password);
						this.getConfigInfo();
						this.connectAe();
						this.loading = false;
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}, 500);
					}
				} catch (error) {
					this.uShowToast('验证失败');
					this.loading = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f04a82;
	}

	.check {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;

		.check-box {
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
				.password {
					background-color: #fff;
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
