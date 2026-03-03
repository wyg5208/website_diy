import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Space, message, Select, Switch, Divider, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, createPost, updatePost } from '../api/posts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const PostEditor: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Quill 编辑器配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        try {
          const res = await getPost(Number(id));
          form.setFieldsValue(res.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [id, isEdit, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(Number(id), values);
        message.success('更新成功');
      } else {
        await createPost(values);
        message.success('创建成功');
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{isEdit ? '编辑文章' : '撰写新文章'}</h2>
        <Space>
          <Button onClick={() => navigate('/admin/posts')}>返回列表</Button>
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            {isEdit ? '保存修改' : '立即发布'}
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'draft', comment_status: true }}
      >
        <Row gutter={24}>
          {/* 左侧编辑器 */}
          <Col xs={24} lg={18}>
            <Card bordered={false}>
              <Form.Item name="title" label="文章标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input size="large" placeholder="在此外输入文章标题..." style={{ fontSize: '18px', fontWeight: 'bold' }} />
              </Form.Item>
              
              <Form.Item name="excerpt" label="文章摘要">
                <Input.TextArea rows={2} placeholder="输入一段简短的摘要（可选）" />
              </Form.Item>

              <Form.Item name="content" label="正文内容" rules={[{ required: true, message: '请输入正文内容' }]}>
                <ReactQuill 
                  theme="snow" 
                  modules={modules}
                  style={{ height: '500px', marginBottom: '50px' }} 
                  placeholder="在这里开始您的创作..."
                />
              </Form.Item>
            </Card>
          </Col>

          {/* 右侧设置 */}
          <Col xs={24} lg={6}>
            <Card title="发布设置" bordered={false} style={{ marginBottom: 24 }}>
              <Form.Item name="status" label="发布状态">
                <Select options={[
                  { value: 'draft', label: '草稿' },
                  { value: 'published', label: '已发布' },
                  { value: 'private', label: '私密' }
                ]} />
              </Form.Item>
              <Form.Item name="slug" label="URL 别名 (Slug)" help="留空则自动生成">
                <Input placeholder="example-post" />
              </Form.Item>
              <Divider />
              <Form.Item name="comment_status" label="允许读者评论" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Card>

            <Card title="封面图片" bordered={false}>
              <Form.Item name="featured_image">
                <Input placeholder="输入图片 URL 或从媒体库选择" />
              </Form.Item>
              <Button block onClick={() => navigate('/admin/media')}>去媒体库选择</Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PostEditor;
