import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Button, Space, Spin, Empty, Result } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getPageConfig } from '../api/pages';
import { getMenus } from '../api/menus';
import ComponentRenderer from '../components/ComponentRenderer';
import type { PageComponent } from '../types/components';
import type { MenuItem } from '../types/menu';
import { useTheme } from '../contexts/ThemeContext';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

interface DynamicPageProps {
  pageKey: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ pageKey }) => {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  // 加载菜单
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await getMenus();
        setMenus((res.data.items || []).filter((m: MenuItem) => m.visible));
      } catch (error) {
        console.error('Failed to load menus:', error);
      }
    };
    loadMenus();
  }, []);

  // 加载页面内容
  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        const res = await getPageConfig(pageKey);
        if (res.data && res.data.components) {
          setComponents(res.data.components);
          setPageTitle(res.data.name || pageKey);
        } else {
          setComponents([]);
        }
      } catch (error) {
        console.error('Failed to load page:', error);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [pageKey]);

  // 获取当前选中的菜单
  const selectedKey = menus.find(m => m.path === location.pathname)?.id || '';

  return (
    <Layout style={{ minHeight: '100vh', background: colors.background }}>
      {/* 导航栏 */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(8px)',
        padding: '0 48px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ color: colors.primary, fontSize: '22px', fontWeight: '800', marginRight: '60px', letterSpacing: '1px' }}>
            CORP<span style={{ color: colors.textPrimary }}>CMS</span>
          </div>
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menus.map(m => ({
            key: m.id,
            label: <Link to={m.path}>{m.title}</Link>,
          }))}
          style={{ flex: 1, border: 'none', background: 'transparent' }}
        />
        <Space size="large">
          <Button type="primary" shape="round" onClick={() => navigate('/login')}>
            进入后台
          </Button>
        </Space>
      </Header>
      
      <Content>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
          </div>
        ) : components.length > 0 ? (
          <div>
            {components.map((component) => (
              <ComponentRenderer key={component.id} component={component} />
            ))}
          </div>
        ) : (
          <Result
            status="info"
            title={pageTitle || '页面建设中'}
            subTitle="此页面内容正在建设中，请稍后访问"
            extra={
              <Button type="primary" onClick={() => navigate('/')}>
                返回首页
              </Button>
            }
            style={{ padding: '100px 0' }}
          />
        )}
      </Content>

      <Footer style={{ textAlign: 'center', padding: '40px 0', background: colors.footerBg, color: 'rgba(255,255,255,0.45)' }}>
        <Title level={5} style={{ color: '#fff', marginBottom: '20px' }}>CORPCMS 企业内容管理平台</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.45)' }}>
          专业的 Python 后端与现代 React 前端技术栈，为您的企业品牌保驾护航
        </Paragraph>
        <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          ©2026 Created by Qoder | 工业级解决方案
        </div>
      </Footer>
    </Layout>
  );
};

export default DynamicPage;
