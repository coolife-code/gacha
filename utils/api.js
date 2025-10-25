// API接口管理

const baseURL = 'https://api.example.com'; // 替换为实际API地址

// 请求封装
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url.startsWith('http') ? url : baseURL + url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 用户相关API
const userAPI = {
  // 获取用户信息
  getUserInfo() {
    return request('/user/info');
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return request('/user/update', { method: 'POST', data });
  },
  
  // 获取用户统计
  getUserStats() {
    return request('/user/stats');
  }
};

// 收藏相关API
const collectionAPI = {
  // 获取收藏列表
  getCollections(params = {}) {
    return request('/collections', { data: params });
  },
  
  // 添加收藏
  addCollection(data) {
    return request('/collections/add', { method: 'POST', data });
  },
  
  // 更新收藏
  updateCollection(id, data) {
    return request(`/collections/${id}`, { method: 'PUT', data });
  },
  
  // 删除收藏
  deleteCollection(id) {
    return request(`/collections/${id}`, { method: 'DELETE' });
  },
  
  // 搜索收藏
  searchCollections(keyword) {
    return request('/collections/search', { data: { keyword } });
  }
};

// 扭蛋相关API
const gachaAPI = {
  // 获取扭蛋池
  getGachaPool() {
    return request('/gacha/pool');
  },
  
  // 执行扭蛋
  drawGacha() {
    return request('/gacha/draw', { method: 'POST' });
  },
  
  // 获取扭蛋记录
  getGachaHistory() {
    return request('/gacha/history');
  },
  
  // 获取每日免费次数
  getDailyFreeCount() {
    return request('/gacha/daily-free');
  }
};

// 社交相关API
const socialAPI = {
  // 获取动态流
  getFeedList(params = {}) {
    return request('/social/feed', { data: params });
  },
  
  // 发布动态
  postFeed(data) {
    return request('/social/feed/post', { method: 'POST', data });
  },
  
  // 点赞
  likeFeed(feedId) {
    return request(`/social/feed/${feedId}/like`, { method: 'POST' });
  },
  
  // 取消点赞
  unlikeFeed(feedId) {
    return request(`/social/feed/${feedId}/unlike`, { method: 'POST' });
  },
  
  // 获取关注列表
  getFollowList() {
    return request('/social/following');
  },
  
  // 获取粉丝列表
  getFansList() {
    return request('/social/followers');
  },
  
  // 关注用户
  followUser(userId) {
    return request(`/social/follow/${userId}`, { method: 'POST' });
  },
  
  // 取消关注
  unfollowUser(userId) {
    return request(`/social/unfollow/${userId}`, { method: 'POST' });
  }
};

// 网站相关API
const websiteAPI = {
  // 获取网站信息
  getWebsiteInfo(url) {
    return request('/website/info', { data: { url } });
  },
  
  // 获取相关推荐
  getRecommendations(url) {
    return request('/website/recommendations', { data: { url } });
  },
  
  // 报告网站问题
  reportWebsite(data) {
    return request('/website/report', { method: 'POST', data });
  }
};

// 导出所有API
module.exports = {
  request,
  userAPI,
  collectionAPI,
  gachaAPI,
  socialAPI,
  websiteAPI
};