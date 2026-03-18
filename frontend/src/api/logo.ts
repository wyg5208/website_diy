import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

// LOGO 配置相关API

/**
 * 获取 LOGO 配置
 */
export const getLogoConfig = async () => {
  try {
    console.log('正在获取 LOGO 配置...');
    const response: ApiResponse<any> = await request.get('/settings/logo');
    // 响应拦截器已解包，直接返回 response ({code, message, data})
    console.log('获取 LOGO 配置成功:', response);
    return response;
  } catch (error) {
    console.error('获取 LOGO 配置失败:', error);
    throw error;
  }
};

/**
 * 更新 LOGO 配置
 */
export const updateLogoConfig = async (config: any) => {
  try {
    console.log('正在更新 LOGO 配置:', config);
    const response: ApiResponse<any> = await request.put('/settings/logo', config);
    console.log('更新 LOGO 配置成功:', response);
    return response;
  } catch (error: any) {
    console.error('更新 LOGO 配置失败:', error);
    if (error.response) {
      console.error('错误响应:', error.response.data);
      console.error('错误状态:', error.response.status);
    }
    throw error;
  }
};
