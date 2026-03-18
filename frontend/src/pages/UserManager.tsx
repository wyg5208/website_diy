import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
  Avatar,
  Drawer,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} from '../api/users';

interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar?: string;
  status: number;
  created_at: string;
  last_login?: string;
}

interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  display_name: string;
  avatar?: string;
  status: number;
}

const UserManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [passwordResetUserId, setPasswordResetUserId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, per_page: perPage });
      if (res.code === 200) {
        setUsers(res.data.items);
        setTotal(res.data.total);
      }
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, perPage]);

  // 打开创建/编辑弹窗
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        display_name: user.display_name,
        email: user.email,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 更新用户
        const res = await updateUser(editingUser.id, values);
        if (res.code === 200) {
          message.success('用户更新成功');
          setModalVisible(false);
          loadUsers();
        }
      } else {
        // 创建用户
        const res = await createUser(values as CreateUserForm);
        if (res.code === 201) {
          message.success('用户创建成功');
          setModalVisible(false);
          loadUsers();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 删除用户
  const handleDelete = async (userId: number) => {
    try {
      const res = await deleteUser(userId);
      if (res.code === 200) {
        message.success('用户删除成功');
        loadUsers();
      }
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (passwordResetUserId) {
        const res = await resetPassword(passwordResetUserId, values);
        if (res.code === 200) {
          message.success('密码重置成功');
          setDrawerVisible(false);
          passwordForm.resetFields();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 列定义
  const columns: ColumnsType<User> = [
    {
      title: '用户',
      dataIndex: 'avatar',
      key: 'user',
      render: (avatar: string | undefined, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={avatar}
            icon={<UserOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.display_name}</div>
            <div style={{ color: '#999', fontSize: '12px' }}>{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (date?: string) =>
        date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => {
              setPasswordResetUserId(record.id);
              setDrawerVisible(true);
            }}
          >
            重置密码
          </Button>
          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>用户管理</h2>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          添加用户
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page);
            setPerPage(pageSize);
          },
        }}
      />

      {/* 创建/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 1 }}
        >
          {!editingUser && (
            <>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少 3 个字符' },
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, message: '密码长度至少 8 位' },
                ]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="display_name"
            label="显示名称"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input placeholder="请输入显示名称" />
          </Form.Item>
          <Form.Item
            name="avatar"
            label="头像 URL"
          >
            <Input placeholder="请输入头像 URL（可选）" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="正常" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码抽屉 */}
      <Drawer
        title="重置密码"
        placement="right"
        width={400}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          passwordForm.resetFields();
        }}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度至少 8 位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleResetPassword} block>
              确认重置
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserManager;
