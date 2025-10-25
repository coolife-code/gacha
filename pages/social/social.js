// 社交页面逻辑
Page({
  data: {
    activeTab: 'feed', // 当前激活的标签页
    feedList: [], // 动态列表
    followList: [], // 关注列表
    fansList: [], // 粉丝列表
    showPostModal: false, // 是否显示发布弹窗
    postContent: '', // 发布内容
    selectedCollection: null // 选中的收藏
  },

  onLoad() {
    this.loadSocialData();
  },

  onShow() {
    this.loadSocialData();
  },

  // 加载社交数据
  loadSocialData() {
    // 模拟数据
    const mockFeedList = [
      {
        id: '1',
        user: {
          id: 'user1',
          name: '小明',
          avatar: '/images/avatar1.jpg'
        },
        content: '发现了一个很棒的设计网站，分享给大家！',
        collection: {
          title: 'Dribbble - 设计师社区',
          url: 'https://dribbble.com'
        },
        time: '2小时前',
        likeCount: 12,
        commentCount: 3,
        isLiked: false,
        isFollowing: false
      },
      {
        id: '2',
        user: {
          id: 'user2',
          name: '小红',
          avatar: '/images/avatar2.jpg'
        },
        content: '今天抽到了一个很有趣的网站，推荐给大家看看～',
        collection: {
          title: 'Product Hunt - 新产品发现',
          url: 'https://www.producthunt.com'
        },
        time: '5小时前',
        likeCount: 8,
        commentCount: 2,
        isLiked: true,
        isFollowing: true
      }
    ];

    const mockFollowList = [
      {
        id: 'user2',
        name: '小红',
        avatar: '/images/avatar2.jpg',
        desc: '网站收藏达人'
      },
      {
        id: 'user3',
        name: '小刚',
        avatar: '/images/avatar3.jpg',
        desc: '前端开发工程师'
      }
    ];

    const mockFansList = [
      {
        id: 'user4',
        name: '小李',
        avatar: '/images/avatar4.jpg',
        desc: '互联网产品经理',
        isFollowing: false
      }
    ];

    this.setData({
      feedList: mockFeedList,
      followList: mockFollowList,
      fansList: mockFansList
    });
  },

  // 切换标签页
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 关注用户
  onFollow(e) {
    const user = e.currentTarget.dataset.user;
    wx.showToast({
      title: `已关注${user.name}`,
      icon: 'success'
    });
    
    // 更新关注状态
    const { feedList, fansList } = this.data;
    const updatedFeedList = feedList.map(item => {
      if (item.user.id === user.id) {
        return { ...item, isFollowing: true };
      }
      return item;
    });

    const updatedFansList = fansList.map(item => {
      if (item.id === user.id) {
        return { ...item, isFollowing: true };
      }
      return item;
    });

    this.setData({
      feedList: updatedFeedList,
      fansList: updatedFansList
    });
  },

  // 取消关注
  onUnfollow(e) {
    const user = e.currentTarget.dataset.user;
    wx.showModal({
      title: '确认取消关注',
      content: `确定要取消关注${user.name}吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已取消关注',
            icon: 'success'
          });

          // 更新关注状态
          const { feedList, followList, fansList } = this.data;
          
          const updatedFeedList = feedList.map(item => {
            if (item.user.id === user.id) {
              return { ...item, isFollowing: false };
            }
            return item;
          });

          const updatedFollowList = followList.filter(item => item.id !== user.id);
          const updatedFansList = fansList.map(item => {
            if (item.id === user.id) {
              return { ...item, isFollowing: false };
            }
            return item;
          });

          this.setData({
            feedList: updatedFeedList,
            followList: updatedFollowList,
            fansList: updatedFansList
          });
        }
      }
    });
  },

  // 点赞
  onLike(e) {
    const item = e.currentTarget.dataset.item;
    const { feedList } = this.data;
    
    const updatedFeedList = feedList.map(feed => {
      if (feed.id === item.id) {
        return {
          ...feed,
          isLiked: !feed.isLiked,
          likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1
        };
      }
      return feed;
    });

    this.setData({ feedList: updatedFeedList });
    
    wx.showToast({
      title: item.isLiked ? '取消点赞' : '点赞成功',
      icon: 'success'
    });
  },

  // 评论
  onComment(e) {
    const item = e.currentTarget.dataset.item;
    wx.showToast({
      title: '跳转评论页面',
      icon: 'none'
    });
  },

  // 分享
  onShare(e) {
    const item = e.currentTarget.dataset.item;
    wx.showShareMenu({
      withShareTicket: true
    });
    
    wx.showToast({
      title: '已生成分享链接',
      icon: 'success'
    });
  },

  // 查看收藏
  onViewCollection(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/detail/detail?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`
    });
  },

  // 发布动态
  onPost() {
    this.setData({
      showPostModal: true,
      postContent: '',
      selectedCollection: null
    });
  },

  // 隐藏发布弹窗
  onHidePostModal() {
    this.setData({ showPostModal: false });
  },

  // 发布内容输入
  onPostInput(e) {
    this.setData({ postContent: e.detail.value });
  },

  // 选择收藏
  onSelectCollection() {
    wx.navigateTo({
      url: '/pages/collection/collection?selectMode=true'
    });
  },

  // 提交发布
  onSubmitPost() {
    const { postContent } = this.data;
    
    if (!postContent.trim()) {
      wx.showToast({
        title: '请输入发布内容',
        icon: 'none'
      });
      return;
    }

    // 模拟发布成功
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });

    this.setData({ showPostModal: false });
    
    // 刷新动态列表
    this.loadSocialData();
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '发现有趣的网站',
      path: '/pages/social/social'
    };
  }
})