<template>
	<view class="index">
		<u-navbar :is-back="false">
			<view class="slot-wrap nav">
				<u-dropdown ref="uDropdown" class="u-dropdown" active-color="#f04a82">
					<u-dropdown-item v-model="cateInfo.value" :title="cateInfo.label" :options="categoryList"
						@change="selectCategory"></u-dropdown-item>
				</u-dropdown>
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
							<div class="name">{{item.users.userName || '匿名'}}</div>
							<div class="more">
								<fa-FontAwesome type="fas fa-angle-down" size="36" class="mr-10" color="#cecece"
									@tap="moreOpera(item)">
								</fa-FontAwesome>
							</div>
						</div>
						<div class="time">{{$moment(item.utcTime).fromNow()}}</div>
					</div>
				</div>
				<div class="main-content">
					<div class="text-content">
						{{item.payload}}
					</div>
					<div class="img-list">
						<u-image width="150rpx" height="150rpx" :src="item.imgTx" v-if="item.imgTx"></u-image>
					</div>
				</div>
				<div class="operation">
					<div class="item">
						<fa-FontAwesome type="far fa-heart" size="28" class="mr-10" color="#666"></fa-FontAwesome>
						<!-- <fa-FontAwesome type="fas fa-heart" size="28" class="mr-10" color="#f04a82"></fa-FontAwesome> -->
						{{item.love}}
					</div>
					<div class="item">
						<fa-FontAwesome type="far fa-comment" size="28" class="mr-10" color="#666"></fa-FontAwesome>
						{{item.commentNumber}}
					</div>
					<div class="item">
						<fa-FontAwesome type="far fa-star" size="28" class="mr-10" color="#666"></fa-FontAwesome>
						<!-- <fa-FontAwesome type="fas fa-star" size="28" class="mr-10" color="#ffc107"></fa-FontAwesome> -->
					</div>
				</div>
			</div>
		</div>
		<u-action-sheet :list="moreList" v-model="moreShow"></u-action-sheet>
		<div class="empty" v-show="postList.length === 0">
			<u-empty text="暂无数据~" mode="list"></u-empty>
		</div>
		<u-loadmore bg-color="rgba(0,0,0,0)" margin-bottom="20" :status="more" v-show="postList.length > 0" />
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
				postList: [], //帖子列表
				pageInfo: {
					page: 1,
					pageSize: 10,
					totalPage: 1
				}, //页码信息
				more: 'loadmore', //加载更多
				moreList: [{
					text: '关注',
					subText: '关注TA'
				}, {
					text: '投诉',
					subText: '投诉反馈不良内容'
				}, {
					text: 'Aeternal',
					subText: '查看帖子在Aeternal的hash地址'
				}, {
					text: 'AEKnow',
					subText: '查看帖子在AEKnow的hash地址'
				}],
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
		},
		computed: {
			i18n() {
				return this.$_i18n.messages[this.$_i18n.locale]
			},
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
		},
		methods: {
			//获取帖子列表
			getPostList() {
				let params = {
					currentPage: this.pageInfo.page,
					perPage: this.pageInfo.pageSize
				}
				this.$http.post('/Content/list', params).then(res => {
					if (res.code === 200) {
						this.pageInfo.totalPage = parseInt(res.data.totalPage);
						this.more = 'loadmore';
						if (this.pageInfo.page === 1) {
							this.postList = res.data.data;
						} else {
							this.postList = this.postList.concat(res.data.data);
						}
						if (status == 'pullDown') {
							uni.stopPullDownRefresh();
							this.postList = res.data.data;
						}
						if (this.pageInfo.page >= this.pageInfo.totalPage) {
							this.pageInfo.page = this.pageInfo.totalPage;
							this.more = 'nomore';
						}
					} else {
						this.more = 'nomore';
					}
				})
			},
			//根据图片哈希获取图片
			getImgByTx() {

			},
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
			//更多操作
			moreOpera(item) {
				this.currentForum = item;
				this.moreShow = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		.nav {
			width: 100%;

			.u-dropdown {
				background-color: #fafafa;
				border-bottom: 1rpx solid #ddd;
				height: 44px;
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
							}
						}

						.time {
							font-size: 20rpx;
							color: #91908e;
							width: 100%;
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
