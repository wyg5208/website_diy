import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Space, Spin, Result } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getPageConfig } from '../api/pages';
import { getMenus } from '../api/menus';
import { getLogoConfig } from '../api/logo';
import ComponentRenderer from '../components/ComponentRenderer';
import SiteFooter from '../components/SiteFooter';
import type { PageComponent } from '../types/components';
import type { MenuItem } from '../types/menu';
import type { LogoConfig } from '../types/components';
import { useTheme } from '../contexts/ThemeContext';

const { Header, Content } = Layout;


interface DynamicPageProps {
  pageKey: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ pageKey }) => {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [logoConfig, setLogoConfig] = useState<LogoConfig | null>(null);
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

  // 加载 LOGO 配置
  useEffect(() => {
    const loadLogoConfig = async () => {
      try {
        const res = await getLogoConfig();
        if (res.code === 200 && res.data?.enabled) {
          setLogoConfig(res.data);
        }
      } catch (error) {
        console.error('Failed to load logo config:', error);
      }
    };
    loadLogoConfig();
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
        {/* LOGO 区域 */}
        {logoConfig && logoConfig.enabled ? (
          <Link to={logoConfig.linkUrl} style={{ textDecoration: 'none', marginRight: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* 图片部分 */}
              {(logoConfig.displayMode === 'textAndImage' || logoConfig.displayMode === 'imageOnly') && logoConfig.logoImage && (
                <img
                  src={logoConfig.logoImage}
                  alt="LOGO"
                  style={{
                    width: `${logoConfig.logoImageWidth}px`,
                    height: `${logoConfig.logoImageHeight}px`,
                    objectFit: 'contain',
                    marginRight: logoConfig.displayMode === 'textAndImage' ? `${logoConfig.imageGap}px` : 0
                  }}
                />
              )}

              {/* 文字部分 */}
              {(logoConfig.displayMode === 'textAndImage' || logoConfig.displayMode === 'textOnly') && (
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span
                    style={{
                      fontSize: `${logoConfig.fontSize}px`,
                      color: logoConfig.textColor,
                      fontWeight: logoConfig.fontWeight,
                      letterSpacing: `${logoConfig.letterSpacing}px`
                    }}
                  >
                    {logoConfig.logoText}
                  </span>
                  {logoConfig.logoSubText && (
                    <span
                      style={{
                        fontSize: `${logoConfig.subFontSize}px`,
                        color: logoConfig.subTextColor,
                        fontWeight: logoConfig.fontWeight,
                        marginLeft: '2px'
                      }}
                    >
                      {logoConfig.logoSubText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ) : (
          /* 默认 LOGO */
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ color: colors.primary, fontSize: '22px', fontWeight: '800', marginRight: '60px', letterSpacing: '1px' }}>
              CORP<span style={{ color: colors.textPrimary }}>CMS</span>
            </div>
          </Link>
        )}
        
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
              <Space>
                <Button type="primary" onClick={() => navigate('/')}>
                  返回首页
                </Button>
                {localStorage.getItem('token') && (
                  <Button 
                    onClick={() => navigate(`/admin/pages/editor?page=${pageKey}`)}
                  >
                    立即编辑此页面
                  </Button>
                )}
              </Space>
            }
            style={{ padding: '100px 0' }}
          />
        )}
      </Content>

        <SiteFooter />
    </Layout>
  );
};

export default DynamicPage;
