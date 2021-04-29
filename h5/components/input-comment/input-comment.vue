<template>
	<view :style="{'display':isShow?'inline-block':'none'}">
		<view @click="clickOther" class="comment-other"></view>
		<view class="comment">
			<view class="comment-info">
				<view class="comment-input">
					<textarea class="content" v-model="content" :placeholder="placeholder" :focus="isShow" :maxlength="100000" />
				</view>
				<view @click.stop="submitComment" class="comment-submit">发送</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: '写评论...'
			},
			isShow: {
				type: Boolean,
				default: false
			},
			valueData: {
				type: Array,
				default: []
			},
			curKey: {
				type: String,
				default: ''
			}
		},
		components: {},
		data() {
			return {
				screenHeight: 0,
				content:''
			}
		},
		methods: {
			inputValue(e) {
				if (this.value) {
					this.submitColor = '#fb5f5f';
				} else {
					this.submitColor = "#b0b0b0";
				}
			},
			submitComment() {
				this.$emit('submitComment', this.content);
			},
			clickOther() {
				this.$emit('clickOther', this.value);
			}
		},
		watch: {
			value: function(val, oldVal) {
				this.inputValue(val);
			},
			isShow: function(val, oldVal) {
				this.value = this.valueData.hasOwnProperty(this.curKey) ? this.valueData[this.curKey] : '';
			},
			valueData: function(val, oldVal) {
				// console.log(val,oldVal);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.comment-other {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}

	.comment {
		z-index: 999;
		position: fixed;
		bottom: 0;
		z-index: 100;
		width: 100%;
		background-color: white;
		padding: 20upx;
		border-top: 1px solid #aaa;
		font-size: 28rpx;
	}

	.comment-info {
		display: flex;
		justify-content: space-between;
	}

	.comment-input {
		width: 85%;
		height: 150rpx;
		.content {
			width: 100%;
			box-sizing: border-box;
			background-color: rgba(232, 232, 232, 0.57);
			font-size: 28rpx;
			padding: 20upx;
			max-height: 150rpx;
			border-radius: 20rpx;
		}
	}

	.comment-submit {
		width: 15%;
		color: #f04a82;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
</style>
