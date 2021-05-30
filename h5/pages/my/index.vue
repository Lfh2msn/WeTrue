<template>
	<div class="my">
		<div class="user-info" v-if="!!token">
			<div class="my-info">
				<div class="block">
					<div class="user-box">
						<div class="user-top">
							<div class="head">
								<image v-if="userInfo.portrait" :src="userInfo.portrait"></image>
								<image v-else src="../../static/default_head.png"></image>
								<u-gap height="1"></u-gap>
								{{userInfo.userName||'匿名'}}
							</div>
							<div class="address" @tap="copy" id="copy">{{address}}</div>
						</div>
						<div class="user-bottom">
							<div class="item">
								<div class="value">{{userInfo.active||0}}</div>
								<div class="label">活跃度</div>
							</div>
							<div class="item">
								<div class="value">{{userInfo.focus||0}}</div>
								<div class="label">关注</div>
							</div>
							<div class="item">
								<div class="value">{{userInfo.fans||0}}</div>
								<div class="label">粉丝</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="menu">
				<u-cell-group :border="false">
					<u-cell-item :title="i18n.my.myWallet" :value="'AE：'+balance">
						<fa-FontAwesome slot="icon" type="fas fa-wallet" size="32" class="mr-10" color="#f04a82">
						</fa-FontAwesome>
					</u-cell-item>
					<u-cell-item :title="i18n.my.nodeSet">
						<fa-FontAwesome slot="icon" type="fab fa-linode" size="32" class="mr-10" color="#f04a82">
						</fa-FontAwesome>
					</u-cell-item>
					<u-cell-item :title="i18n.my.logout" @click="exit" :border-bottom="false" @tap="logout">
						<fa-FontAwesome slot="icon" type="fas fa-sign-out-alt" size="32" class="mr-10" color="#f04a82">
						</fa-FontAwesome>
					</u-cell-item>
				</u-cell-group>
			</div>
			<!-- <div class="version">版本号：{{version}}</div> -->
		</div>
		<div class="login" v-else>
			<div class="login-box">
				<div class="item" @tap="goUrl('../login/login')">
					<fa-FontAwesome slot="icon" type="fas fa-wallet" size="48" class="mr-20" color="#f04a82">
					</fa-FontAwesome>导入钱包
				</div>
				<u-gap height="80"></u-gap>
				<div class="item" @tap="goUrl('../login/mnemonic')">
					<fa-FontAwesome slot="icon" type="fas fa-plus-circle" size="48" class="mr-20" color="#f04a82">
					</fa-FontAwesome>创建钱包
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Request from '@/js_sdk/luch-request/luch-request/index.js'
	const http = new Request();
	import Clipboard from 'clipboard';
	import {
		version,
	} from '@/config/config.js';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				userInfo: {}, //用户信息
				version: version, //应用版本号
				address: '', //ae地址
				balance:0,//余额
			};
		},
		computed: {
			...mapGetters(['token']),
			//国际化
			i18n() {
				return this.$_i18n.messages[this.$_i18n.locale]
			},
		},
		onLoad() {
			if (!!this.token) {
				this.getUserInfo();
			}
			this.getAccount();
		},
		activated() {
			if (!!this.token) {
				this.getUserInfo();
			}
		},
		methods: {
			//获取用户信息
			getUserInfo() {
				let params = {
					userAddress: this.token
				}
				this.$http.post('/User/info', params).then(res => {
					if (res.code === 200) {
						this.userInfo = res.data;
						this.address = '';
						for (let i = 0, len = this.token.length; i < len; i++) {
							this.address += this.token[i]
							if (i % 3 === 2) this.address += ' ';
						}
					}
				})
			},
			//复制粘贴板
			copy() {
				// #ifdef H5
				let clipboard = new Clipboard("#copy", {
					text: (trigger) => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 600
						});
						return this.userInfo.userAddress;
					}
				});
				// #endif
				// #ifndef H5
				let that = this;
				uni.setClipboardData({
					data: that.userInfo.userAddress,
					success: (function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 600
						});
					})
				});
				// #endif
			},
			//获取账户AE余额
			getAccount() {
				http.get('https://www.aeknow.org/api/account/' + this.token).then(res => {
					this.balance=this.balanceFormat(res.data.balance)
				})
			},
			//退出登录
			logout() {
				uni.clearStorage();
				this.$store.commit('user/SET_TOKEN', '');
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.my {
		.user-info {
			.my-info {
				.block {
					background: #f04a82;
					width: 100%;
					height: 320upx;
					position: relative;
					box-sizing: border-box;
					color: #101010;
					position: relative;

					.user-box {
						width: 90%;
						background-color: #fff;
						box-shadow: 0px 2px 6px 0px rgba($color: #f04a82, $alpha:0.3);
						z-index: 100;
						border-radius: 20upx;
						position: absolute;
						left: 5%;
						bottom: -160upx;
						font-size: 26upx;
						box-sizing: border-box;

						.user-top {
							padding: 30rpx 30rpx 0 30rpx;
							display: flex;

							.head {
								text-align: center;
								font-size: 24upx;
								padding: 20rpx 30rpx;

								image {
									width: 120upx;
									height: 120upx;
									border-radius: 50%;
								}
							}

							.address {
								display: inline-flex;
								flex-wrap: wrap;
								align-items: center;
								line-height: 50rpx;
								color: #f04a82;
								font-size: 34rpx;
							}
						}

						.user-bottom {
							display: flex;
							justify-content: space-around;
							padding: 10rpx 30rpx 30rpx;

							.item {
								text-align: center;

								.value {
									font-size: 24rpx;
									color: #000;
								}

								.label {
									font-size: 24rpx;
									color: #666;
								}
							}
						}
					}
				}
			}

			.menu {
				width: 80%;
				margin: 180upx auto 80upx;
			}

			.version {
				color: #999;
				font-size: 24upx;
				position: absolute;
				bottom: 30upx;
				width: 100%;
				text-align: center;
			}
		}

		.login {
			background-color: #f04a82;
			height: calc(100vh - 50px);
			display: flex;
			justify-content: center;
			align-items: center;

			.login-box {
				margin: 0 10%;
				width: 90%;

				.item {
					background-color: #fff;
					height: 110rpx;
					width: 100%;
					border-radius: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 44rpx;
					box-shadow: 0rpx 5rpx 18rpx rgba($color: #666, $alpha:0.7);
					transition: all 0.3;

					&:active {
						transform: scale(1.1);
					}
				}
			}
		}
	}
</style>
