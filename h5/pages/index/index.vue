<template>
	<view class="index">
		<u-dropdown ref="uDropdown" class="u-dropdown" active-color="#f04a82">
			<u-dropdown-item v-model="cateInfo.value" :title="cateInfo.label" :options="categoryList"
				@change="selectCategory"></u-dropdown-item>
		</u-dropdown>
		<div class="forum">
			<div class="forum-item">
				<div class="user-area">
					<u-avatar src="../../static/default_head.png" size="mini" class="user-head"></u-avatar>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cateInfo: {
					value: 1,
					label: ''
				}, //当前类别
			}
		},
		onLoad() {
			this.cateInfo.label=this.i18n.home.newRelease;
		},
		computed:{
			i18n(){
				return this.$_i18n.messages[this.$_i18n.locale]
			},
			categoryList(){
				return [{
						label: this.i18n.home.newRelease,
						value: 1,
					},
					{
						label: this.i18n.home.hotRecommend,
						value: 2,
					},
					{
						label: this.i18n.home.newPic,
						value: 3,
					},
					{
						label: this.i18n.home.myFocus,
						value: 4,
					}
				]
			}
		},
		methods: {
			//选择类别
			selectCategory(val) {
				for (let i in this.categoryList) {
					if (this.categoryList[i].value === val) {
						this.cateInfo.value = val;
						this.cateInfo.label = this.categoryList[i].label;
						break;
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		.u-dropdown {
			background-color: #fafafa;
			border-bottom: 1px solid #c8c8c8;
		}

		.forum {
			&-item {
				background-color: #fff;
				border-bottom: 1px solid #ececec;

				.user-area {
					padding: 20rpx;

					.user-head {
						box-shadow: 0 0 10rpx #f04a82;
					}
				}
			}
		}
	}
</style>
