<template>
	<div class="editor">
		<u-navbar back-text="" title="发布主贴" :border-bottom="false">
			<div slot="right" class="right-btn">
				<u-button type="primary" size="mini" :disabled="form.text.length===0" @click="release"  :loading="btnLoading">发布</u-button>
			</div>
		</u-navbar>
		<u-input v-model="form.text" type="textarea" :border="false" height="300" :auto-height="true" :maxlength="2000"
			placeholder="这一刻的想法..." :clearable="false" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					text: ''
				},
				btnLoading: false, //按钮加载状态
			}
		},
		onLoad() {
			if (!this.$store.state.user.password) {
				uni.navigateTo({
					url: '/pages/login/password'
				})
			}
		},
		methods: {
			//发布
			async release() {
				if (!this.$store.state.user.password) {
					uni.navigateTo({
						url: '/pages/login/password'
					})
					return false;
				}
				this.btnLoading = true;
				uni.showLoading({
					title: '发布中...'
				});
				let payload = {
					content: this.form.text
				}
				let res = await this.sendTopic(payload);
				if (!!res.hash) {
					setTimeout(() => {
						uni.hideLoading();
						this.btnLoading = false;
						this.reLaunchUrl('index');
					}, 2000)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #fff;
	}

	.editor {
		padding: 30rpx;

		.right-btn {
			padding-right: 30rpx;
		}
	}
</style>
