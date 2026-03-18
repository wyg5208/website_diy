import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import type { ReactNode } from 'react';
import Home from './pages/Home';
import PostDetailPage from './pages/PostDetailPage';
import Login from './pages/Login';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import PostList from './pages/PostList';
import PostEditor from './pages/PostEditor';
import MediaManager from './pages/MediaManager';
import PageEditor from './pages/PageEditor';
import TemplateSelector from './pages/TemplateSelector';
import ThemeSettings from './pages/ThemeSettings';
import MenuManager from './pages/MenuManager';
import FooterConfig from './pages/FooterConfig';
import LogoConfig from './pages/LogoConfig';
import UserManager from './pages/UserManager';
import DynamicPage from './pages/DynamicPage';
import DynamicPageWithRouter from './pages/DynamicPageWithRouter';
import ArticleList from './components/ArticleList';
import './App.css';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* 用户端 (前台) */}
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<DynamicPage pageKey="solutions" />} />
          <Route path="/cases" element={<DynamicPage pageKey="cases" />} />
          <Route path="/about" element={<DynamicPage pageKey="about" />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/category/:categoryId" element={<ArticleList />} />
          <Route path="/articles/tag/:tagId" element={<ArticleList />} />
          
          {/* 动态页面路由 - 处理菜单管理中添加的自定义页面 */}
          {/* 注意：这个路由必须放在最后，避免与上面的固定路由冲突 */}
          <Route path="/:pageKey" element={<DynamicPageWithRouter />} />

          {/* 登录页 */}
          <Route path="/login" element={<Login />} />

          {/* 管理端 (后台) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<PostList />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/edit/:id" element={<PostEditor />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="pages/editor" element={<PageEditor />} />
            <Route path="pages/templates" element={<TemplateSelector />} />
            <Route path="pages/menus" element={<MenuManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="theme" element={<ThemeSettings />} />
            <Route path="logo-config" element={<LogoConfig />} />
            <Route path="footer-config" element={<FooterConfig />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
