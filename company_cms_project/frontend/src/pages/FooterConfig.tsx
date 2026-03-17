import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Form, Input, InputNumber, Switch, Button, Space, 
  message, Row, Col, Divider, ColorPicker, Typography 
} from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
  SaveOutlined, 
  UndoOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import { getFooterConfig, updateFooterConfig } from '../api/footer';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

interface FooterConfigType {
  enabled: boolean;
  height: number;
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
  copyright: string;
  elements?: any[];
}

const FooterConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [footerConfig, setFooterConfig] = useState<FooterConfigType>({
    enabled: true,
    height: 200,
    backgroundColor: '#001529',
    textColor: 'rgba(255,255,255,0.45)',
    title: 'CORPCMS 企业内容管理平台',
    description: '专业的 Python 后端与现代 React 前端技术栈，为您的企业品牌保驾护航',
    copyright: '©2026 Created by Qoder | 工业级解决方案',
    elements: []
  });
  const [form] = Form.useForm();

  // 加载底栏配置
  const loadFooterConfig = async () => {
    setLoading(true);
    try {
      const response = await getFooterConfig();
      // response 现在是 ApiResponse ({code, message, data})
      if (response.code === 200) {
        const config = response.data;  // 获取实际的配置数据
        setFooterConfig(config);
        form.setFieldsValue(config);
      }
    } catch (error: any) {
      console.error('加载底栏配置失败:', error);
      message.error(error.message || '加载底栏配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFooterConfig();
  }, []);

  // 保存底栏配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 处理颜色值，提取十六进制字符串
      const configToSend = {
        ...values,
        backgroundColor: typeof values.backgroundColor === 'object' 
          ? (values.backgroundColor as Color).toHexString() 
          : values.backgroundColor,
        textColor: typeof values.textColor === 'object' 
          ? (values.textColor as Color).toHexString() 
          : values.textColor
      };
      
      const response = await updateFooterConfig(configToSend);
      
      // response 现在是 ApiResponse ({code, message, data})
      if (response.code === 200) {
        message.success(response.message || '底栏配置保存成功');
        const savedConfig = response.data;  // 获取保存后的配置数据
        setFooterConfig(savedConfig);
        form.setFieldsValue(savedConfig);
        
        // 触发全局事件，通知所有组件重新加载底栏配置
        window.dispatchEvent(new CustomEvent('footerConfigUpdated', { detail: savedConfig }));
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error: any) {
      console.error('保存配置出错:', error);
      message.error(error.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setFooterConfig({
      enabled: true,
      height: 200,
      backgroundColor: '#001529',
      textColor: 'rgba(255,255,255,0.45)',
      title: 'CORPCMS 企业内容管理平台',
      description: '专业的 Python 后端与现代 React 前端技术栈，为您的企业品牌保驾护航',
      copyright: '©2026 Created by Qoder | 工业级解决方案',
      elements: []
    });
  };

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3}>
            <SettingOutlined style={{ marginRight: 8 }} />
            底栏配置
          </Title>
          <Text type="secondary">
            配置网站底部栏的显示内容、样式和布局
          </Text>
        </div>

        <Row gutter={24}>
          {/* 配置面板 */}
          <Col span={16}>
            <Card 
              title="配置选项" 
              extra={
                <Space>
                  <Button icon={<UndoOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSave}
                    loading={loading}
                  >
                    保存配置
                  </Button>
                </Space>
              }
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={footerConfig}
              >
                <Form.Item
                  label="启用底栏"
                  name="enabled"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Divider />

                <Form.Item
                  label="底栏高度 (px)"
                  name="height"
                  rules={[{ required: true, message: '请输入底栏高度' }]}
                >
                  <InputNumber 
                    min={100} 
                    max={600} 
                    style={{ width: '100%' }} 
                  />
                </Form.Item>

                <Form.Item
                  label="背景颜色"
                  name="backgroundColor"
                  rules={[{ required: true, message: '请选择背景颜色' }]}
                >
                  <ColorPicker format="hex" showText />
                </Form.Item>

                <Form.Item
                  label="文字颜色"
                  name="textColor"
                  rules={[{ required: true, message: '请选择文字颜色' }]}
                >
                  <ColorPicker format="rgb" showText />
                </Form.Item>

                <Divider />

                <Form.Item
                  label="标题"
                  name="title"
                  rules={[{ required: true, message: '请输入标题' }]}
                >
                  <Input placeholder="CORPCMS 企业内容管理平台" />
                </Form.Item>

                <Form.Item
                  label="描述"
                  name="description"
                >
                  <TextArea 
                    rows={3} 
                    placeholder="专业的 Python 后端与现代 React 前端技术栈..." 
                  />
                </Form.Item>

                <Form.Item
                  label="版权信息"
                  name="copyright"
                  rules={[{ required: true, message: '请输入版权信息' }]}
                >
                  <Input placeholder="©2026 Created by Qoder | 工业级解决方案" />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 实时预览 */}
          <Col span={8}>
            <Card title="实时预览">
              <div style={{ 
                background: footerConfig.backgroundColor,
                color: footerConfig.textColor,
                padding: '40px 20px',
                minHeight: footerConfig.height,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: '4px'
              }}>
                {footerConfig.title && (
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                    {footerConfig.title}
                  </div>
                )}
                {footerConfig.description && (
                  <div style={{ marginBottom: '12px', opacity: 0.7 }}>
                    {footerConfig.description}
                  </div>
                )}
                {footerConfig.copyright && (
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    {footerConfig.copyright}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default FooterConfig;
