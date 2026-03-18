// 主题配置类型
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;        // 主色
    secondary: string;      // 辅助色
    success: string;        // 成功色
    warning: string;        // 警告色
    error: string;          // 错误色
    background: string;     // 页面背景
    cardBg: string;         // 卡片背景
    textPrimary: string;    // 主文字色
    textSecondary: string;  // 次要文字色
    border: string;         // 边框色
    headerBg: string;       // 头部背景
    footerBg: string;       // 底部背景
    gradientStart: string;  // 渐变起始色
    gradientEnd: string;    // 渐变结束色
  };
}

// 预设主题列表
export const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'default-blue',
    name: '经典蓝',
    description: '专业稳重的蓝色系，适合企业官网',
    colors: {
      primary: '#1677ff',
      secondary: '#69b1ff',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#f5f5f5',
      cardBg: '#ffffff',
      textPrimary: '#333333',
      textSecondary: '#666666',
      border: '#e8e8e8',
      headerBg: '#001529',
      footerBg: '#001529',
      gradientStart: '#f5f7fa',
      gradientEnd: '#c3cfe2',
    },
  },
  {
    id: 'tech-purple',
    name: '科技紫',
    description: '现代感十足的紫色系，适合科技公司',
    colors: {
      primary: '#722ed1',
      secondary: '#b37feb',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#f9f9fb',
      cardBg: '#ffffff',
      textPrimary: '#1f1f1f',
      textSecondary: '#595959',
      border: '#e6e6e6',
      headerBg: '#1a1a2e',
      footerBg: '#1a1a2e',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
    },
  },
  {
    id: 'nature-green',
    name: '自然绿',
    description: '清新自然的绿色系，适合环保/健康行业',
    colors: {
      primary: '#52c41a',
      secondary: '#95de64',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#f6ffed',
      cardBg: '#ffffff',
      textPrimary: '#262626',
      textSecondary: '#595959',
      border: '#d9f7be',
      headerBg: '#135200',
      footerBg: '#135200',
      gradientStart: '#d4fc79',
      gradientEnd: '#96e6a1',
    },
  },
  {
    id: 'warm-orange',
    name: '活力橙',
    description: '热情活力的橙色系，适合创意/教育行业',
    colors: {
      primary: '#fa8c16',
      secondary: '#ffc069',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#fff7e6',
      cardBg: '#ffffff',
      textPrimary: '#262626',
      textSecondary: '#595959',
      border: '#ffe7ba',
      headerBg: '#873800',
      footerBg: '#873800',
      gradientStart: '#ff9a9e',
      gradientEnd: '#fecfef',
    },
  },
  {
    id: 'elegant-gold',
    name: '尊贵金',
    description: '高端奢华的金色系，适合金融/奢侈品行业',
    colors: {
      primary: '#d4af37',
      secondary: '#f0d77d',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#fffef5',
      cardBg: '#ffffff',
      textPrimary: '#1a1a1a',
      textSecondary: '#4a4a4a',
      border: '#e8d9a0',
      headerBg: '#1a1a1a',
      footerBg: '#1a1a1a',
      gradientStart: '#f5e6c8',
      gradientEnd: '#d4af37',
    },
  },
  {
    id: 'ocean-cyan',
    name: '海洋青',
    description: '清爽透亮的青色系，适合旅游/科技行业',
    colors: {
      primary: '#13c2c2',
      secondary: '#5cdbd3',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#e6fffb',
      cardBg: '#ffffff',
      textPrimary: '#262626',
      textSecondary: '#595959',
      border: '#b5f5ec',
      headerBg: '#002329',
      footerBg: '#002329',
      gradientStart: '#a8edea',
      gradientEnd: '#fed6e3',
    },
  },
  {
    id: 'rose-pink',
    name: '玫瑰粉',
    description: '温柔浪漫的粉色系，适合美妆/婚庆行业',
    colors: {
      primary: '#eb2f96',
      secondary: '#ff85c0',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#fff0f6',
      cardBg: '#ffffff',
      textPrimary: '#262626',
      textSecondary: '#595959',
      border: '#ffadd2',
      headerBg: '#520339',
      footerBg: '#520339',
      gradientStart: '#ffecd2',
      gradientEnd: '#fcb69f',
    },
  },
  {
    id: 'dark-mode',
    name: '暗夜黑',
    description: '护眼深色主题，适合长时间浏览',
    colors: {
      primary: '#177ddc',
      secondary: '#3c9ae8',
      success: '#49aa19',
      warning: '#d89614',
      error: '#d32029',
      background: '#141414',
      cardBg: '#1f1f1f',
      textPrimary: '#ffffff',
      textSecondary: '#a6a6a6',
      border: '#303030',
      headerBg: '#000000',
      footerBg: '#000000',
      gradientStart: '#232526',
      gradientEnd: '#414345',
    },
  },
];

// 获取主题
export const getThemeById = (id: string): ThemeConfig => {
  return PRESET_THEMES.find(t => t.id === id) || PRESET_THEMES[0];
};

// 默认主题
export const DEFAULT_THEME = PRESET_THEMES[0];
