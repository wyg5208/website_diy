import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Breadcrumb, Divider, Skeleton, Button, Space, Tag, Menu } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPublicPost } from '../api/posts';
import dayjs from 'dayjs';
import { LeftOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const PostDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<any>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getPublicPost(Number(id));
        setPost(res.data);
      } catch (error) {
        console.error('Failed to fetch post detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id]);

  // 根据内容格式渲染内容
  const renderContent = () => {
    if (!post?.content) return null;

    if (post.content_format === 'markdown') {
      return (
        <div className="markdown-content" style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      );
    } else {
      // 富文本内容，直接渲染 HTML
      return (
        <div 
          className="rich-content" 
          style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
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
        <div 
          style={{ color: '#1677ff', fontSize: '22px', fontWeight: '800', marginRight: '60px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          CORP<span style={{ color: '#333' }}>CMS</span>
        </div>
        <Menu
          mode="horizontal"
          items={[
            { key: 'home', label: <Link to="/">网站首页</Link> },
            { key: 'solutions', label: '解决方案' },
            { key: 'cases', label: '成功案例' },
            { key: 'about', label: '关于我们' },
          ]}
          style={{ flex: 1, border: 'none', background: 'transparent' }}
        />
      </Header>

      <Content style={{ padding: '30px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Breadcrumb items={[
              { title: <Link to="/">首页</Link> },
              { title: '动态详情' }
            ]} />
            <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>返回列表</Button>
          </div>

          <Card style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 10 }} />
            ) : post ? (
              <article>
                <Title level={1} style={{ textAlign: 'center', marginBottom: '16px' }}>{post.title}</Title>
                
                {/* 元信息 */}
                <div style={{ textAlign: 'center', color: '#999', marginBottom: '30px' }}>
                  <Space split={<Divider type="vertical" />}>
                    <Text type="secondary">发布于：{dayjs(post.published_at).format('YYYY-MM-DD HH:mm')}</Text>
                    <Text type="secondary">作者：{post.author_name}</Text>
                    <Text type="secondary">浏览：{post.view_count}</Text>
                  </Space>
                </div>
                
                {/* 分类和标签 */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Space wrap>
                    {post.categories && post.categories.map((cat: any) => (
                      <Tag key={cat.id} color="blue">{cat.name}</Tag>
                    ))}
                    {post.tags && post.tags.map((tag: any) => (
                      <Tag key={tag.id}>{tag.name}</Tag>
                    ))}
                  </Space>
                </div>

                {/* 封面图片 */}
                {post.featured_image && (
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img 
                      src={post.featured_image} 
                      alt={post.title} 
                      style={{ maxWidth: '100%', borderRadius: '8px' }} 
                    />
                  </div>
                )}

                {/* 文章内容 */}
                {renderContent()}
              </article>
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>文章不存在或已被删除</div>
            )}
          </Card>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', padding: '40px 0', background: '#001529', color: 'rgba(255,255,255,0.45)' }}>
        ©2026 CORPCMS | 企业内容管理平台
      </Footer>
    </Layout>
  );
};

export default PostDetail;
