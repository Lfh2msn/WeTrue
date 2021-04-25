<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<div class="head-box">
						<image class="user-head" mode="aspectFill" :src="commentInfo.users.portrait"
							v-if="commentInfo.users.portrait"></image>
						<image class="user-head" mode="aspectFill" src="../../static/default_head.png" v-else></image>
						<div class="level">
							<text class="text">V{{commentInfo.users.userActive}}</text>
						</div>
					</div>
					<view class="user-info">
						<view class="name">{{ commentInfo.users.nickname }}</view>
						<view class="date"><text class="address">ID:{{commentInfo.users.userAddress.slice(-4)}}</text>{{ $moment(commentInfo.utcTime).format('MM-DD HH:mm:ss') }}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: commentInfo.isPraise }">
					{{ commentInfo.praise }}
					<u-icon v-if="!commentInfo.isPraise" name="thumb-up" class="like" color="#9a9a9a" :size="30" @click="praise('comment')"></u-icon>
					<u-icon v-if="commentInfo.isPraise" name="thumb-up-fill" class="like" :size="30" @click="praise('comment')"></u-icon>
				</view>
			</view>
			<view class="content">{{ commentInfo.payload }}</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top"><text class="mr-6">全部回复</text>{{ replyList.length }}</view>
			<view class="item" v-for="(item, index) in replyList" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<div class="head-box">
								<image class="user-head" mode="aspectFill" :src="item.users.portrait"
									v-if="item.users.portrait"></image>
								<image class="user-head" mode="aspectFill" src="../../static/default_head.png" v-else></image>
								<div class="level">
									<text class="text">V{{item.users.userActive}}</text>
								</div>
							</div>
							<view class="user-info">
								<view class="name">{{ item.users.nickname }}</view>
								<view class="date"><text class="address">ID:{{item.users.userAddress.slice(-4)}}</text>{{ $moment(item.utcTime).format('MM-DD HH:mm:ss') }}</view>
							</view>
						</view>
						<view class="right"  :class="{ highlight: item.isPraise }">
							<view class="num">{{ item.praise }}</view>
							<u-icon v-if="!item.isPraise" name="thumb-up" class="like" :size="30" color="#9a9a9a" @click="praise('reply',item)"></u-icon>
							<u-icon v-if="item.isPraise" name="thumb-up-fill" class="like" :size="30" @click="praise('reply',item)"></u-icon>
						</view>
					</view>
					<view class="content">{{ item.payload }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			replyList: [],//回复评论列表
			commentInfo: {
				users: {
					portrait: '',
					userAddress: ''
				}
			},//评论信息
			pageInfo: {
				page: 1,
				pageSize: 10,
				totalPage: 1
			}, //页码信息
			more: 'loadmore', //加载更多
		};
	},
	//上拉刷新
	onPullDownRefresh() {
		this.pageInfo.page = 1;
		this.getReply();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 500);
	},
	//下拉加载
	onReachBottom() {
		this.pageInfo.page++;
		this.getReply();
	},
	onLoad(option) {
		this.hash = option.hash;
		this.getCommentInfo();
		this.getReply();
	},
	methods: {
		//获取评论详情
		getCommentInfo() {
			let params = {
				hash: this.hash
			}
			this.$http.post('/Content/tx', params).then(res => {
				if (res.code === 200) {
					this.commentInfo = res.data;
				}
			})
		},
		// 回复列表
		getReply() {
			let params = {
				hash: this.hash,
				currentPage: this.pageInfo.page,
				perPage: this.pageInfo.pageSize
			}
			this.$http.post('/Comment/list', params).then(res => {
				if (res.code === 200) {
					this.pageInfo.totalPage = parseInt(res.data.totalPage);
					this.more = 'loadmore';
					if (this.pageInfo.page === 1) {
						this.replyList = res.data.data;
					} else {
						if (this.pageInfo.page >= this.pageInfo.totalPage) {
							this.pageInfo.page = this.pageInfo.totalPage;
							this.more = 'nomore';
						} else {
							this.replyList = this.replyList.concat(res.data.data);
						}
					}
					if (status == 'pullDown') {
						uni.stopPullDownRefresh();
						this.replyList = res.data.data;
					}
				} else {
					this.more = 'nomore';
				}
			})
		},
		//是否点赞
		praise(type, item) {
			if (type === 'comment') {
				let params = {
					hash: this.hash,
					type: type
				}
				this.$http.post('/Submit/praise', params).then(res => {
					if (res.code === 200) {
						this.commentInfo.isPraise = res.data.isPraise;
						this.commentInfo.praise = res.data.praise;
					}
				})
			} else if (type === 'reply') {
				let params = {
					hash: item.hash,
					type: type
				}
				this.$http.post('/Submit/praise', params).then(res => {
					if (res.code === 200) {
						item.isPraise = res.data.isPraise;
						item.praise = res.data.praise;
					}
				})
			}
		},
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
.comment {
	padding: 30rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	.top {
		display: flex;
		justify-content: space-between;
	}
	.content{
		font-size: 26rpx;
		padding:20rpx 0 0 0;
	}
	.left {
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
			margin-left: 10rpx;
			.name {
				color: #333;
				font-size: 28rpx;
				margin-bottom: 4rpx;
			}
			.date {
				font-size: 20rpx;
				color: $u-light-color;
				.address{
					font-size: 24rpx;
					margin-right:20rpx;
				}
			}
		}
	}
	.right {
		display: flex;
		font-size: 20rpx;
		align-items: center;
		color: #9a9a9a;
		.like {
			margin-left: 6rpx;
		}
		.num{
			font-size: 26rpx;
			color: #9a9a9a;
		}
	}
	.highlight {
		color: #f04a82;
		.num{
			color: #f04a82;
		}
	}
}
.all-reply {
	margin-top: 10rpx;
	padding-top: 20rpx;
	background-color: #ffffff;
	.all-reply-top {
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #f04a82;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		border-bottom: solid 2rpx $u-border-color;
	}
	.reply {
		padding: 20rpx;
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;
		margin: 10rpx 0;
		.username {
			font-size: 24rpx;
			color: #7a7a7a;
		}
	}
}
</style>
