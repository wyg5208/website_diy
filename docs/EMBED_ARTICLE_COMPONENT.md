# 在页面中嵌入文章组件 - 快速指南

## 🎯 目标

在你的网站页面中展示文章列表或单篇文章。

---

## 📝 方法一：使用路由（推荐）

### 1. 所有文章列表页

访问：`http://localhost:5173/articles`

效果：显示所有已发布的文章，带分页。

---

### 2. 按分类筛选

访问：`http://localhost:5173/articles/category/1`

说明：显示分类 ID 为 1 的所有文章。

**如何获取分类 ID？**
1. 访问后台 `/admin/posts`
2. 查看 URL 或使用浏览器开发者工具
3. 或在数据库 `categories` 表中查询

---

### 3. 按标签筛选

访问：`http://localhost:5173/articles/tag/技术`

说明：显示标签为"技术"的所有文章。

---

## 💻 方法二：在现有页面中嵌入组件

### 步骤 1：导入组件

在你的页面文件中导入：

```tsx
import ArticleList from './components/ArticleList';
```

### 步骤 2：使用组件

#### 示例 1：在首页显示最新文章

编辑 `Home.tsx`：

```tsx
import ArticleList from './components/ArticleList';

const Home: React.FC = () => {
  return (
    <div>
      <h1>欢迎访问公司官网</h1>
      
      {/* 显示最新 5 篇文章 */}
      <ArticleList limit={5} showPagination={false} />
      
      {/* 查看更多链接 */}
      <a href="/articles">查看更多文章 →</a>
    </div>
  );
};
```

#### 示例 2：在"关于我们"页面显示公司新闻

创建或编辑 `pages/About.tsx`：

```tsx
import ArticleList from './components/ArticleList';

const About: React.FC = () => {
  return (
    <div>
      <h1>关于我们</h1>
      <p>公司简介...</p>
      
      <h2>公司新闻</h2>
      {/* 假设"公司新闻"分类 ID 为 1 */}
      <ArticleList categoryId={1} limit={3} showPagination={false} />
      
      <a href="/articles/category/1">查看所有新闻 →</a>
    </div>
  );
};
```

#### 示例 3：在技术博客页面显示特定标签文章

创建或编辑 `pages/Blog.tsx`：

```tsx
import ArticleList from './components/ArticleList';

const Blog: React.FC = () => {
  return (
    <div>
      <h1>技术博客</h1>
      
      {/* 显示所有技术文章 */}
      <ArticleList 
        tagId="技术分享" 
        limit={10} 
        showPagination={true} 
      />
    </div>
  );
};
```

---

## 🔧 方法三：通过菜单管理添加文章页面

### 步骤 1：在后台添加菜单

1. 访问 `/admin/pages/menus`
2. 添加菜单项：
   - 菜单名称："新闻中心"
   - 页面类型：选择"外部链接"
   - 链接地址：`/articles`

3. 保存菜单

### 步骤 2：前台显示

前台导航栏会自动显示"新闻中心"菜单，点击跳转到文章列表页。

---

## 🎨 自定义样式

### 修改文章卡片样式

创建或编辑 `src/App.css`：

```css
/* 自定义文章卡片样式 */
.article-card .ant-card-body {
  padding: 24px;
}

.article-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 自定义标题样式 */
.article-title {
  color: #1677ff;
  font-size: 18px;
  font-weight: 600;
}

/* 自定义元信息样式 */
.article-meta {
  color: #999;
  font-size: 14px;
}
```

---

## 📋 完整示例：创建产品动态页面

### 1. 创建页面文件

新建 `pages/ProductNews.tsx`：

```tsx
import React from 'react';
import { Layout, Typography } from 'antd';
import ArticleList from '../components/ArticleList';
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const ProductNews: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 48px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          公司产品动态
        </div>
      </Header>

      <Content style={{ padding: '48px 48px', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2}>产品更新日志</Title>
          
          {/* 假设"产品动态"分类 ID 为 3 */}
          <ArticleList 
            categoryId={3} 
            limit={10} 
            showPagination={true} 
          />
          
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/">← 返回首页</Link>
          </div>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        ©2026 公司名称
      </Footer>
    </Layout>
  );
};

export default ProductNews;
```

### 2. 添加路由

编辑 `App.tsx`，添加路由：

```tsx
import ProductNews from './pages/ProductNews';

// 在 Routes 中添加
<Route path="/product-news" element={<ProductNews />} />
```

### 3. 添加菜单（可选）

在后台菜单管理中添加：
- 菜单名称："产品动态"
- 链接地址：`/product-news`

---

## 🚀 高级用法

### 组合使用分类和标签

目前 `ArticleList` 组件支持单个筛选条件。如需同时按分类和标签筛选，可以：

**方式 1：修改组件（推荐）**

编辑 `components/ArticleList.tsx`：

```tsx
interface ArticleListProps {
  categoryId?: number;
  tagId?: string | number;
  // ... 其他 props
}

// 在 fetchArticles 函数中
const params: any = {
  page,
  per_page: limit
};

if (categoryId) params.category_id = categoryId;
if (tagId) params.tag_id = tagId;
```

**方式 2：创建专用页面**

创建 `pages/TechBlog.tsx`：

```tsx
const TechBlog: React.FC = () => {
  return (
    <div>
      <h1>技术博客</h1>
      {/* 先按分类筛选 */}
      <ArticleList categoryId={2} limit={10} />
      
      <h2>React 相关文章</h2>
      {/* 再显示特定标签的文章 */}
      <ArticleList tagId="React" limit={5} showPagination={false} />
    </div>
  );
};
```

---

## 📊 数据流向

```
用户访问 /articles
    ↓
ArticleList 组件加载
    ↓
调用 API: GET /api/v1/posts/public
    ↓
后端返回文章列表（JSON）
    ↓
前端渲染卡片
    ↓
用户点击文章
    ↓
跳转到 /post/:id
    ↓
PostDetailPage 加载详情
```

---

## ✅ 检查清单

在发布前确认：

- [ ] 已创建至少一个分类
- [ ] 已创建至少一篇文章
- [ ] 文章状态为"已发布"
- [ ] 后端服务运行正常
- [ ] 前端服务运行正常
- [ ] 能够访问 `/articles` 页面

---

## 🐛 常见问题

### Q1: 组件不显示内容？

**A**: 检查以下几点：
1. 确认有已发布的文章
2. 打开浏览器控制台查看错误信息
3. 检查 Network 面板中 API 请求是否成功

### Q2: 如何知道分类 ID？

**A**: 三种方式：
1. 后台查看分类列表时，从 URL 中获取
2. 数据库查询：`SELECT * FROM categories;`
3. 调用 API：`GET /api/v1/categories`

### Q3: 能否显示单篇指定文章？

**A**: 可以，创建专用组件：

```tsx
import { getPublicPost } from '../api/posts';

const SinglePost: React.FC = () => {
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    getPublicPost(1).then(res => setPost(res.data));
  }, []);
  
  return post ? <div>{post.title}</div> : null;
};
```

---

## 📞 需要帮助？

查看详细文档：
- `ARTICLE_EDITOR_GUIDE.md` - 完整使用指南
- `FEATURE_SUMMARY.md` - 功能总结
- `TEST_ARTICLE_FEATURES.md` - 测试指南

祝使用愉快！🎉
