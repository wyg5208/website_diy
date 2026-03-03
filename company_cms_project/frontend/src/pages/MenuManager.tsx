import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Space, Typography, Modal, Form, Input, 
  InputNumber, Switch, message, Popconfirm, Tag, Card 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  MenuOutlined, EyeOutlined, EyeInvisibleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { getMenus, saveMenus, addMenu, updateMenu, deleteMenu } from '../api/menus';
import type { MenuItem } from '../types/menu';

const { Title } = Typography;

const MenuManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  // 加载菜单数据
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenus();
      setMenus(res.data.items || []);
    } catch (error) {
      message.error('加载菜单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 打开新增/编辑弹窗
  const openModal = (menu?: MenuItem) => {
    if (menu) {
      setEditingMenu(menu);
      form.setFieldsValue(menu);
    } else {
      setEditingMenu(null);
      form.resetFields();
      form.setFieldsValue({
        order: menus.length + 1,
        visible: true,
      });
    }
    setModalVisible(true);
  };

  // 保存菜单
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // 自动生成 pageKey
      if (!values.pageKey) {
        values.pageKey = values.path.replace(/^\//, '').replace(/\//g, '_') || 'page';
      }

      if (editingMenu) {
        // 更新
        await updateMenu(editingMenu.id, values);
        message.success('菜单更新成功');
      } else {
        // 新增
        await addMenu(values);
        message.success('菜单添加成功');
      }
      
      setModalVisible(false);
      fetchMenus();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      }
    }
  };

  // 删除菜单
  const handleDelete = async (id: string) => {
    try {
      await deleteMenu(id);
      message.success('菜单删除成功');
      fetchMenus();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  // 切换显示状态
  const toggleVisible = async (menu: MenuItem) => {
    try {
      await updateMenu(menu.id, { visible: !menu.visible });
      message.success(menu.visible ? '已隐藏' : '已显示');
      fetchMenus();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 批量保存排序
  const handleSaveOrder = async () => {
    try {
      await saveMenus(menus);
      message.success('排序保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order: number) => <Tag>{order}</Tag>,
    },
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: MenuItem) => (
        <Space>
          <MenuOutlined />
          {title}
          {record.isSystem && <Tag color="blue">系统</Tag>}
        </Space>
      ),
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      render: (path: string) => (
        <Space>
          <LinkOutlined />
          <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
            {path}
          </code>
        </Space>
      ),
    },
    {
      title: '页面Key',
      dataIndex: 'pageKey',
      key: 'pageKey',
      render: (key: string) => (
        <code style={{ background: '#e6f7ff', padding: '2px 6px', borderRadius: 4 }}>
          {key}
        </code>
      ),
    },
    {
      title: '状态',
      dataIndex: 'visible',
      key: 'visible',
      width: 100,
      render: (visible: boolean, record: MenuItem) => (
        <Switch
          checkedChildren={<EyeOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
          checked={visible}
          onChange={() => toggleVisible(record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: MenuItem) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          {!record.isSystem && (
            <Popconfirm
              title="确定删除此菜单？"
              description="删除后，对应的页面配置不会被删除"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <MenuOutlined style={{ marginRight: 8 }} />
          菜单管理
        </Title>
        <Space>
          <Button onClick={handleSaveOrder}>保存排序</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            新增菜单
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={menus}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            name="title"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="如：解决方案" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路由路径"
            rules={[
              { required: true, message: '请输入路由路径' },
              { pattern: /^\//, message: '路径必须以 / 开头' }
            ]}
            extra="访问地址，如 /solutions、/about"
          >
            <Input placeholder="如：/solutions" disabled={editingMenu?.isSystem} />
          </Form.Item>

          <Form.Item
            name="pageKey"
            label="页面Key"
            extra="用于关联页面配置，留空则自动生成"
          >
            <Input placeholder="如：solutions（可选）" disabled={editingMenu?.isSystem} />
          </Form.Item>

          <Form.Item
            name="order"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="visible"
            label="是否显示"
            valuePropName="checked"
          >
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManager;
