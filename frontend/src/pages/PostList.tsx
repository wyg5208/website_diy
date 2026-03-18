import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Tag, Modal, message, Select, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getPosts, deletePost, getCategoriesAndTags } from '../api/posts';
import dayjs from 'dayjs';

const { Title } = Typography;

const PostList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ page: 1, per_page: 10 });
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [filters, setFilters] = useState({ category_id: undefined, tag_id: undefined });
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = { ...params, ...filters };
      console.log('获取文章列表，参数:', queryParams);
      const res = await getPosts(queryParams);
      console.log('文章列表响应:', res.data);
      setData(res.data.items);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 加载分类和标签
    const fetchCategoriesAndTags = async () => {
      try {
        const res = await getCategoriesAndTags();
        setCategories(res.data.categories);
        setTags(res.data.tags);
      } catch (error) {
        console.error('Failed to fetch categories and tags:', error);
      }
    };
    fetchCategoriesAndTags();
    
    fetchData();
  }, []); // 只在挂载时执行一次

  useEffect(() => {
    // 当 params 或 filters 改变时，重新加载数据
    if (filters.category_id !== undefined || filters.tag_id !== undefined || params.page !== 1) {
      setParams({ ...params, page: 1 });
      fetchData();
    }
  }, [filters]);

  useEffect(() => {
    // params 变化时刷新（分页、排序等）
    fetchData();
  }, [params]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？',
      onOk: async () => {
        try {
          await deletePost(id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author_name',
      key: 'author_name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'published_at',
      key: 'published_at',
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/posts/edit/${record.id}`)}>编辑</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>文章管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/posts/new')}>
          新建文章
        </Button>
      </div>

      {/* 筛选区域 */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Select
              placeholder="按分类筛选"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters({ ...filters, category_id: value })}
              options={categories.map(cat => ({
                value: cat.id,
                label: cat.name
              }))}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="按标签筛选"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters({ ...filters, tag_id: value })}
              options={tags.map(tag => ({
                value: tag.name,
                label: tag.name
              }))}
            />
          </Col>
          <Col span={8}>
            <Button 
              block 
              onClick={() => {
                setFilters({ category_id: undefined, tag_id: undefined });
                setParams({ page: 1, per_page: 10 });
              }}
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          current: params.page,
          pageSize: params.per_page,
          onChange: (page, pageSize) => setParams({ page, per_page: pageSize }),
        }}
      />
    </div>
  );
};

export default PostList;
