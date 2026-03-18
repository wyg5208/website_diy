import request from '../utils/request';
import type { ApiResponse } from '../utils/request';

/**
 * 获取媒体库列表
 */
export const getMediaList = (params?: { page?: number; per_page?: number; mime_type?: string; search?: string }): Promise<ApiResponse> => {
  return request({
    url: '/media',
    method: 'get',
    params,
  });
};

/**
 * 上传媒体文件
 */
export const uploadMedia = (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    url: '/media/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 删除媒体文件
 */
export const deleteMedia = (id: number): Promise<ApiResponse> => {
  return request({
    url: `/media/${id}`,
    method: 'delete',
  });
};

/**
 * 更新媒体信息
 */
export const updateMedia = (id: number, data: any): Promise<ApiResponse> => {
  return request({
    url: `/media/${id}`,
    method: 'put',
    data,
  });
};
