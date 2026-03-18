import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

// 底栏配置相关API

/**
 * 获取底栏配置
 */
export const getFooterConfig = async (): Promise<ApiResponse> => {
  try {
    console.log('正在获取底栏配置...');
    const response = await request.get('/settings/footer') as unknown as ApiResponse;
    console.log('获取底栏配置成功:', response);
    return response;
  } catch (error) {
    console.error('获取底栏配置失败:', error);
    throw error;
  }
};

/**
 * 更新底栏配置
 */
export const updateFooterConfig = async (config: any): Promise<ApiResponse> => {
  try {
    console.log('正在更新底栏配置:', config);
    const response = await request.put('/settings/footer', config) as unknown as ApiResponse;
    console.log('更新底栏配置成功:', response);
    return response;
  } catch (error: any) {
    console.error('更新底栏配置失败:', error);
    if (error.response) {
      console.error('错误响应:', error.response.data);
      console.error('错误状态:', error.response.status);
    }
    throw error;
  }
};
