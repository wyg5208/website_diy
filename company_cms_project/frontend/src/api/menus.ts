import request from '../utils/request';
import type { MenuItem } from '../types/menu';

// 获取菜单列表
export const getMenus = () => {
  return request.get('/menus');
};

// 保存菜单配置
export const saveMenus = (items: MenuItem[]) => {
  return request.put('/menus', { items });
};

// 添加菜单项
export const addMenu = (menu: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  return request.post('/menus', menu);
};

// 更新菜单项
export const updateMenu = (id: string, menu: Partial<MenuItem>) => {
  return request.put(`/menus/${id}`, menu);
};

// 删除菜单项
export const deleteMenu = (id: string) => {
  return request.delete(`/menus/${id}`);
};

// 获取可编辑的页面列表（用于页面编辑器下拉选择）
export const getEditablePages = () => {
  return request.get('/pages/list');
};
