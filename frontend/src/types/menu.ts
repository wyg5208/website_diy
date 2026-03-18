// 菜单项类型
export interface MenuItem {
  id: string;
  title: string;           // 菜单显示名称
  path: string;            // 路由路径，如 /solutions
  pageKey: string;         // 页面配置key，如 solutions
  icon?: string;           // 图标名称
  order: number;           // 排序
  visible: boolean;        // 是否显示
  isSystem?: boolean;      // 是否系统菜单（不可删除）
  createdAt?: string;
  updatedAt?: string;
}

// 菜单配置（存储在 site_settings 中）
export interface MenuConfig {
  items: MenuItem[];
  updatedAt: string;
}

// 默认菜单配置
export const DEFAULT_MENUS: MenuItem[] = [
  {
    id: 'home',
    title: '网站首页',
    path: '/',
    pageKey: 'home',
    order: 1,
    visible: true,
    isSystem: true,
  },
  {
    id: 'solutions',
    title: '解决方案',
    path: '/solutions',
    pageKey: 'solutions',
    order: 2,
    visible: true,
    isSystem: false,
  },
  {
    id: 'cases',
    title: '成功案例',
    path: '/cases',
    pageKey: 'cases',
    order: 3,
    visible: true,
    isSystem: false,
  },
  {
    id: 'about',
    title: '关于我们',
    path: '/about',
    pageKey: 'about',
    order: 4,
    visible: true,
    isSystem: false,
  },
];
