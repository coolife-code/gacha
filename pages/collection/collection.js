// 收藏管理页面逻辑
Page({
  data: {
    collections: [], // 收藏列表
    filteredCollections: [], // 筛选后的收藏列表
    searchKeyword: '', // 搜索关键词
    tags: [], // 标签列表
    activeTag: '', // 当前选中的标签
    showActionSheet: false, // 是否显示操作菜单
    showModal: false, // 是否显示弹窗
    isEditing: false, // 是否为编辑模式
    currentItem: null, // 当前操作的项目
    formData: {
      title: '',
      url: '',
      tag: ''
    }
  },

  onLoad() {
    this.loadCollections();
  },

  onShow() {
    this.loadCollections();
  },

  // 加载收藏列表
  loadCollections() {
    const collections = wx.getStorageSync('collections') || [];
    const tags = [...new Set(collections.map(item => item.tag).filter(tag => tag))];
    
    this.setData({
      collections,
      tags,
      filteredCollections: collections
    });
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterCollections();
  },

  // 标签选择
  onTagSelect(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ activeTag: tag });
    this.filterCollections();
  },

  // 筛选收藏
  filterCollections() {
    const { collections, searchKeyword, activeTag } = this.data;
    
    let filtered = collections.filter(item => {
      // 搜索筛选
      const matchSearch = !searchKeyword || 
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.url.toLowerCase().includes(searchKeyword.toLowerCase());
      
      // 标签筛选
      const matchTag = !activeTag || item.tag === activeTag;
      
      return matchSearch && matchTag;
    });

    this.setData({ filteredCollections: filtered });
  },

  // 点击收藏项
  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/detail/detail?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`
    });
  },

  // 更多操作
  onMoreAction(e) {
    e.stopPropagation();
    const item = e.currentTarget.dataset.item;
    this.setData({
      showActionSheet: true,
      currentItem: item
    });
  },

  // 隐藏操作菜单
  onHideActionSheet() {
    this.setData({ showActionSheet: false });
  },

  // 编辑收藏
  onEditCollection() {
    const { currentItem } = this.data;
    this.setData({
      showActionSheet: false,
      showModal: true,
      isEditing: true,
      formData: {
        title: currentItem.title,
        url: currentItem.url,
        tag: currentItem.tag || ''
      }
    });
  },

  // 删除收藏
  onDeleteCollection() {
    const { currentItem, collections } = this.data;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个收藏吗？',
      success: (res) => {
        if (res.confirm) {
          const newCollections = collections.filter(item => item.id !== currentItem.id);
          wx.setStorageSync('collections', newCollections);
          this.loadCollections();
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
        this.setData({ showActionSheet: false });
      }
    });
  },

  // 添加收藏
  onAddCollection() {
    this.setData({
      showModal: true,
      isEditing: false,
      formData: { title: '', url: '', tag: '' }
    });
  },

  // 隐藏弹窗
  onHideModal() {
    this.setData({ showModal: false });
  },

  // 表单输入
  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 提交表单
  onSubmitForm() {
    const { formData, isEditing, currentItem, collections } = this.data;
    
    // 验证表单
    if (!formData.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    
    if (!formData.url.trim()) {
      wx.showToast({ title: '请输入网址', icon: 'none' });
      return;
    }

    // 验证网址格式
    if (!this.isValidUrl(formData.url)) {
      wx.showToast({ title: '请输入有效的网址', icon: 'none' });
      return;
    }

    let newCollections = [...collections];
    
    if (isEditing) {
      // 编辑模式
      const index = newCollections.findIndex(item => item.id === currentItem.id);
      if (index !== -1) {
        newCollections[index] = {
          ...currentItem,
          title: formData.title.trim(),
          url: this.normalizeUrl(formData.url.trim()),
          tag: formData.tag.trim(),
          updateTime: this.formatTime(new Date())
        };
      }
    } else {
      // 添加模式
      const newItem = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        url: this.normalizeUrl(formData.url.trim()),
        tag: formData.tag.trim(),
        createTime: this.formatTime(new Date()),
        updateTime: this.formatTime(new Date())
      };
      newCollections.unshift(newItem);
    }

    wx.setStorageSync('collections', newCollections);
    this.loadCollections();
    this.setData({ showModal: false });
    wx.showToast({ 
      title: isEditing ? '编辑成功' : '添加成功', 
      icon: 'success' 
    });
  },

  // 验证网址格式
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // 标准化网址
  normalizeUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  },

  // 打开网址
  onOpenUrl(e) {
    e.stopPropagation();
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/pages/detail/detail?url=${encodeURIComponent(url)}`
    });
  },

  // 分享
  onShare(e) {
    e.stopPropagation();
    const item = e.currentTarget.dataset.item;
    wx.showShareMenu({
      withShareTicket: true
    });
    
    // 这里可以设置分享内容
    wx.showToast({ title: '已生成分享链接', icon: 'success' });
  },

  // 去抽取
  onGoGacha() {
    wx.switchTab({
      url: '/pages/gacha/gacha'
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
    return {
      title: '我的网址收藏',
      path: '/pages/collection/collection'
    };
  }
})