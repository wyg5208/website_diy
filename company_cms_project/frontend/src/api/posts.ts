import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

export const getPosts = (params: any): Promise<ApiResponse> => {
  return request({
    url: '/posts',
    method: 'get',
    params,
  });
};

export const getPost = (id: number): Promise<ApiResponse> => {
  return request({
    url: `/posts/${id}`,
    method: 'get',
  });
};

export const createPost = (data: any): Promise<ApiResponse> => {
  return request({
    url: '/posts',
    method: 'post',
    data,
  });
};

export const updatePost = (id: number, data: any): Promise<ApiResponse> => {
  return request({
    url: `/posts/${id}`,
    method: 'put',
    data,
  });
};

export const deletePost = (id: number): Promise<ApiResponse> => {
  return request({
    url: `/posts/${id}`,
    method: 'delete',
  });
};
