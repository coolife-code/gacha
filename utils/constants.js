// 常量定义

// 应用配置
const APP_CONFIG = {
  NAME: '网页扭蛋机',
  VERSION: '1.0.0',
  DESCRIPTION: '发现有趣网站的扭蛋机小程序'
};

// 颜色配置
const COLORS = {
  PRIMARY: '#07c160',
  SUCCESS: '#07c160',
  WARNING: '#ff976a',
  DANGER: '#ff4d4f',
  INFO: '#1989fa',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#e8e8e8',
  BACKGROUND: '#f5f5f5',
  WHITE: '#ffffff'
};

// 扭蛋机配置
const GACHA_CONFIG = {
  // 每日免费次数
  DAILY_FREE_COUNT: 5,
  
  // 扭蛋池配置
  POOL: [
    { type: 'common', probability: 0.6, name: '普通网站' },
    { type: 'rare', probability: 0.3, name: '稀有网站' },
    { type: 'epic', probability: 0.08, name: '史诗网站' },
    { type: 'legendary', probability: 0.02, name: '传说网站' }
  ],
  
  // 网站库（示例数据）
  WEBSITES: [
    // 开发工具类
    { title: 'GitHub', url: 'https://github.com', type: 'common', tags: ['开发', '代码'] },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com', type: 'common', tags: ['开发', '问答'] },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'common', tags: ['开发', '文档'] },
    { title: 'CSS Tricks', url: 'https://css-tricks.com', type: 'common', tags: ['前端', 'CSS'] },
    
    // 设计资源类
    { title: 'Dribbble', url: 'https://dribbble.com', type: 'rare', tags: ['设计', '创意'] },
    { title: 'Behance', url: 'https://www.behance.net', type: 'rare', tags: ['设计', '作品'] },
    { title: 'Awwwards', url: 'https://www.awwwards.com', type: 'epic', tags: ['设计', '奖项'] },
    
    // 产品发现类
    { title: 'Product Hunt', url: 'https://www.producthunt.com', type: 'rare', tags: ['产品', '发现'] },
    { title: 'Hacker News', url: 'https://news.ycombinator.com', type: 'common', tags: ['科技', '新闻'] },
    
    // 学习资源类
    { title: 'Coursera', url: 'https://www.coursera.org', type: 'common', tags: ['学习', '课程'] },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org', type: 'common', tags: ['学习', '教育'] },
    { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'common', tags: ['编程', '学习'] },
    
    // 工具类
    { title: 'Canva', url: 'https://www.canva.com', type: 'common', tags: ['设计', '工具'] },
    { title: 'Notion', url: 'https://www.notion.so', type: 'rare', tags: ['笔记', '工具'] },
    { title: 'Figma', url: 'https://www.figma.com', type: 'epic', tags: ['设计', '协作'] },
    
    // 娱乐类
    { title: 'YouTube', url: 'https://www.youtube.com', type: 'common', tags: ['视频', '娱乐'] },
    { title: 'Netflix', url: 'https://www.netflix.com', type: 'rare', tags: ['视频', '娱乐'] },
    { title: 'Spotify', url: 'https://www.spotify.com', type: 'common', tags: ['音乐', '娱乐'] }
  ]
};

// 存储键名
const STORAGE_KEYS = {
  USER_INFO: 'user_info',
  COLLECTIONS: 'collections',
  GACHA_HISTORY: 'gacha_history',
  DAILY_GACHA_COUNT: 'daily_gacha_count',
  LAST_GACHA_DATE: 'last_gacha_date',
  FOLLOW_LIST: 'follow_list',
  FANS_LIST: 'fans_list',
  FEED_LIST: 'feed_list'
};

// 页面路径
const PAGE_PATHS = {
  GACHA: '/pages/gacha/gacha',
  COLLECTION: '/pages/collection/collection',
  SOCIAL: '/pages/social/social',
  PROFILE: '/pages/profile/profile',
  DETAIL: '/pages/detail/detail'
};

// 错误码
const ERROR_CODES = {
  NETWORK_ERROR: 1001,
  API_ERROR: 1002,
  AUTH_ERROR: 1003,
  PARAM_ERROR: 1004,
  NOT_FOUND: 1005,
  RATE_LIMIT: 1006
};

// 事件名称
const EVENT_NAMES = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  GACHA_DRAW: 'gacha_draw',
  COLLECTION_ADD: 'collection_add',
  COLLECTION_REMOVE: 'collection_remove',
  FEED_POST: 'feed_post',
  FEED_LIKE: 'feed_like'
};

// 导出所有常量
module.exports = {
  APP_CONFIG,
  COLORS,
  GACHA_CONFIG,
  STORAGE_KEYS,
  PAGE_PATHS,
  ERROR_CODES,
  EVENT_NAMES
};