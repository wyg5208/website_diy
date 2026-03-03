import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { message } from 'antd';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const request = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/v1',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code !== 200 && res.code !== 201) {
      message.error(res.message || '请求失败');
      if (res.code === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res as any;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    message.error(error.response?.data?.message || '网络错误');
    return Promise.reject(error);
  }
);

export default request;
