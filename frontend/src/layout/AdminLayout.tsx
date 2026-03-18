import React, { useState } from 'react';
import { Layout, Menu, Button, theme, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  PictureOutlined,
  UserOutlined,
  LogoutOutlined,
  LayoutOutlined,
  BgColorsOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('已退出登录');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: 'pages',
      icon: <LayoutOutlined />,
      label: '页面管理',
      children: [
        { key: '/admin/pages/editor', label: '页面编辑器' },
        { key: '/admin/pages/menus', icon: <MenuOutlined />, label: '菜单管理' },
        { key: '/admin/pages/templates', label: '模板库' },
      ],
    },
    {
      key: '/admin/posts',
      icon: <FileTextOutlined />,
      label: '文章管理',
    },
    {
      key: '/admin/media',
      icon: <PictureOutlined />,
      label: '媒体库管理',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        { key: '/admin/theme', icon: <BgColorsOutlined />, label: '主题设置' },
        { key: '/admin/logo-config', icon: <PictureOutlined />, label: 'LOGO 配置' },
        { key: '/admin/footer-config', icon: <SettingOutlined />, label: '底栏配置' },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
          CMS Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ paddingRight: 24 }}>
            <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Button>
          </div>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: '12px 16px',
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
