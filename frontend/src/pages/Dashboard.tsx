import React from 'react';
import { Typography, Card, Row, Col, Statistic, List, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { 
  FileTextOutlined, 
  PictureOutlined, 
  UserOutlined, 
  EyeOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const { Title, Text } = Typography;

// 模拟趋势数据
const trendData = [
  { name: '2/01', posts: 2, views: 400 },
  { name: '2/02', posts: 5, views: 300 },
  { name: '2/03', posts: 3, views: 600 },
  { name: '2/04', posts: 8, views: 800 },
  { name: '2/05', posts: 12, views: 1250 },
];

// 模拟分类占比数据
const categoryData = [
  { name: '新闻动态', value: 400 },
  { name: '产品介绍', value: 300 },
  { name: '行业资讯', value: 300 },
  { name: '关于我们', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '4px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>内容管理概览</Title>
      
      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="文章总数"
              value={12}
              prefix={<FileTextOutlined style={{ marginRight: 8 }} />}
              valueStyle={{ color: '#3f51b5' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                较昨日 <ArrowUpOutlined style={{ color: '#3f8600' }} /> 15%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="媒体库容量"
              value={48}
              suffix="个"
              prefix={<PictureOutlined style={{ marginRight: 8 }} />}
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>已使用 12.5 MB</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="累计访问量"
              value={1250}
              prefix={<EyeOutlined style={{ marginRight: 8 }} />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                实时在线: 12 人
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="管理用户"
              value={3}
              prefix={<UserOutlined style={{ marginRight: 8 }} />}
              valueStyle={{ color: '#d46b08' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                活跃账户: 2
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="内容发布与访问趋势" bordered={false}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
                  <Line type="monotone" dataKey="posts" stroke="#82ca9d" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="内容分类占比" bordered={false}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="最近发布" bordered={false} extra={<Link to="/admin/posts">更多</Link>}>
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'JWT 修复后的测试文章', time: '10分钟前' },
                { title: '企业数字资产管理白皮书', time: '2小时前' },
                { title: '2026年技术架构路线图', time: '昨天' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }} />}
                    title={<a href="#">{item.title}</a>}
                    description={<><ClockCircleOutlined style={{ marginRight: 4 }} />{item.time}</>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统健康度" bordered={false}>
            <div style={{ padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>服务器负载 (CPU)</Text>
                <Text strong>12%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>内存占用 (RAM)</Text>
                <Text strong>256MB / 2GB</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>数据库响应</Text>
                <Text strong style={{ color: '#52c41a' }}>极快 (2ms)</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>SSL 证书状态</Text>
                <Text strong style={{ color: '#52c41a' }}>有效</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
