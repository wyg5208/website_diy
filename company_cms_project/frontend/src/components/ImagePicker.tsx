import React, { useState } from 'react';
import { Modal, Tabs, Upload, Input, Button, List, Empty, Spin, message } from 'antd';
import { PictureOutlined, UploadOutlined, LinkOutlined, CheckCircleFilled } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import request, { handleLoginExpired } from '../utils/request';
import type { RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface ImagePickerProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
}

interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  file_url: string;
  mime_type: string;
  file_size: number;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ value, onChange, placeholder = '请选择图片' }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // 加载媒体库图片
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await request.get('/media', {
        params: { mime_type: 'image', per_page: 50 }
      });
      // 只筛选图片类型
      const images = (res.data?.items || []).filter((item: MediaItem) => 
        item.mime_type?.startsWith('image/')
      );
      setMediaList(images);
    } catch (error) {
      console.error('获取媒体库失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 打开弹窗时加载媒体库
  const handleOpenModal = () => {
    setModalOpen(true);
    setSelectedUrl(value || '');
    setUrlInput('');
    fetchMedia();
  };

  // 选择图片
  const handleSelect = (url: string) => {
    setSelectedUrl(url);
  };

  // 确认选择
  const handleConfirm = () => {
    if (activeTab === 'url' && urlInput) {
      onChange?.(urlInput);
    } else if (selectedUrl) {
      onChange?.(selectedUrl);
    }
    setModalOpen(false);
  };

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/png,image/jpeg,image/jfif,image/gif,image/webp,image/bmp,image/svg+xml',
    showUploadList: false,
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append('file', file as RcFile);
      
      setUploading(true);
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
          setUploading(false);
          return;
        }
        
        if (response.ok && result.code === 201) {
          onSuccess?.(result);
          message.success('上传成功');
          const imageUrl = `http://127.0.0.1:5000${result.data.file_url}`;
          setSelectedUrl(imageUrl);
          fetchMedia();
          setActiveTab('library');
        } else {
          onError?.(new Error(result.message || '上传失败'));
          message.error(result.message || '上传失败');
        }
      } catch (error) {
        onError?.(error as Error);
        message.error('上传失败');
      } finally {
        setUploading(false);
      }
    },
  };

  // 渲染当前图片预览
  const renderPreview = () => {
    if (value) {
      return (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            padding: '4px 8px',
            background: '#fafafa',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            cursor: 'pointer'
          }}
          onClick={handleOpenModal}
        >
          <img 
            src={value} 
            alt="已选图片" 
            style={{ 
              width: 40, 
              height: 40, 
              objectFit: 'cover',
              borderRadius: 4
            }} 
          />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: '#666' }}>
            {value.split('/').pop()}
          </span>
          <Button type="link" size="small">更换</Button>
        </div>
      );
    }
    return (
      <Button 
        icon={<PictureOutlined />} 
        onClick={handleOpenModal}
        style={{ width: '100%' }}
      >
        {placeholder}
      </Button>
    );
  };

  const tabItems = [
    {
      key: 'library',
      label: (
        <span>
          <PictureOutlined />
          媒体库
        </span>
      ),
      children: (
        <Spin spinning={loading}>
          {mediaList.length > 0 ? (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <List
                grid={{ gutter: 12, column: 4 }}
                dataSource={mediaList}
                renderItem={(item) => {
                  const imageUrl = `http://127.0.0.1:5000${item.file_url}`;
                  const isSelected = selectedUrl === imageUrl;
                  return (
                    <List.Item>
                      <div
                        onClick={() => handleSelect(imageUrl)}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #1677ff' : '2px solid transparent',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={item.original_name}
                          style={{
                            width: '100%',
                            height: 80,
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        {isSelected && (
                          <CheckCircleFilled
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              color: '#1677ff',
                              fontSize: 18,
                              background: '#fff',
                              borderRadius: '50%',
                            }}
                          />
                        )}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            fontSize: 10,
                            padding: '2px 4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.original_name}
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          ) : (
            <Empty description="媒体库暂无图片" />
          )}
        </Spin>
      ),
    },
    {
      key: 'upload',
      label: (
        <span>
          <UploadOutlined />
          本地上传
        </span>
      ),
      children: (
        <div style={{ padding: '20px 0' }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1677ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
            <p className="ant-upload-hint">支持 JPG、JPEG、JFIF、PNG、GIF、WebP、BMP、SVG 格式</p>
          </Dragger>
          {uploading && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Spin tip="上传中..." />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'url',
      label: (
        <span>
          <LinkOutlined />
          网络图片
        </span>
      ),
      children: (
        <div style={{ padding: '20px 0' }}>
          <Input
            placeholder="请输入图片 URL，如 https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          {urlInput && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: 8, color: '#666' }}>图片预览：</p>
              <img
                src={urlInput}
                alt="预览"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {renderPreview()}
      <Modal
        title="选择图片"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleConfirm}
        okText="确认选择"
        cancelText="取消"
        width={680}
        okButtonProps={{
          disabled: activeTab === 'url' ? !urlInput : !selectedUrl,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Modal>
    </>
  );
};

export default ImagePicker;
