import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

export const getTags = (params?: any): Promise<ApiResponse> => {
  return request({
    url: '/tags',
    method: 'get',
    params,
  });
};

export const createTag = (data: any): Promise<ApiResponse> => {
  return request({
    url: '/tags',
    method: 'post',
    data,
  });
};

export const updateTag = (id: number, data: any): Promise<ApiResponse> => {
  return request({
    url: `/tags/${id}`,
    method: 'put',
    data,
  });
};

export const deleteTag = (id: number): Promise<ApiResponse> => {
  return request({
    url: `/tags/${id}`,
    method: 'delete',
  });
};
