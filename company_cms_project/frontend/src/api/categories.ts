import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

export const getCategories = (): Promise<ApiResponse> => {
  return request({
    url: '/categories',
    method: 'get',
  });
};

export const createCategory = (data: any): Promise<ApiResponse> => {
  return request({
    url: '/categories',
    method: 'post',
    data,
  });
};

export const updateCategory = (id: number, data: any): Promise<ApiResponse> => {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data,
  });
};

export const deleteCategory = (id: number): Promise<ApiResponse> => {
  return request({
    url: `/categories/${id}`,
    method: 'delete',
  });
};
