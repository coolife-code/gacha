// pages/gacha/gacha.js
Page({
  data: {
    // 用户信息
    userInfo: {},
    
    // 扭蛋状态
    canDraw: true,
    remainingDraws: 5,
    todayDraws: 0,
    totalDraws: 0,
    streakDays: 1,
    collectionCount: 0,
    
    // 动画状态
    animationState: '',
    showResult: false,
    currentCapsule: null,
    
    // 数据
    resultData: {},
    historyList: [],
    
    // 特效
    particles: []
  },

  onLoad() {
    this.initPage()
  },

  onShow() {
    this.checkDrawStatus()
    this.loadHistory()
    this.loadStats()
  },

  // 初始化页面
  initPage() {
    this.initUserInfo()
    this.initParticles()
    this.checkDrawStatus()
    this.loadHistory()
    this.loadStats()
  },

  // 初始化用户信息
  initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userInfo: {
        avatarUrl: userInfo.avatarUrl || '',
        nickName: userInfo.nickName || '神秘扭蛋师'
      }
    })
  },

  // 初始化粒子特效
  initParticles() {
    const particles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }))
    this.setData({ particles })
  },

  // 检查抽取状态
  checkDrawStatus() {
    const today = new Date().toDateString()
    const lastDrawDate = wx.getStorageSync('lastDrawDate')
    
    // 检查是否需要重置每日次数
    if (lastDrawDate !== today) {
      wx.setStorageSync('dailyDrawCount', 0)
      wx.setStorageSync('lastDrawDate', today)
      
      // 更新连续天数
      this.updateStreakDays(lastDrawDate, today)
    }
    
    const dailyDrawCount = wx.getStorageSync('dailyDrawCount') || 0
    const remainingDraws = Math.max(0, 5 - dailyDrawCount)
    const canDraw = remainingDraws > 0
    
    this.setData({
      remainingDraws,
      canDraw,
      todayDraws: dailyDrawCount
    })
  },

  // 更新连续天数
  updateStreakDays(lastDate, today) {
    if (!lastDate) return
    
    const last = new Date(lastDate)
    const current = new Date(today)
    const diffTime = current - last
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    let streakDays = wx.getStorageSync('streakDays') || 1
    
    if (diffDays === 1) {
      streakDays += 1
    } else if (diffDays > 1) {
      streakDays = 1 // 中断连续
    }
    
    wx.setStorageSync('streakDays', streakDays)
    this.setData({ streakDays })
  },

  // 开始扭蛋
  startDraw() {
    if (!this.data.canDraw) {
      this.showToast('今日次数已用完')
      return
    }

    this.setData({
      animationState: 'shake',
      showResult: false,
      currentCapsule: { type: 'normal' }
    })

    // 扭蛋动画
    setTimeout(() => {
      this.setData({ animationState: 'drop' })
      
      setTimeout(() => {
        this.performDraw()
      }, 1000)
    }, 500)
  },

  // 执行扭蛋逻辑
  performDraw() {
    // 扭蛋结果库
    const results = [
      {
        id: 1,
        title: 'GitHub - 代码托管平台',
        url: 'https://github.com',
        description: '全球最大的开源代码托管平台',
        favicon: 'https://github.com/favicon.ico',
        tags: ['编程', '开源', '代码'],
        collected: false
      },
      {
        id: 2,
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        description: '程序员问答社区',
        favicon: 'https://stackoverflow.com/favicon.ico',
        tags: ['问答', '技术', '编程'],
        collected: false
      },
      {
        id: 3,
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        description: 'Web技术文档和教程',
        favicon: 'https://developer.mozilla.org/favicon.ico',
        tags: ['文档', 'Web开发', '教程'],
        collected: false
      },
      {
        id: 4,
        title: 'Dev.to',
        url: 'https://dev.to',
        description: '开发者社区和博客平台',
        favicon: 'https://dev.to/favicon.ico',
        tags: ['社区', '博客', '技术'],
        collected: false
      },
      {
        id: 5,
        title: 'CSS-Tricks',
        url: 'https://css-tricks.com',
        description: '前端开发和CSS技巧',
        favicon: 'https://css-tricks.com/favicon.ico',
        tags: ['CSS', '前端', '设计'],
        collected: false
      }
    ]

    // 随机选择结果
    const randomIndex = Math.floor(Math.random() * results.length)
    const result = {...results[randomIndex]}
    
    // 更新抽取记录
    this.updateDrawRecords(result)
    
    // 显示结果
    this.showResult(result)
  },

  // 更新抽取记录
  updateDrawRecords(result) {
    const today = new Date().toDateString()
    
    // 更新每日次数
    const dailyDrawCount = (wx.getStorageSync('dailyDrawCount') || 0) + 1
    wx.setStorageSync('dailyDrawCount', dailyDrawCount)
    
    // 更新总次数
    const totalDraws = (wx.getStorageSync('totalDraws') || 0) + 1
    wx.setStorageSync('totalDraws', totalDraws)
    
    // 保存抽取记录
    const drawRecord = {
      id: Date.now(),
      ...result,
      drawTime: new Date().toISOString()
    }
    
    const history = wx.getStorageSync('drawHistory') || []
    history.unshift(drawRecord)
    // 只保留最近20条记录
    wx.setStorageSync('drawHistory', history.slice(0, 20))
  },

  // 显示结果
  showResult(result) {
    this.setData({
      resultData: result,
      showResult: true,
      animationState: ''
    })
    
    // 更新UI状态
    this.checkDrawStatus()
    this.loadHistory()
    this.loadStats()
  },

  // 关闭结果
  closeResult() {
    this.setData({ showResult: false })
  },

  // 打开网页
  openUrl() {
    if (!this.data.resultData.url) {
      this.showToast('网址信息错误')
      return
    }
    
    const url = this.data.resultData.url
    wx.navigateTo({
      url: `/pages/detail/detail?url=${encodeURIComponent(url)}`
    })
    this.closeResult()
  },

  // 切换收藏状态
  toggleCollect() {
    const result = this.data.resultData
    if (!result) return
    
    const collections = wx.getStorageSync('collections') || []
    const existingIndex = collections.findIndex(item => item.id === result.id)
    
    if (existingIndex > -1) {
      // 取消收藏
      collections.splice(existingIndex, 1)
      result.collected = false
      this.showToast('已取消收藏')
    } else {
      // 添加收藏
      collections.unshift({
        ...result,
        collectTime: new Date().toISOString()
      })
      result.collected = true
      this.showToast('收藏成功')
    }
    
    wx.setStorageSync('collections', collections)
    this.setData({ 
      'resultData.collected': result.collected 
    })
    this.loadStats()
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('drawHistory') || []
    this.setData({ 
      historyList: history.slice(0, 10) // 只显示最近10条
    })
  },

  // 加载统计数据
  loadStats() {
    const totalDraws = wx.getStorageSync('totalDraws') || 0
    const collections = wx.getStorageSync('collections') || []
    const todayDraws = wx.getStorageSync('dailyDrawCount') || 0
    const streakDays = wx.getStorageSync('streakDays') || 1
    
    this.setData({
      totalDraws,
      collectionCount: collections.length,
      todayDraws,
      streakDays
    })
  },

  // 查看历史记录
  viewHistory(e) {
    const item = e.currentTarget.dataset.item
    if (item && item.url) {
      wx.navigateTo({
        url: `/pages/detail/detail?url=${encodeURIComponent(item.url)}`
      })
    }
  },

  // 显示提示
  showToast(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  },

  // 分享功能
  onShareAppMessage() {
    const result = this.data.resultData
    return {
      title: result ? `我在网页扭蛋机抽到了：${result.title}` : '网页扭蛋机',
      path: '/pages/gacha/gacha'
    }
  },

  onShareTimeline() {
    const result = this.data.resultData
    return {
      title: result ? `网页扭蛋机 - ${result.title}` : '网页扭蛋机'
    }
  }
})