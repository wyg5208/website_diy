import React, { useEffect, useState } from 'react';
import { Upload, Modal, List, Card, Button, message, Typography, Space, Empty, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import request from '../utils/request';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const MediaManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await request.get('/media');
      setMediaList(res.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = (item: any) => {
    setPreviewImage(`http://127.0.0.1:5000${item.file_url}`);
    setPreviewOpen(true);
    setPreviewTitle(item.original_name || item.filename);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定吗？',
      onOk: async () => {
        try {
          await request.delete(`/media/${id}`);
          message.success('删除成功');
          fetchMedia();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'http://127.0.0.1:5000/api/v1/media/upload',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        fetchMedia();
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>媒体库资源</Title>
        <Space>
          <Button icon={<InboxOutlined />} onClick={fetchMedia}>刷新</Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
          <p className="ant-upload-hint">支持单次或批量上传，严禁上传色情、暴力等违规内容。</p>
        </Dragger>
      </Card>

      <Spin spinning={loading}>
        {mediaList.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 8 }}
            dataSource={mediaList}
            renderItem={(item: any) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 150, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                      <img
                        alt={item.filename}
                        src={`http://127.0.0.1:5000${item.file_url}`}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  }
                  actions={[
                    <EyeOutlined key="view" onClick={() => handlePreview(item)} />,
                    <DeleteOutlined key="delete" onClick={() => handleDelete(item.id)} style={{ color: '#ff4d4f' }} />,
                  ]}
                >
                  <Card.Meta 
                    title={<Text ellipsis>{item.original_name}</Text>} 
                    description={`${(item.file_size / 1024).toFixed(1)} KB`}
                  />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无媒体资源" />
        )}
      </Spin>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel} width={800}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default MediaManager;
