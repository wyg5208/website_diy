import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Modal, Space, Tag, message } from 'antd';
import { CheckCircleOutlined, EyeOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PAGE_TEMPLATES, cloneTemplateComponents, type PageTemplate } from '../types/templates';
import ComponentRenderer from '../components/ComponentRenderer';

const { Title, Paragraph, Text } = Typography;

const TemplateSelector: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);
  const navigate = useNavigate();

  const handlePreview = (template: PageTemplate) => {
    setPreviewTemplate(template);
  };

  const handleSelect = (template: PageTemplate) => {
    setSelectedId(template.id);
  };

  const handleApply = () => {
    if (!selectedId) {
      message.warning('请先选择一个模板');
      return;
    }

    const template = PAGE_TEMPLATES.find((t) => t.id === selectedId);
    if (!template) return;

    // 克隆模板组件并存储到 localStorage
    const components = cloneTemplateComponents(template);
    const pageData = {
      name: `${template.name} - 我的页面`,
      templateId: template.id,
      components,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('page_draft', JSON.stringify(pageData));
    
    message.success(`已应用「${template.name}」模板，正在跳转编辑器...`);
    
    // 跳转到页面编辑器
    setTimeout(() => {
      navigate('/admin/pages/editor');
    }, 500);
  };

  const getCategoryTag = (category: string) => {
    const map: Record<string, { color: string; label: string }> = {
      default: { color: 'cyan', label: '默认' },
      corporate: { color: 'blue', label: '企业' },
      tech: { color: 'purple', label: '科技' },
      service: { color: 'green', label: '服务' },
    };
    const info = map[category] || { color: 'default', label: category };
    return <Tag color={info.color}>{info.label}</Tag>;
  };

  return (
    <div style={{ padding: '4px' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={2}>选择网站模板</Title>
        <Paragraph type="secondary">
          选择一个预设模板快速开始，您可以在此基础上进行个性化定制
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {PAGE_TEMPLATES.map((template) => (
          <Col xs={24} md={8} key={template.id}>
            <Card
              hoverable
              style={{
                border: selectedId === template.id ? '2px solid #1677ff' : '2px solid transparent',
                transition: 'all 0.3s',
              }}
              cover={
                <div
                  style={{
                    height: 180,
                    background: template.preview,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    position: 'relative',
                  }}
                >
                  {selectedId === template.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: '#1677ff',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircleOutlined style={{ fontSize: 16 }} />
                    </div>
                  )}
                  <Title level={3} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {template.name}
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
                    点击预览效果
                  </Text>
                </div>
              }
              actions={[
                <Button key="preview" icon={<EyeOutlined />} onClick={() => handlePreview(template)}>
                  预览
                </Button>,
                <Button
                  key="select"
                  type={selectedId === template.id ? 'primary' : 'default'}
                  onClick={() => handleSelect(template)}
                >
                  {selectedId === template.id ? '已选择' : '选择'}
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <Space>
                    {template.name}
                    {getCategoryTag(template.category)}
                  </Space>
                }
                description={template.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Space size="large">
          <Button size="large" onClick={() => navigate('/admin/pages/editor')}>
            从空白开始
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            disabled={!selectedId}
            onClick={handleApply}
          >
            应用模板并开始定制
          </Button>
        </Space>
      </div>

      {/* 模板预览弹窗 */}
      <Modal
        title={previewTemplate ? `模板预览 - ${previewTemplate.name}` : '模板预览'}
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setPreviewTemplate(null)}>
            关闭
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => {
              if (previewTemplate) {
                handleSelect(previewTemplate);
                setPreviewTemplate(null);
                message.success('已选择该模板');
              }
            }}
          >
            选择此模板
          </Button>,
        ]}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', background: '#f5f5f5' }}
      >
        {previewTemplate && (
          <div style={{ background: '#fff' }}>
            {previewTemplate.components.map((component) => (
              <ComponentRenderer key={component.id} component={component} />
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplateSelector;
