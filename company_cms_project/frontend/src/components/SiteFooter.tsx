import React, { useState, useEffect } from 'react';
import { Layout, Typography, Divider } from 'antd';
import { getFooterConfig } from '../api/footer';
import type { FooterConfig } from '../types/components';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph } = Typography;

interface SiteFooterProps {
  className?: string;
  style?: React.CSSProperties;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ className, style }) => {
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterConfig = async () => {
      try {
        const response = await getFooterConfig();
        console.log('SiteFooter - 获取到的响应:', response);
        // 拦截器返回的是 res ({code, message, data})
        if (response.code === 200) { // 直接访问 code
          console.log('SiteFooter - 设置配置:', response.data);
          console.log('SiteFooter - enabled 字段:', response.data?.enabled);
          setFooterConfig(response.data); // response.data 是实际的 FooterConfig
        } else {
          console.error('SiteFooter - 响应码错误:', response.code);
        }
      } catch (error) {
        console.error('加载底栏配置失败:', error);
        // 使用默认配置
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
      } finally {
        setLoading(false);
        console.log('SiteFooter - 加载完成，loading=false, footerConfig=', footerConfig);
      }
    };

    loadFooterConfig();
    
    // 监听配置更新事件
    const handleConfigUpdate = (event: CustomEvent<any>) => {
      console.log('收到底栏配置更新事件:', event.detail);
      setFooterConfig(event.detail);
    };
    
    window.addEventListener('footerConfigUpdated', handleConfigUpdate as EventListener);
    
    return () => {
      window.removeEventListener('footerConfigUpdated', handleConfigUpdate as EventListener);
    };
  }, []);

  // 如果还在加载或配置不可用，显示默认底栏
  if (loading || !footerConfig || !footerConfig.enabled) {
    console.log('SiteFooter - 显示默认底栏，loading:', loading, 'footerConfig:', footerConfig);
    return (
      <AntFooter 
        style={{ 
          textAlign: 'center', 
          padding: '40px 0', 
          background: '#001529', 
          color: 'rgba(255,255,255,0.45)',
          ...style 
        }} 
        className={className}
      >
        <Title level={5} style={{ color: '#fff', marginBottom: '20px' }}>
          CORPCMS 企业内容管理平台
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.45)' }}>
          专业的 Python 后端与现代 React 前端技术栈，为您的企业品牌保驾护航
        </Paragraph>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div>©2026 Created by Qoder | 工业级解决方案</div>
      </AntFooter>
    );
  }

  // 根据配置渲染底栏
  return (
    <AntFooter 
      style={{ 
        textAlign: 'center', 
        padding: `${footerConfig.height / 2}px 0`,
        background: footerConfig.backgroundColor,
        color: footerConfig.textColor,
        minHeight: `${footerConfig.height}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style 
      }} 
      className={className}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Title 
          level={5} 
          style={{ 
            color: '#fff', 
            marginBottom: '20px',
            ...(footerConfig.elements ? footerConfig.elements.find(el => el.id === 'title-element')?.style : {})
          }}
        >
          {footerConfig.title}
        </Title>
        <Paragraph 
          style={{ 
            color: footerConfig.textColor,
            marginBottom: '20px',
            ...(footerConfig.elements ? footerConfig.elements.find(el => el.id === 'desc-element')?.style : {})
          }}
        >
          {footerConfig.description}
        </Paragraph>
        <Divider style={{ 
          borderColor: 'rgba(255,255,255,0.1)', 
          margin: '20px 0',
          ...(footerConfig.elements ? footerConfig.elements.find(el => el.id === 'divider-element')?.style : {})
        }} />
        <div 
          style={{ 
            color: footerConfig.textColor,
            ...(footerConfig.elements ? footerConfig.elements.find(el => el.id === 'copyright-element')?.style : {})
          }}
        >
          {footerConfig.copyright}
        </div>
      </div>
    </AntFooter>
  );
};

export default SiteFooter;
