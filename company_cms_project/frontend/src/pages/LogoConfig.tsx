import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Form, Input, InputNumber, Switch, Button, Space, 
  message, Row, Col, Divider, ColorPicker, Typography, Select, 
  Upload, Image, Radio, ConfigProvider
} from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
  SaveOutlined, 
  UndoOutlined, 
  SettingOutlined,
  UploadOutlined,
  DeleteOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { getLogoConfig, updateLogoConfig } from '../api/logo';
import { getMediaList } from '../api/media';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;

interface LogoConfigType {
  enabled: boolean;
  displayMode: 'textOnly' | 'imageOnly' | 'textAndImage';
  logoImage: string;
  logoImageWidth: number;
  logoImageHeight: number;
  logoText: string;
  logoSubText: string;
  textColor: string;
  subTextColor: string;
  fontSize: number;
  subFontSize: number;
  fontWeight: number;
  letterSpacing: number;
  imageGap: number;
  linkUrl: string;
}

const LogoConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logoConfig, setLogoConfig] = useState<LogoConfigType>({
    enabled: true,
    displayMode: 'textAndImage',
    logoImage: '',
    logoImageWidth: 40,
    logoImageHeight: 40,
    logoText: 'CORP',
    logoSubText: 'CMS',
    textColor: '#1890ff',
    subTextColor: '#001529',
    fontSize: 22,
    subFontSize: 22,
    fontWeight: 800,
    letterSpacing: 1,
    imageGap: 12,
    linkUrl: '/'
  });
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [form] = Form.useForm();

  // 加载媒体库图片
  const loadMediaList = async () => {
    try {
      const response = await getMediaList({ page: 1, per_page: 50 });
      if (response.code === 200) {
        const images = response.data.items.filter((item: any) => 
          item.mime_type?.startsWith('image/')
        );
        setMediaList(images);
      }
    } catch (error) {
      console.error('加载媒体库失败:', error);
    }
  };

  // 加载 LOGO 配置
  const loadLogoConfig = async () => {
    setLoading(true);
    try {
      const response = await getLogoConfig();
      if (response.code === 200) {
        const config = response.data;
        setLogoConfig(config);
        form.setFieldsValue(config);
      }
    } catch (error: any) {
      console.error('加载 LOGO 配置失败:', error);
      message.error(error.message || '加载 LOGO 配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogoConfig();
    loadMediaList();
  }, []);

  // 保存 LOGO 配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 处理颜色值，提取十六进制字符串
      const configToSend = {
        ...values,
        textColor: typeof values.textColor === 'object' 
          ? (values.textColor as Color).toHexString() 
          : values.textColor,
        subTextColor: typeof values.subTextColor === 'object' 
          ? (values.subTextColor as Color).toHexString() 
          : values.subTextColor
      };
      
      // 移除可能存在的 backgroundColor 字段（LOGO 配置不需要）
      delete configToSend.backgroundColor;
      
      const response = await updateLogoConfig(configToSend);
      
      if (response.code === 200) {
        message.success('LOGO 配置保存成功');
        setLogoConfig(response.data);
        form.setFieldsValue(response.data);
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
    setLogoConfig({
      enabled: true,
      displayMode: 'textAndImage',
      logoImage: '',
      logoImageWidth: 40,
      logoImageHeight: 40,
      logoText: 'CORP',
      logoSubText: 'CMS',
      textColor: '#1890ff',
      subTextColor: '#001529',
      fontSize: 22,
      subFontSize: 22,
      fontWeight: 800,
      letterSpacing: 1,
      imageGap: 12,
      linkUrl: '/'
    });
  };

  // 选择媒体库图片
  const handleSelectMedia = (imageUrl: string) => {
    form.setFieldsValue({ logoImage: imageUrl });
    setLogoConfig(prev => ({ ...prev, logoImage: imageUrl }));
    setUploadVisible(false);
  };

  // 删除图片
  const handleRemoveImage = () => {
    form.setFieldsValue({ logoImage: '' });
    setLogoConfig(prev => ({ ...prev, logoImage: '' }));
  };

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3}>
            <SettingOutlined style={{ marginRight: 8 }} />
            LOGO 配置
          </Title>
          <Text type="secondary">
            配置网站左上角的 LOGO，支持文字 + 图片的组合或仅图片或文字
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
                initialValues={logoConfig}
              >
                <Form.Item
                  label="启用 LOGO"
                  name="enabled"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Divider />

                <Form.Item
                  label="显示模式"
                  name="displayMode"
                  rules={[{ required: true, message: '请选择显示模式' }]}
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="textAndImage">文字 + 图片</Radio.Button>
                    <Radio.Button value="textOnly">仅文字</Radio.Button>
                    <Radio.Button value="imageOnly">仅图片</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Divider />

                {/* 图片配置 */}
                {(logoConfig.displayMode === 'textAndImage' || logoConfig.displayMode === 'imageOnly') && (
                  <>
                    <Form.Item
                      label="LOGO 图片"
                      name="logoImage"
                      extra="支持从媒体库选择图片或上传图片"
                    >
                      <div style={{ border: '1px dashed #d9d9d9', padding: '12px', borderRadius: '4px' }}>
                        {logoConfig.logoImage ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Image 
                              src={logoConfig.logoImage} 
                              alt="LOGO" 
                              style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                              preview={false}
                            />
                            <Button
                              type="link"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={handleRemoveImage}
                              style={{ position: 'absolute', top: -10, right: -10 }}
                            />
                          </div>
                        ) : (
                          <Button
                            icon={<UploadOutlined />}
                            onClick={() => setUploadVisible(!uploadVisible)}
                          >
                            选择图片
                          </Button>
                        )}
                        
                        {uploadVisible && (
                          <div style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                            <Row gutter={[16, 16]}>
                              {mediaList.map((media) => (
                                <Col key={media.id} xs={6}>
                                  <Image
                                    src={media.file_url}
                                    alt={media.original_name}
                                    style={{ 
                                      width: '100%', 
                                      height: '80px', 
                                      objectFit: 'cover',
                                      cursor: 'pointer',
                                      border: '2px solid transparent',
                                      borderRadius: '4px'
                                    }}
                                    preview={false}
                                    onClick={() => handleSelectMedia(media.file_url)}
                                  />
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}
                      </div>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="图片宽度 (px)"
                          name="logoImageWidth"
                          rules={[{ required: true, message: '请输入图片宽度' }]}
                        >
                          <InputNumber min={20} max={200} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="图片高度 (px)"
                          name="logoImageHeight"
                          rules={[{ required: true, message: '请输入图片高度' }]}
                        >
                          <InputNumber min={20} max={200} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="图片与文字间距 (px)"
                      name="imageGap"
                    >
                      <InputNumber min={0} max={50} style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider />
                  </>
                )}

                {/* 文字配置 */}
                {(logoConfig.displayMode === 'textAndImage' || logoConfig.displayMode === 'textOnly') && (
                  <>
                    <Form.Item
                      label="LOGO 主文字"
                      name="logoText"
                      rules={[{ required: true, message: '请输入 LOGO 主文字' }]}
                    >
                      <Input placeholder="如：CORP" />
                    </Form.Item>

                    <Form.Item
                      label="LOGO 副标题"
                      name="logoSubText"
                      extra="可选，留空则不显示"
                    >
                      <Input placeholder="如：CMS（可选）" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="主文字大小 (px)"
                          name="fontSize"
                          rules={[{ required: true, message: '请输入主文字大小' }]}
                        >
                          <InputNumber min={12} max={72} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="副标题文字大小 (px)"
                          name="subFontSize"
                        >
                          <InputNumber min={12} max={72} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="主文字颜色"
                          name="textColor"
                          rules={[{ required: true, message: '请选择主文字颜色' }]}
                        >
                          <ColorPicker format="hex" showText />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="副标题颜色"
                          name="subTextColor"
                        >
                          <ColorPicker format="hex" showText />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="文字粗细"
                          name="fontWeight"
                        >
                          <Select>
                            <Option value={400}>常规</Option>
                            <Option value={600}>加粗</Option>
                            <Option value={800}>特粗</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="文字间距"
                          name="letterSpacing"
                        >
                          <InputNumber min={0} max={20} step={0.5} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider />
                  </>
                )}

                <Form.Item
                  label="LOGO 点击链接"
                  name="linkUrl"
                  extra="点击 LOGO 后跳转的页面路径"
                >
                  <Input placeholder="/" prefix={<LinkOutlined />} />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 实时预览 */}
          <Col span={8}>
            <Card title="实时预览">
              <div style={{ 
                background: '#fff',
                padding: '20px',
                borderBottom: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '4px'
              }}>
                {logoConfig.enabled && (
                  <a 
                    href={logoConfig.linkUrl} 
                    style={{ 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {/* 图片部分 */}
                    {(logoConfig.displayMode === 'textAndImage' || logoConfig.displayMode === 'imageOnly') && logoConfig.logoImage && (
                      <img
                        src={logoConfig.logoImage}
                        alt="LOGO"
                        style={{
                          width: `${logoConfig.logoImageWidth}px`,
                          height: `${logoConfig.logoImageHeight}px`,
                          objectFit: 'contain',
                          marginRight: logoConfig.displayMode === 'textAndImage' ? `${logoConfig.imageGap}px` : 0
                        }}
                      />
                    )}

                    {/* 文字部分 */}
                    {(logoConfig.displayMode === 'textAndImage' || logoConfig.displayMode === 'textOnly') && (
                      <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <span
                          style={{
                            fontSize: `${logoConfig.fontSize}px`,
                            color: logoConfig.textColor,
                            fontWeight: logoConfig.fontWeight,
                            letterSpacing: `${logoConfig.letterSpacing}px`
                          }}
                        >
                          {logoConfig.logoText}
                        </span>
                        {logoConfig.logoSubText && (
                          <span
                            style={{
                              fontSize: `${logoConfig.subFontSize}px`,
                              color: logoConfig.subTextColor,
                              fontWeight: logoConfig.fontWeight,
                              marginLeft: '2px'
                            }}
                          >
                            {logoConfig.logoSubText}
                          </span>
                        )}
                      </div>
                    )}
                  </a>
                )}
              </div>
              
              <Divider />
              
              <Card size="small" title="配置说明">
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li>支持三种显示模式：文字 + 图片、仅文字、仅图片</li>
                  <li>可从媒体库选择 LOGO 图片</li>
                  <li>可自定义文字大小、颜色、粗细等样式</li>
                  <li>可调整图片与文字的间距</li>
                  <li>配置后需在前台页面刷新才能看到效果</li>
                </ul>
              </Card>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LogoConfig;
