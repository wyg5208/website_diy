import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Card, Space, Tag, Button, Row, Col, Divider, Flex, Spin, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts } from '../api/posts';
import { getHomePage } from '../api/pages';
import { getMenus } from '../api/menus';
import { getLogoConfig } from '../api/logo';
import { ArrowRightOutlined, RocketOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ComponentRenderer from '../components/ComponentRenderer';
import SiteFooter from '../components/SiteFooter';
import type { PageComponent } from '../types/components';
import type { MenuItem } from '../types/menu';
import type { LogoConfig } from '../types/components';
import { useTheme } from '../contexts/ThemeContext';

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [customComponents, setCustomComponents] = useState<PageComponent[]>([]);
  const [hasCustomPage, setHasCustomPage] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [logoConfig, setLogoConfig] = useState<LogoConfig | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 加载自定义页面配置
        const pageRes = await getHomePage();
        if (pageRes.data && pageRes.data.components && pageRes.data.components.length > 0) {
          setCustomComponents(pageRes.data.components);
          setHasCustomPage(true);
        } else {
          // 如果没有自定义页面，加载文章列表
          const postsRes = await getPosts({ status: 'published', page: 1, per_page: 6 });
          setPosts(postsRes.data?.items || []);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // 出错时也尝试加载文章
        try {
          const postsRes = await getPosts({ status: 'published', page: 1, per_page: 6 });
          setPosts(postsRes.data?.items || []);
        } catch (e) {
          console.error('Failed to fetch posts:', e);
          setPosts([]); // 确保至少设置为空数组
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

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
            selectedKeys={['home']}
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
            <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>
          ) : hasCustomPage ? (
            /* 自定义页面内容 - 从后台可视化编辑器配置 */
            <div>
              {customComponents.map((component) => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
            </div>
          ) : (
            /* 默认页面内容 */
            <>
              {/* Hero Section - 品牌视觉中心 */}
              <div style={{ 
                padding: '100px 48px 80px', 
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                textAlign: 'center'
              }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                  <Title style={{ fontSize: '48px', marginBottom: '24px' }}>
                    助力企业实现数字资产的 <span style={{ color: colors.primary }}>高效管理</span>
                  </Title>
                  <Paragraph style={{ fontSize: '18px', color: colors.textSecondary, marginBottom: '40px' }}>
                    基于 Python Flask 与 React 构建的新一代企业级内容管理系统，为您提供极致的性能与灵活的扩展能力。
                  </Paragraph>
                  <Space size="middle">
                    <Button type="primary" size="large" icon={<RocketOutlined />} style={{ height: '48px', padding: '0 32px' }}>
                      立即开始
                    </Button>
                    <Button size="large" style={{ height: '48px', padding: '0 32px' }}>
                      了解更多
                    </Button>
                  </Space>
                </div>
              </div>

              {/* 优势板块 */}
              <div style={{ padding: '80px 48px', background: colors.cardBg }}>
                <Row gutter={[32, 32]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" style={{ textAlign: 'center', background: colors.background }}>
                      <SafetyCertificateOutlined style={{ fontSize: '40px', color: colors.primary, marginBottom: '16px' }} />
                      <Title level={4}>极致安全</Title>
                      <Text type="secondary">采用 JWT 无状态认证与 SQLite3 WAL 模式，确保数据安全与高并发读取性能。</Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" style={{ textAlign: 'center', background: colors.background }}>
                      <TeamOutlined style={{ fontSize: '40px', color: colors.primary, marginBottom: '16px' }} />
                      <Title level={4}>协作高效</Title>
                      <Text type="secondary">内置 RBAC 权限模型，支持多角色协同办公，让内容发布流程更清晰。</Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" style={{ textAlign: 'center', background: colors.background }}>
                      <RocketOutlined style={{ fontSize: '40px', color: colors.primary, marginBottom: '16px' }} />
                      <Title level={4}>部署灵活</Title>
                      <Text type="secondary">完美适配 Windows Server，利用 Nginx 反向代理提供稳定的 Web 服务环境。</Text>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* 动态列表板块 */}
              <div style={{ padding: '60px 48px', background: '#fcfcfc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                  <div>
                    <Title level={2} style={{ margin: 0 }}>最新动态</Title>
                    <Text type="secondary">关注我们的最新资讯与技术分享</Text>
                  </div>
                  <Link to="/posts">查看全部资讯 <ArrowRightOutlined /></Link>
                </div>
                
                {(posts?.length ?? 0) === 0 ? (
                  <Empty description="暂无文章" />
                ) : (
                  <Row gutter={[24, 24]}>
                    {posts.map((post: any) => (
                      <Col key={post.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Card 
                          hoverable 
                          cover={
                            <div style={{ height: '180px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                              {post.featured_image ? <img src={post.featured_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'NO IMAGE'}
                            </div>
                          }
                          onClick={() => navigate(`/post/${post.id}`)}
                          style={{ overflow: 'hidden', borderRadius: '12px' }}
                        >
                          <Card.Meta
                            title={<div style={{ marginBottom: '8px' }}>{post.title}</div>}
                            description={
                              <Flex vertical gap={12}>
                                <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '13px', marginBottom: 0 }}>
                                  {post.excerpt || '暂无详细描述...'}
                                </Paragraph>
                                <Divider style={{ margin: '0' }} />
                                <Flex justify="space-between" align="center">
                                  <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(post.published_at).format('YYYY-MM-DD')}</Text>
                                  <Space>
                                    {post.categories?.slice(0, 1).map((cat: any) => (
                                      <Tag color="blue" key={cat.id} style={{ margin: 0 }}>{cat.name}</Tag>
                                    ))}
                                  </Space>
                                </Flex>
                              </Flex>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </>
          )}
        </Content>

        <SiteFooter />
      </Layout>
  );
};

export default Home;
