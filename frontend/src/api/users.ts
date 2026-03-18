import request from '../utils/request';

/**
 * 获取用户列表
 */
export const getUsers = (params?: {
  page?: number;
  per_page?: number;
  status?: number;
  keyword?: string;
}) => {
  return request({
    url: '/users',
    method: 'get',
    params,
  });
};

/**
 * 获取用户详情
 */
export const getUser = (userId: number) => {
  return request({
    url: `/users/${userId}`,
    method: 'get',
  });
};

/**
 * 创建用户
 */
export const createUser = (data: {
  username: string;
  email: string;
  password: string;
  display_name?: string;
  avatar?: string;
  status?: number;
}) => {
  return request({
    url: '/users',
    method: 'post',
    data,
  });
};

/**
 * 更新用户信息
 */
export const updateUser = (
  userId: number,
  data: {
    display_name?: string;
    avatar?: string;
    email?: string;
    status?: number;
    password?: string;
  }
) => {
  return request({
    url: `/users/${userId}`,
    method: 'put',
    data,
  });
};

/**
 * 删除用户
 */
export const deleteUser = (userId: number) => {
  return request({
    url: `/users/${userId}`,
    method: 'delete',
  });
};

/**
 * 重置用户密码
 */
export const resetPassword = (
  userId: number,
  data: { password: string }
) => {
  return request({
    url: `/users/${userId}/reset-password`,
    method: 'post',
    data,
  });
};
