<template>
	<view class="index">
		<u-navbar :is-back="false">
			<view class="slot-wrap nav">
				<u-dropdown ref="uDropdown" class="u-dropdown" active-color="#f04a82">
					<u-dropdown-item v-model="cateInfo.value" :title="cateInfo.label" :options="categoryList"
						@change="selectCategory"></u-dropdown-item>
				</u-dropdown>
				<div class="left">
					<fa-FontAwesome type="fas fa-language" size="36" class="mr-10" color="#f04a82" @tap="selectLanguage"
						v-show="language === 'zh-cn'">
					</fa-FontAwesome>
					<fa-FontAwesome type="fas fa-language" size="36" class="mr-10" color="#03a9f4" @tap="selectLanguage"
						v-show="language === 'en'">
					</fa-FontAwesome>
				</div>
				<div class="right">
					<fa-FontAwesome type="fas fa-plus" size="36" class="mr-10" color="#f04a82" @tap="goUrl('editor')">
					</fa-FontAwesome>
				</div>
			</view>
		</u-navbar>
		<div class="forum">
			<div class="forum-item" v-for="item in postList">
				<div class="user-area">
					<div class="head-box">
						<image class="user-head" mode="aspectFill" :src="item.users.portrait"
							v-if="item.users.portrait"></image>
						<image class="user-head" mode="aspectFill" src="../../static/default_head.png" v-else></image>
						<div class="level">
							<text class="text">V{{item.users.userActive}}</text>
						</div>
					</div>
					<div class="user-info">
						<div class="user">
							<div class="name">
								{{item.users.nickname || '匿名'}}
								<text v-show="item.isFocus">已关注</text>
							</div>
							<div class="more">
								<fa-FontAwesome type="fas fa-angle-down" size="36" class="mr-10" color="#cecece"
									@tap="moreOpera(item)">
								</fa-FontAwesome>
							</div>
						</div>
						<div class="time">
							<text>ID:{{item.users.userAddress.slice(-4)}}</text>{{$moment(item.utcTime).fromNow()}}
						</div>
					</div>
				</div>
				<div class="main-content" @tap="goUrl('detail?hash='+item.hash)">
					<div class="text-content">
						<u-parse :html="item.payload"></u-parse>
					</div>
					<div class="img-list">
						<u-image width="150rpx" height="150rpx" :src="item.imgTx" v-if="item.imgTx"></u-image>
					</div>
				</div>
				<div class="operation">
					<div class="item" @tap="goUrl('detail?hash='+item.hash)">
						<fa-FontAwesome type="far fa-comment-alt" size="28" class="mr-10" color="#666"></fa-FontAwesome>
						{{item.commentNumber}}
					</div>
					<div class="item" @tap="star(item)">
						<fa-FontAwesome type="fas fa-star" size="28" class="mr-10" color="#ffc107" v-show="item.isStar">
						</fa-FontAwesome>
						<fa-FontAwesome type="far fa-star" size="28" class="mr-10" color="#666" v-show="!item.isStar">
						</fa-FontAwesome>
						{{item.star}}
					</div>
					<div class="item" @tap="praise(item)">
						<u-icon v-show="!item.isPraise" class="mr-10" name="thumb-up" :size="30" color="#666"></u-icon>
						<u-icon v-show="item.isPraise" class="mr-10" name="thumb-up-fill" color="#f04a82" :size="30">
						</u-icon>
						{{item.praise}}
					</div>
				</div>
			</div>
		</div>
		<u-action-sheet :list="moreList" v-model="moreShow" @click="handleOpera"></u-action-sheet>
		<div class="empty" v-show="postList.length === 0">
			<u-empty :text="i18n.noData" mode="list"></u-empty>
		</div>
		<u-loadmore bg-color="rgba(0,0,0,0)" margin-bottom="20" :status="more" v-show="postList.length > 0" />
	</view>
</template>

