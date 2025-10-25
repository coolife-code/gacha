// 详情页面逻辑
Page({
  data: {
    websiteUrl: '',
    websiteTitle: '',
    isCollected: false,
    collectTime: '',
    visitCount: 0,
    showWebView: false,
    showShareModal: false,
    showQRModal: false,
    recommendations: []
  },

  onLoad(options) {
    const { url, title } = options;
    
    if (url && title) {
      this.setData({
        websiteUrl: decodeURIComponent(url),
        websiteTitle: decodeURIComponent(title)
      });
      
      this.loadWebsiteInfo();
      this.loadRecommendations();
      this.incrementVisitCount();
    }
  },

  // 加载网站信息
  loadWebsiteInfo() {
    const { websiteUrl } = this.data;
    const collections = wx.getStorageSync('collections') || [];
    
    // 检查是否已收藏
    const existingCollection = collections.find(item => item.url === websiteUrl);
    
    if (existingCollection) {
      this.setData({
        isCollected: true,
        collectTime: existingCollection.createTime,
        visitCount: existingCollection.visitCount || 1
      });
    } else {
      this.setData({
        isCollected: false,
        collectTime: '未收藏',
        visitCount: 1
      });
    }
  },

  // 加载推荐网站
  loadRecommendations() {
    // 模拟推荐数据
    const mockRecommendations = [
      {
        id: '1',
        title: 'GitHub',
        url: 'https://github.com'
      },
      {
        id: '2',
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com'
      },
      {
        id: '3',
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org'
      },
      {
        id: '4',
        title: 'CSS Tricks',
        url: 'https://css-tricks.com'
      }
    ];

    this.setData({ recommendations: mockRecommendations });
  },

  // 增加访问次数
  incrementVisitCount() {
    const { websiteUrl } = this.data;
    const collections = wx.getStorageSync('collections') || [];
    
    const updatedCollections = collections.map(item => {
      if (item.url === websiteUrl) {
        return {
          ...item,
          visitCount: (item.visitCount || 0) + 1,
          lastVisitTime: this.formatTime(new Date())
        };
      }
      return item;
    });

    wx.setStorageSync('collections', updatedCollections);
    
    // 更新显示
    const existingCollection = updatedCollections.find(item => item.url === websiteUrl);
    if (existingCollection) {
      this.setData({
        visitCount: existingCollection.visitCount
      });
    }
  },

  // 打开网站
  onOpenWebsite() {
    const { websiteUrl } = this.data;
    
    // 在小程序内打开web-view
    this.setData({ showWebView: true });
    
    // 或者跳转到外部浏览器
    // wx.setClipboardData({
    //   data: websiteUrl,
    //   success: () => {
    //     wx.showModal({
    //       title: '提示',
    //       content: '链接已复制到剪贴板，请在浏览器中打开',
    //       showCancel: false
    //     });
    //   }
    // });
  },

  // 复制链接
  onCopyUrl() {
    const { websiteUrl } = this.data;
    
    wx.setClipboardData({
      data: websiteUrl,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        });
      }
    });
  },

  // 切换收藏状态
  onToggleCollect() {
    const { websiteUrl, websiteTitle, isCollected } = this.data;
    const collections = wx.getStorageSync('collections') || [];
    
    if (isCollected) {
      // 取消收藏
      const newCollections = collections.filter(item => item.url !== websiteUrl);
      wx.setStorageSync('collections', newCollections);
      
      this.setData({
        isCollected: false,
        collectTime: '未收藏'
      });
      
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } else {
      // 添加收藏
      const newCollection = {
        id: Date.now().toString(),
        title: websiteTitle,
        url: websiteUrl,
        tag: '',
        createTime: this.formatTime(new Date()),
        updateTime: this.formatTime(new Date()),
        visitCount: 1
      };
      
      collections.unshift(newCollection);
      wx.setStorageSync('collections', collections);
      
      this.setData({
        isCollected: true,
        collectTime: newCollection.createTime,
        visitCount: 1
      });
      
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
  },

  // 分享
  onShare() {
    this.setData({ showShareModal: true });
  },

  // 隐藏分享弹窗
  onHideShareModal() {
    this.setData({ showShareModal: false });
  },

  // 生成二维码
  onGenerateQR() {
    this.setData({
      showShareModal: false,
      showQRModal: true
    });
  },

  // 隐藏二维码弹窗
  onHideQRModal() {
    this.setData({ showQRModal: false });
  },

  // 复制分享链接
  onCopyShareLink() {
    const { websiteUrl, websiteTitle } = this.data;
    const shareText = `我发现了一个有趣的网站：${websiteTitle}\n网址：${websiteUrl}`;
    
    wx.setClipboardData({
      data: shareText,
      success: () => {
        wx.showToast({
          title: '分享内容已复制',
          icon: 'success'
        });
        this.setData({ showShareModal: false });
      }
    });
  },

  // 保存二维码（模拟）
  onSaveQR() {
    wx.showToast({
      title: '二维码已保存到相册',
      icon: 'success'
    });
    this.setData({ showQRModal: false });
  },

  // 点击推荐网站
  onRecommendTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/detail/detail?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`
    });
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 分享功能
  onShareAppMessage() {
    const { websiteUrl, websiteTitle } = this.data;
    return {
      title: `发现有趣的网站：${websiteTitle}`,
      path: `/pages/detail/detail?url=${encodeURIComponent(websiteUrl)}&title=${encodeURIComponent(websiteTitle)}`,
      imageUrl: '' // 可以设置分享图片
    };
  }
})