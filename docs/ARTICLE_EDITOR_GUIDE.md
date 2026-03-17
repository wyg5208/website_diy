# 文章编辑功能完善 - 使用说明

## 📋 功能概述

本次更新完善了后台文章编辑功能，主要新增：

1. **双编辑器支持**：富文本编辑器（Quill）和 Markdown 编辑器
2. **分类和标签管理**：后台可选择/创建分类和标签
3. **前端文章展示**：支持按指定文章、分类、标签展示文章
4. **公开 API**：前台无需认证即可访问已发布文章

---

## 🚀 后端更新

### 1. 数据库迁移

首先执行数据库迁移脚本添加 `content_format` 字段：

```bash
cd company_cms_project/backend
python add_content_format_field.py
```

**说明**：
- 新增 `content_format` 字段（VARCHAR(20)），默认值为 `'rich'`
- `'rich'` = 富文本格式
- `'markdown'` = Markdown 格式

### 2. 新增 API接口

#### 获取分类和标签（供编辑器使用）
```
GET /api/v1/posts/categories-tags
Headers: Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "categories": [...],
    "tags": [...]
  }
}
```

#### 公开文章列表（前台使用）
```
GET /api/v1/posts/public?page=1&per_page=10&category_id=1&tag_id=5
```

**查询参数**：
- `page`: 页码（默认 1）
- `per_page`: 每页数量（默认 10）
- `category_id`: 分类 ID（可选）
- `tag_id`: 标签 ID（可选）

#### 公开文章详情（前台使用）
```
GET /api/v1/posts/public/<id>
```

---

## 💻 前端更新

### 1. 文章编辑器（PostEditor.tsx）

**新增功能**：
- ✅ 编辑器切换按钮（富文本 ↔ Markdown）
- ✅ 分类选择器（多选）
- ✅ 标签选择器（支持输入新标签）
- ✅ 内容格式自动保存

**使用方式**：
1. 访问 `/admin/posts/new` 创建新文章
2. 选择编辑器类型（右上角切换）
3. 填写标题、内容、摘要
4. 选择分类和标签
5. 设置发布状态后保存

### 2. 文章列表页（PostList.tsx）

**新增筛选功能**：
- ✅ 按分类筛选
- ✅ 按标签筛选
- ✅ 重置筛选

**访问路径**：`/admin/posts`

### 3. 前端文章展示组件

#### ArticleList 组件
可复用的文章列表组件，支持：

```tsx
import ArticleList from './components/ArticleList';

// 显示所有文章
<ArticleList />

// 显示特定分类的文章
<ArticleList categoryId={1} />

// 显示特定标签的文章
<ArticleList tagId="技术" />

// 自定义分页
<ArticleList limit={5} showPagination={true} />
```

**路由配置**：
- `/articles` - 所有文章列表
- `/articles/category/:categoryId` - 指定分类文章
- `/articles/tag/:tagId` - 指定标签文章

#### PostDetailPage 组件
增强的文章详情页，支持：
- ✅ 富文本内容渲染
- ✅ Markdown 内容渲染（使用 react-markdown）
- ✅ 分类和标签显示
- ✅ 元信息展示（作者、时间、浏览量）

**访问路径**：`/post/:id`

---

## 🎯 使用场景

### 场景 1：发布公司新闻

1. 后台创建文章，使用**富文本编辑器**
2. 分类选择"公司新闻"
3. 添加相关标签（如"公告"、"新闻"）
4. 设置为"已发布"

**前台展示**：
- 在"关于我们"页面嵌入 `<ArticleList categoryId={1} />`
- 或直接链接到 `/articles/category/1`

### 场景 2：技术博客

1. 后台创建文章，使用**Markdown 编辑器**
2. 分类选择"技术分享"
3. 添加标签（如"React"、"教程"）
4. 设置封面图片

**前台展示**：
- 在"技术博客"页面嵌入 `<ArticleList categoryId={2} tagId="React" />`
- 支持代码高亮、表格等 Markdown 特性

### 场景 3：产品更新日志

1. 创建文章，使用富文本编辑器
2. 分类选择"产品动态"
3. 标签添加"更新日志"、"v1.0"等
4. 按时间倒序展示

**前台展示**：
- 在产品页面嵌入 `<ArticleList categoryId={3} limit={5} />`
- 只显示最新 5 条更新

---

## 📦 依赖安装

前端已自动安装以下依赖：

```json
{
  "@uiw/react-md-editor": "^4.x",
  "react-markdown": "^9.x"
}
```

如需手动安装：
```bash
cd company_cms_project/frontend
npm install @uiw/react-md-editor react-markdown
```

---

## 🔧 配置说明

### 编辑器配置

**富文本编辑器工具栏**：
- 标题（H1-H3）
- 粗体、斜体、下划线、删除线
- 引用、列表
- 链接、图片
- 清除格式

**Markdown 编辑器功能**：
- 实时预览
- 语法高亮
- 表格支持
- 代码块支持

### 分类和标签

**分类**：
- 支持多级分类（树形结构）
- 可设置父级分类
- 支持排序

**标签**：
- 扁平结构
- 支持输入新标签
- 自动去重

---

## 🎨 样式定制

### Markdown 内容样式

如需定制 Markdown 渲染样式，可在全局 CSS 中添加：

```css
.markdown-content h1 {
  color: #1677ff;
  font-size: 24px;
}

.markdown-content code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.markdown-content pre {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}
```

---

## 🐛 已知问题

1. **旧文章兼容性**：迁移前已有的文章 `content_format` 默认为 `'rich'`
2. **Markdown 预览**：编辑时预览模式占用较多内存，建议长文使用纯编辑模式

---

## 📝 最佳实践

1. **内容格式选择**：
   - 公司新闻、公告 → 富文本
   - 技术文章、教程 → Markdown

2. **分类规划**：
   - 提前规划好分类结构（建议不超过 3 级）
   - 每个分类分配明确的用途

3. **标签使用**：
   - 保持标签简洁（建议 3-5 个/文章）
   - 避免创建过多重复标签

4. **SEO 优化**：
   - 为每篇文章设置独特的 Slug
   - 填写文章摘要（excerpt）
   - 上传合适的封面图片

---

## 🚀 下一步计划

- [ ] 文章搜索功能
- [ ] 相关文章推荐
- [ ] 文章阅读进度条
- [ ] 评论系统
- [ ] 文章收藏/点赞
- [ ] RSS 订阅支持

---

## 📞 技术支持

如有问题，请查看：
- 后端日志：`company_cms_project/backend/logs/`
- 浏览器控制台错误信息
- API 响应数据（F12 Network 面板）
