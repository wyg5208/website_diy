import React, { useEffect, useState } from 'react';
import { Upload, Modal, List, Card, Button, message, Typography, Space, Empty, Spin } from 'antd';
import { DeleteOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import request, { handleLoginExpired } from '../utils/request';
import type { RcFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const MediaManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image');

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
    const url = `http://127.0.0.1:5000${item.file_url}`;
    setPreviewUrl(url);
    // 根据 mime_type 判断类型
    const isVideo = item.mime_type?.startsWith('video/');
    setPreviewType(isVideo ? 'video' : 'image');
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
    accept: 'image/png,image/jpeg,image/jfif,image/gif,image/webp,image/bmp,image/svg+xml,video/mp4,video/webm,application/pdf',
    showUploadList: false,
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append('file', file as RcFile);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/api/v1/media/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        const result = await response.json();
        
        if (response.status === 401 || result.code === 401) {
          handleLoginExpired();
          onError?.(new Error('登录已过期'));
          return;
        }
        
        if (response.ok && result.code === 201) {
          onSuccess?.(result);
          message.success(`${(file as RcFile).name} 上传成功`);
          fetchMedia();
        } else {
          onError?.(new Error(result.message || '上传失败'));
          message.error(result.message || `${(file as RcFile).name} 上传失败`);
        }
      } catch (error) {
        onError?.(error as Error);
        message.error(`${(file as RcFile).name} 上传失败`);
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
                      {item.mime_type?.startsWith('video/') ? (
                        <video
                          src={`http://127.0.0.1:5000${item.file_url}`}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          preload="metadata"
                        />
                      ) : (
                        <img
                          alt={item.filename}
                          src={`http://127.0.0.1:5000${item.file_url}`}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      )}
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
        {previewType === 'video' ? (
          <video
            src={previewUrl}
            style={{ width: '100%' }}
            controls
            autoPlay
          />
        ) : (
          <img alt="preview" style={{ width: '100%' }} src={previewUrl} />
        )}
      </Modal>
    </div>
  );
};

export default MediaManager;
