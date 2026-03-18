import React from 'react';
import { Card, Row, Col, Button, Typography, Tag, message, Space } from 'antd';
import { CheckCircleOutlined, BgColorsOutlined } from '@ant-design/icons';
import { useTheme, PRESET_THEMES } from '../contexts/ThemeContext';
import type { ThemeConfig } from '../types/theme';

const { Title, Text, Paragraph } = Typography;

const ThemeSettings: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  const handleApplyTheme = async (theme: ThemeConfig) => {
    try {
      await setTheme(theme.id);
      message.success(`已应用「${theme.name}」主题`);
    } catch (error) {
      message.error('主题应用失败');
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <BgColorsOutlined style={{ marginRight: 8 }} />
          主题设置
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 8 }}>
          选择一个预设主题，一键应用到整个网站
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {PRESET_THEMES.map((theme) => {
          const isActive = currentTheme.id === theme.id;
          
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={theme.id}>
              <Card
                hoverable
                style={{
                  border: isActive ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* 主题预览色块 */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 60,
                      background: `linear-gradient(135deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
                      borderRadius: 6,
                    }}
                  />
                </div>
                
                {/* 颜色预览点 */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: theme.colors.primary,
                      border: '2px solid #fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    title="主色"
                  />
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: theme.colors.secondary,
                      border: '2px solid #fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    title="辅助色"
                  />
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: theme.colors.headerBg,
                      border: '2px solid #fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    title="头部色"
                  />
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: theme.colors.background,
                      border: '2px solid #e8e8e8',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    title="背景色"
                  />
                </div>

                {/* 主题名称 */}
                <div style={{ marginBottom: 8 }}>
                  <Space>
                    <Text strong style={{ fontSize: 16 }}>{theme.name}</Text>
                    {isActive && <Tag color="success" icon={<CheckCircleOutlined />}>当前</Tag>}
                  </Space>
                </div>

                {/* 描述 */}
                <Paragraph 
                  type="secondary" 
                  style={{ fontSize: 12, marginBottom: 12 }}
                  ellipsis={{ rows: 2 }}
                >
                  {theme.description}
                </Paragraph>

                {/* 应用按钮 */}
                <Button
                  type={isActive ? 'default' : 'primary'}
                  block
                  disabled={isActive}
                  onClick={() => handleApplyTheme(theme)}
                  style={{
                    background: isActive ? undefined : theme.colors.primary,
                    borderColor: isActive ? undefined : theme.colors.primary,
                  }}
                >
                  {isActive ? '当前使用' : '应用主题'}
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 当前主题详情 */}
      <Card title="当前主题配色详情" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {Object.entries(currentTheme.colors).map(([key, value]) => (
            <Col xs={12} sm={8} md={6} lg={4} key={key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    background: value,
                    border: '1px solid #e8e8e8',
                  }}
                />
                <div>
                  <div style={{ fontSize: 12, color: '#999' }}>{key}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace' }}>{value}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default ThemeSettings;
