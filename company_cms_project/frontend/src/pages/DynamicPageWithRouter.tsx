import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicPage from './DynamicPage';

const DynamicPageWithRouter: React.FC = () => {
  const { pageKey } = useParams<{ pageKey: string }>();
  
  // 排除已知的固定路由，避免冲突
  const fixedRoutes = ['solutions', 'cases', 'about', 'post', 'login', 'admin'];
  
  // 检查是否为有效的页面key（不包含特殊字符，长度合理）
  if (!pageKey || 
      fixedRoutes.includes(pageKey) || 
      pageKey.includes('.') || 
      pageKey.length > 50) {
    return <div>页面不存在</div>;
  }
  
  return <DynamicPage pageKey={pageKey} />;
};

export default DynamicPageWithRouter;