import request from '../utils/request';

// 获取首页配置
export const getHomePage = () => {
  return request.get('/pages/home');
};

// 保存首页配置
export const saveHomePage = (data: any) => {
  return request.put('/pages/home', data);
};

// 获取指定页面配置
export const getPageConfig = (pageKey: string) => {
  return request.get(`/pages/${pageKey}`);
};

// 保存指定页面配置
export const savePageConfig = (pageKey: string, data: any) => {
  return request.put(`/pages/${pageKey}`, data);
};

// 获取站点配置
export const getSetting = (keyName: string) => {
  return request.get(`/settings/${keyName}`);
};

// 更新站点配置
export const updateSetting = (keyName: string, value: any) => {
  return request.put(`/settings/${keyName}`, { value });
};
