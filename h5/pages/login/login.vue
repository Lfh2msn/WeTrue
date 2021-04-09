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
				<u-gap height="30"></u-gap>
				<div class="form-title">{{i18n.Setpassword}}</div>
				<u-gap height="14"></u-gap>
				<u-input v-model="form.pass" type="text" class="textarea" :clearable="false"
					:custom-style="{padding:'0 15rpx'}" placeholder="Password..." />
			</div>
			<u-gap height="40"></u-gap>
			<u-button size="default" type="primary" shape="circle" ripple>{{i18n.login.login}}</u-button>
			<u-gap height="25"></u-gap>
			<div class="clearfix">
				<div class="pull-left mnemonic" @tap="reLaunchUrl('../index/index')">{{i18n.index}}</div>
				<div class="pull-right mnemonic" @tap="goUrl('mnemonic')">{{i18n.Create + ''+ i18n.Mnemonic}}</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					mnemonic: '',
					pass: ''
				}
			}
		},
		computed: {
			i18n() {
				return this.$_i18n.messages[this.$_i18n.locale]
			},
		},
		methods: {

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
			padding:60rpx 30rpx;
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
			}
			.mnemonic{
				font-size: 24rpx;
				color: #2196f3;
			}
		}
	}
</style>
