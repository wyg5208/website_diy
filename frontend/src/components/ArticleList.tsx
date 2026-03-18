import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination, Typography, Tag, Space, Skeleton, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPublicPosts } from '../api/posts';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

interface ArticleListProps {
  categoryId?: number;      // 指定分类 ID
  tagId?: string | number;  // 指定标签 ID
  limit?: number;           // 每页显示数量
  showPagination?: boolean; // 是否显示分页
}

const ArticleList: React.FC<ArticleListProps> = ({
  categoryId,
  tagId,
  limit = 10,
  showPagination = true
}) => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [page, categoryId, tagId]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: limit
      };
      
      if (categoryId) {
        params.category_id = categoryId;
      }
      
      if (tagId) {
        params.tag_id = tagId;
      }

      const res = await getPublicPosts(params);
      setArticles(res.data.items);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : articles.length === 0 ? (
        <Empty description="暂无文章" />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {articles.map((article) => (
              <Col span={24} key={article.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/post/${article.id}`)}
                  style={{ borderRadius: '8px' }}
                >
                  <Card.Meta
                    title={
                      <Title level={4} style={{ margin: 0 }}>
                        {article.title}
                      </Title>
                    }
                    description={
                      <>
                        <Space style={{ marginBottom: 8 }}>
                          <span>作者：{article.author_name}</span>
                          <span>·</span>
                          <span>{dayjs(article.published_at).format('YYYY-MM-DD')}</span>
                          <span>·</span>
                          <span>浏览：{article.view_count}</span>
                        </Space>
                        
                        {/* 分类和标签 */}
                        <Space wrap style={{ marginBottom: 8 }}>
                          {article.categories && article.categories.map((cat: any) => (
                            <Tag key={cat.id} color="blue">{cat.name}</Tag>
                          ))}
                          {article.tags && article.tags.map((tag: any) => (
                            <Tag key={`tag-${tag.id}`}>{tag.name}</Tag>
                          ))}
                        </Space>

                        {/* 摘要 */}
                        {article.excerpt && (
                          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                            {article.excerpt}
                          </Paragraph>
                        )}
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {showPagination && total > limit && (
            <Pagination
              current={page}
              total={total}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: 24, textAlign: 'center' }}
              showSizeChanger={false}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ArticleList;