<script>
	import {
		getStore,
		setStore
	} from '@/util/service'
	import moment from 'moment';
	export default {
		data() {
			return {
				language: getStore('language'),
				index: 0, //类别ID
				cateInfo: {
					value: 1,
					label: ''
				}, //当前类别
				postList: [], //帖子列表
				pageInfo: {
					page: 1,
					pageSize: 10,
					totalPage: 1
				}, //页码信息
				more: 'loadmore', //加载更多
				currentForum: {}, //当前选择的帖子
				moreShow: false, //下箭头控制显示更多操作
			}
		},
		//上拉刷新
		onPullDownRefresh() {
			this.pageInfo.page = 1;
			this.getPostList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},
		//下拉加载
		onReachBottom() {
			this.pageInfo.page++;
			this.getPostList();
		},
		onLoad() {
			this.cateInfo.label = this.i18n.home.newRelease;
			this.getPostList();
			if (!getStore('language')) {
				setStore('language', 'zh-cn');
				this.language = getStore('language');
			}
		},
		computed: {
			//国际化
			i18n() {
				return this.$_i18n.messages[this.$_i18n.locale]
			},
			//类别列表
			categoryList() {
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
			},
			//显示更多操作
			moreList() {
				return [{
					text: this.i18n.Following,
					subText: this.i18n.FollowUser
				}, {
					text: this.i18n.complain,
					subText: this.i18n.complainContent
				}, {
					text: this.i18n.Aeternal,
					subText: this.i18n.AeternalContent
				}, {
					text: this.i18n.AEKnow,
					subText: this.i18n.AEKnowContent
				}]
			}
		},
		methods: {
			//获取帖子列表
			getPostList() {
				let url = '';
				let params = {
					page: this.pageInfo.page,
					size: this.pageInfo.pageSize
				}
				if (this.cateInfo.value === 1) {
					url = '/Content/list';
				} else if (this.cateInfo.value === 2) {
					url = '/Content/hotRec';
				} else if (this.cateInfo.value === 3) {
					url = '/Image/list';
				} else if (this.cateInfo.value === 4) {
					url = '/User/contentList';
				}
				this.$http.post(url, params).then(res => {
					if (res.code === 200) {
						this.pageInfo.totalPage = parseInt(res.data.totalPage);
						this.more = 'loadmore';
						if (this.pageInfo.page === 1) {
							this.postList = res.data.data;
						} else {
							if (this.pageInfo.page > this.pageInfo.totalPage) {
								this.pageInfo.page = this.pageInfo.totalPage;
								this.more = 'nomore';
							} else {
								this.postList = this.postList.concat(res.data.data);
							}
						}
						if (status == 'pullDown') {
							uni.stopPullDownRefresh();
							this.postList = res.data.data;
						}
					} else {
						this.more = 'nomore';
					}
				})
			},
			//选择类别
			selectCategory(val) {
				for (let i in this.categoryList) {
					if (this.categoryList[i].value === val) {
						this.index = i;
						this.cateInfo.value = val;
						this.cateInfo.label = this.categoryList[i].label;
						break;
					}
				}
				this.postList = [];
				this.pageInfo = {
					page: 1,
					pageSize: 10
				}; //页码信息
				this.getPostList();
			},
			//更多操作
			moreOpera(item) {
				this.currentForum = item;
				this.moreShow = true;
				if (this.currentForum.isFocus) {
					this.moreList[0] = {
						text: this.i18n.cancelFollowing,
						subText: this.i18n.cancelFollowingUser
					}
				} else {
					this.moreList[0] = {
						text: this.i18n.Following,
						subText: this.i18n.FollowUser
					}
				}
			},
			//更多操作选择事件
			handleOpera(index) {
				if (index === 0) {
					this.focus();
				} else if (index === 1) {

				} else if (index === 2) {
					window.open('https://mainnet.aeternal.io/transactions/' + this.currentForum.hash)
				} else if (index === 3) {
					window.open('https://www.aeknow.org/block/transaction/' + this.currentForum.hash);
				}
			},
			//是否点赞
			praise(item) {
				let params = {
					hash: item.hash,
					type: 'topic'
				}
				this.$http.post('/Submit/praise', params).then(res => {
					if (res.code === 200) {
						item.isPraise = res.data.isPraise;
						item.praise = res.data.praise;
					}
				})
			},
			//是否关注
			focus() {
				let params = {
					userAddress: this.currentForum.users.userAddress
				}
				this.$http.post('/Submit/focus', params).then(res => {
					if (res.code === 200) {
						for (let i = 0; i < this.postList.length; i++) {
							if (this.postList[i].users.userAddress === this.currentForum.users.userAddress) {
								this.postList[i].isFocus = res.data.isFocus;
							}
						}
					}
				})
			},
			//是否收藏
			star(item) {
				let params = {
					hash: item.hash
				}
				this.$http.post('/Submit/contentStar', params).then(res => {
					if (res.code === 200) {
						item.isStar = res.data.isStar;
						item.star = res.data.star;
					}
				})
			},
			//切换语言
			selectLanguage() {
				if (getStore('language') === 'zh-cn') {
					setStore('language', 'en');
				} else if (getStore('language') === 'en') {
					setStore('language', 'zh-cn');
				}
				//控制语言显示
				this.language = getStore('language')
				moment.locale(getStore('language'));
				this.$_i18n.locale = getStore('language');
				let index = parseInt(this.index) + 1;
				this.cateInfo.value = index;
				this.cateInfo.label = this.categoryList[this.index].label;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		.nav {
			width: 100%;
			position: relative;

			.u-dropdown {
				background-color: #fafafa;
				border-bottom: 1rpx solid #ddd;
				height: 44px;
			}

			.left {
				position: absolute;
				height: 44px;
				left: 25rpx;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 100;
			}

			.right {
				position: absolute;
				height: 44px;
				right: 20rpx;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 100;
			}
		}


		.forum {
			&-item {
				background-color: #fff;
				border-bottom: 2rpx solid #ececec;
				margin-bottom: 20rpx;

				.user-area {
					padding: 20rpx;
					display: flex;

					.head-box {
						margin-right: 20rpx;
						position: relative;

						.user-head {
							width: 70rpx;
							height: 70rpx;
							border-radius: 50%;
							box-sizing: border-box;
						}

						.level {
							position: absolute;
							right: -8rpx;
							bottom: 2rpx;
							width: 34rpx;
							height: 34rpx;
							background-color: #d62900;
							font-size: 24rpx;
							border-radius: 50%;
							color: #fff;
							display: flex;
							justify-content: center;
							align-items: center;
							border: 4rpx solid #ffd982;
							box-sizing: border-box;

							.text {
								transform: scale(0.65);
							}
						}
					}

					.user-info {
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						width: 100%;

						.user {
							width: 100%;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.name {
								font-size: 28rpx;

								text {
									color: #f04a82;
									font-size: 20rpx;
									margin-left: 20rpx;
								}
							}
						}

						.time {
							font-size: 24rpx;
							color: #91908e;
							width: 100%;

							text {
								color: #999;
								margin-right: 20rpx;
							}
						}
					}

				}

				.main-content {
					margin: 0 30rpx 0rpx 30rpx;
					padding: 0 0 25rpx 0;
					font-size: 26rpx;
					border-bottom: 2rpx solid #e9e9e9;

					.text-content {
						margin-bottom: 20rpx;
						word-wrap: break-word;
						word-break: normal;
						overflow: hidden;
					}
				}

				.operation {
					height: 80rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					color: #666;
				}
			}
		}
	}
</style>
