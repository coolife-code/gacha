// pages/profile/profile.js
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      bio: ''
    },
    collections: [],
    totalDraws: 0,
    followingCount: 0,
    followersCount: 0,
    activeTab: 'collections',
    drawRecords: [],
    following: [],
    followers: [],
    userLevel: 1,
    sortType: 'time',
    filterTag: ''
  },

  onLoad: function(options) {
    this.loadUserInfo();
    this.loadCollections();
    this.loadDrawRecords();
    this.loadSocialData();
  },

  onShow: function() {
    // 页面显示时刷新数据
    this.loadCollections();
    this.loadDrawRecords();
  },

  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userInfo: {
        avatarUrl: userInfo.avatarUrl || '',
        nickName: userInfo.nickName || '游客',
        bio: userInfo.bio || '这个人很懒，什么都没写'
      }
    });
  },

  // 加载收藏列表
  loadCollections: function() {
    const collections = wx.getStorageSync('collections') || [];
    this.setData({
      collections: collections
    });
  },

  // 加载抽取记录
  loadDrawRecords: function() {
    const drawRecords = wx.getStorageSync('drawRecords') || [];
    this.setData({
      drawRecords: drawRecords,
      totalDraws: drawRecords.length
    });
  },

  // 加载社交数据
  loadSocialData: function() {
    const following = wx.getStorageSync('following') || [];
    const followers = wx.getStorageSync('followers') || [];
    
    this.setData({
      following: following,
      followers: followers,
      followingCount: following.length,
      followersCount: followers.length
    });
  },

  // 切换标签页
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 查看收藏详情
  viewUrlDetail: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/pages/detail/detail?url=${encodeURIComponent(url)}`
    });
  },

  // 查看收藏列表
  viewCollections: function() {
    this.setData({
      activeTab: 'collections'
    });
  },

  // 查看抽取记录
  viewDrawRecords: function() {
    this.setData({
      activeTab: 'records'
    });
  },

  // 查看关注列表
  viewFollowing: function() {
    wx.showToast({
      title: '查看关注列表',
      icon: 'none'
    });
  },

  // 查看粉丝列表
  viewFollowers: function() {
    wx.showToast({
      title: '查看粉丝列表',
      icon: 'none'
    });
  },

  // 查看用户资料
  viewUserProfile: function(e) {
    const user = e.currentTarget.dataset.user;
    wx.showToast({
      title: `查看 ${user.nickname} 的资料`,
      icon: 'none'
    });
  },

  // 删除收藏
  removeCollection: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个收藏吗？',
      success: (res) => {
        if (res.confirm) {
          const collections = this.data.collections.filter(item => item.id !== id);
          wx.setStorageSync('collections', collections);
          this.setData({
            collections: collections
          });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 编辑资料
  editProfile: function() {
    wx.showModal({
      title: '编辑资料',
      content: '编辑资料功能开发中',
      showCancel: false
    });
  },

  // 清理缓存
  clearCache: function() {
    wx.showModal({
      title: '清理缓存',
      content: '确定要清理所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.loadUserInfo();
          this.loadCollections();
          this.loadDrawRecords();
          this.loadSocialData();
          wx.showToast({
            title: '缓存清理成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 关于应用
  aboutApp: function() {
    wx.showModal({
      title: '关于网页扭蛋机',
      content: '一个有趣的网页收藏和分享小程序\n版本: 1.0.0',
      showCancel: false
    });
  },

  // 格式化时间
  formatTime: function(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) { // 1天内
      return Math.floor(diff / 3600000) + '小时前';
    } else if (diff < 604800000) { // 1周内
      return Math.floor(diff / 86400000) + '天前';
    } else {
      return date.getFullYear() + '-' + 
             (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
             date.getDate().toString().padStart(2, '0');
    }
  }
});