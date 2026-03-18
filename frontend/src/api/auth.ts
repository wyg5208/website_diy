import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

export const login = (data: any): Promise<ApiResponse> => {
  // 登录前清除旧 token
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
};

export const getMe = (): Promise<ApiResponse> => {
  return request({
    url: '/auth/me',
    method: 'get',
  });
};
