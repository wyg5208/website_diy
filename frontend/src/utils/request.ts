import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { message } from 'antd';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/v1',
  timeout: 60000, // 60秒超时，适应 Render 免费版冷启动
});

// 处理登录过期的统一函数
let isShowingLoginExpired = false;
const handleLoginExpired = () => {
  if (isShowingLoginExpired) return; // 防止多次弹窗
  isShowingLoginExpired = true;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  message.warning('登录已过期，请重新登录', 3, () => {
    isShowingLoginExpired = false;
    window.location.href = '/login';
  });
};

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
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code !== 200 && res.code !== 201) {
      if (res.code === 401) {
        handleLoginExpired();
        return Promise.reject(new Error('登录已过期'));
      }
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res as any;
  },
  (error) => {
    const status = error.response?.status;
    console.error('响应拦截器错误:', error);
    if (status === 401) {
      handleLoginExpired();
    } else {
      message.error(error.response?.data?.message || '网络错误');
    }
    return Promise.reject(error);
  }
);

// 导出处理登录过期函数，供 fetch 请求使用
export { handleLoginExpired };

export default request;
