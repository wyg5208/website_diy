import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Card, Breadcrumb, Divider, Skeleton, Button, Space } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPost } from '../api/posts';
import dayjs from 'dayjs';
import { LeftOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

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
        const res = await getPost(Number(id));
        setPost(res.data);
      } catch (error) {
        console.error('Failed to fetch post detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id]);

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
                <div style={{ textAlign: 'center', color: '#999', marginBottom: '30px' }}>
                  <Space split={<Divider type="vertical" />}>
                    <Text type="secondary">发布于：{dayjs(post.published_at).format('YYYY-MM-DD HH:mm')}</Text>
                    <Text type="secondary">作者：{post.author_name}</Text>
                    <Text type="secondary">浏览：{post.view_count}</Text>
                  </Space>
                </div>
                
                {post.featured_image && (
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img 
                      src={post.featured_image} 
                      alt={post.title} 
                      style={{ maxWidth: '100%', borderRadius: '8px' }} 
                    />
                  </div>
                )}

                <div 
                  className="post-content" 
                  style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}
                >
                  {post.content?.split('\n').map((line: string, index: number) => (
                    <Paragraph key={index}>{line}</Paragraph>
                  ))}
                </div>
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
