# 企业网站CMS系统

**版本**: v1.6.0  
**更新日期**: 2026 年 3 月 18 日

一个基于 Python Flask + React 的企业官网内容管理系统，支持可视化拖拽配置，降低技术门槛，提升网站管理效率。

---

## 项目概述

本项目是一套功能完善、易于维护的企业官网CMS系统，采用前后端分离架构，适合中小企业快速搭建和运维。

### 核心特性

- **可视化拖拽编辑器** - 支持组件拖拽布局，非技术人员可独立完成页面设计
- **横幅大图组件** - 背景图片配置、按钮完整样式、链接跳转支持
- **按钮组件全面升级** - 32种图标、自定义颜色、灵活布局、多种链接跳转方式
- **文章管理** - 完整的文章发布、编辑、分类管理功能
- **媒体库** - 支持图片上传、压缩、缩略图生成
- **权限管理** - 基于 JWT 的认证系统，支持多角色权限控制
- **响应式设计** - 适配 PC、平板、手机等多终端
- **SEO 优化** - 支持自定义 URL、Meta 标签、Sitemap 生成

---

## 技术栈

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Python | 3.9+ | 编程语言 |
| Flask | 2.3+ | Web框架 |
| Flask-SQLAlchemy | 3.0+ | ORM数据库操作 |
| Flask-Migrate | 4.0+ | 数据库迁移 |
| Flask-JWT-Extended | 4.5+ | JWT认证 |
| Flask-CORS | 4.0+ | 跨域支持 |
| SQLite3 | 3.35+ | 数据库 |
| Pillow | 10.0+ | 图片处理 |

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19+ | 前端框架 |
| TypeScript | 5+ | 类型系统 |
| Vite | 7+ | 构建工具 |
| Ant Design | 6+ | UI组件库 |
| React Router | 7+ | 路由管理 |
| Axios | 1.13+ | HTTP客户端 |
| @dnd-kit | 6+ | 拖拽系统 |
| React Quill | 3.8+ | 富文本编辑器 |
| Recharts | 3.7+ | 数据可视化 |

### 部署环境

- **操作系统**: Windows Server 2019/2022
- **Web服务器**: Nginx 1.24+
- **WSGI服务器**: Waitress (Windows友好)

---

## 项目结构

```
company_cms/
├── backend/                  # Flask后端
│   ├── app/
│   │   ├── api/              # API蓝图 (文章、分类、媒体等)
│   │   ├── auth/             # 认证模块
│   │   ├── models/           # 数据模型
│   │   └── utils/            # 工具函数
│   ├── data/                 # SQLite数据库文件
│   ├── media/                # 上传的媒体文件
│   ├── migrations/           # 数据库迁移
│   ├── config.py             # 配置文件
│   ├── requirements.txt      # Python依赖
│   └── run.py                # 启动入口
│
├── frontend/                 # React前端
│   ├── src/
│   │   ├── api/              # API接口封装
│   │   ├── components/       # 通用组件
│   │   ├── contexts/         # React上下文
│   │   ├── layout/           # 布局组件
│   │   ├── pages/            # 页面组件
│   │   ├── types/            # TypeScript类型定义
│   │   └── utils/            # 工具函数
│   ├── package.json          # Node依赖
│   └── vite.config.ts        # Vite配置
│
├── deploy/                   # 部署脚本
├── docs/                     # 文档目录
├── tests/                    # 测试脚本
└── .gitignore                # Git忽略配置
```

---

## 快速开始

### 环境要求

- Python 3.9+
- Node.js 18+
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd company_cms
```

### 2. 后端启动

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境 (Windows)
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 初始化数据库
flask db upgrade

# 启动开发服务器
python run.py
```

后端服务默认运行在 `http://localhost:5000`

### 3. 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务默认运行在 `http://localhost:5173`

### 4. 默认账号

```
用户名: admin
密码: admin123
```

> ⚠️ 生产环境请立即修改默认密码！

---

## 开发进度

| 阶段 | 状态 | 说明 |
|------|------|------|
| 架构设计 | ✅ 已完成 | Flask项目架构、数据库设计 |
| 后端API开发 | ✅ 已完成 | 认证、文章、分类、媒体API |
| 前端框架搭建 | ✅ 已完成 | React + Vite + Ant Design |
| 管理后台界面 | ✅ 已完成 | 登录、文章管理、媒体库、分类管理 |
| 可视化编辑器 | ✅ 已完成 | 拖拽编辑器、5个核心组件 |
| 前台展示 | ✅ 已完成 | 首页、文章列表、文章详情 |
| 测试部署 | 🔄 进行中 | 功能测试、Bug修复 |

### MVP功能清单

- ✅ 用户登录/权限管理 (JWT认证)
- ✅ 文章管理 (CRUD、富文本编辑)
- ✅ 分类管理 (树形结构、拖拽排序)
- ✅ 媒体库 (图片上传、缩略图生成)
- ✅ 可视化编辑器 (拖拽布局、5个核心组件)
- ✅ 前台展示页面 (响应式设计)
- ✅ 基础SEO功能 (Meta标签、URL优化)

### V2 版本规划

- ⏳ 高级组件 (轮播图、Tab 标签、时间轴)
- ⏳ 多语言支持 (中英文切换)
- ⏳ 复杂权限控制 (RBAC 细粒度权限)
- ⏳ 数据统计图表
- ⏳ 高级 SEO 功能 (Sitemap 自动生成)
- ⏳ 数据备份恢复界面

---

## 最新版本 (v1.6.0)

**发布日期**: 2026-03-18

### 重构优化

#### 项目目录结构扁平化迁移 🏗️
- ✅ 将 backend/ 和 frontend/ 提升到项目根目录，消除 company_cms_project/ 中间层
- ✅ 修复 Flask-SQLAlchemy SQLite 路径解析问题（使用 basedir 绝对路径）
- ✅ 更新所有部署脚本路径引用（4 个脚本）
- ✅ 全面更新项目文档路径引用（README + 18 个 docs 文档，共 80+ 处）

### 技术改进
- 📝 config.py 数据库路径改用 basedir 构建，避免 instance_path 拼接问题
- 🏗️ 项目结构更加扁平清晰，降低路径复杂度
- 🛡️ 采用渐进式迁移策略，保留原目录支持回滚

---

## 上一版本 (v1.5.1)

**发布日期**: 2026-03-17

### 功能增强

#### 容器子组件新增文章列表选项 📝
- ✅ 顶层容器和嵌套容器均可添加"文章列表"子组件
- ✅ 文章列表组件支持在容器内灵活布局

#### 文章列表分类/标签选择器优化 🏷️
- ✅ 分类筛选从手动输入 ID 改为下拉选择器
- ✅ 标签筛选从手动输入改为下拉选择器
- ✅ 支持搜索过滤、清空选择功能
- ✅ 用户体验显著提升

---

## 历史版本 (v1.5.0)

**发布日期**: 2026-03-17

### 功能增强

#### 页面编辑器容器嵌套功能 🏗️
- ✅ 支持容器内添加嵌套容器，实现复杂页面结构
- ✅ 最大嵌套深度限制为 2 层，防止过度嵌套
- ✅ 嵌套容器编辑面板，支持展开/折叠编辑
- ✅ 根据嵌套深度动态过滤可选子组件类型

#### 容器子组件尺寸统一控制 📐
- ✅ 容器级别新增 `childHeight` 配置，统一子组件高度
- ✅ 支持 80px ~ 400px 多档位选择
- ✅ 图片组件新增 `aspectRatio` 宽高比配置
- ✅ 支持 1:1、4:3、16:9、3:4 四种预设比例

### 技术改进
- 📝 扩展 ContainerComponentData、ImageComponentData 类型定义
- 🎨 使用 padding-top 技巧实现图片固定宽高比
- 🔄 嵌套深度递归计算，动态选项过滤
- 🛡️ 子组件溢出隐藏，确保整齐划一

---

## 历史版本 (v1.4.1)

**发布日期**: 2026-03-16

### 功能增强

#### 横幅大图按钮组件完善 🎨
- ✅ 新增按钮图标配置（32种可选）
- ✅ 新增按钮类型、尺寸、幽灵模式配置
- ✅ 新增按钮自定义颜色（背景色、文字色、边框色）
- ✅ 新增按钮圆角、阴影配置
- ✅ 新增按钮链接跳转（首页/站内页面/外部链接）
- ✅ 新增"新窗口打开"开关

### 技术改进
- 📝 扩展 HeroComponentData 类型定义
- 🎨 配置面板分组展示，条件显示优化
- 🔄 内容对齐联动，按钮随标题位置自动调整
- 🛡️ 默认幽灵模式，适合有背景图场景

---

## 历史版本 (v1.4.0)

**发布日期**: 2026-03-16

### 功能增强

#### 按钮组件全面升级 🎨
- ✅ 新增 32 种图标可选（方向、导航、通讯、媒体、情感等）
- ✅ 支持图标位置配置（文字左侧/右侧）
- ✅ 新增 5 种按钮类型（主要/默认/虚线/文字/链接）
- ✅ 支持自定义背景色、文字色、边框色
- ✅ 支持圆角大小调节（0-50px）
- ✅ 新增阴影效果开关

#### 按钮布局配置 📐
- ✅ 支持对齐方式（左对齐/居中/右对齐）
- ✅ 支持三种宽度模式（自适应/固定/通栏）
- ✅ 支持上下内边距调节

#### 按钮链接增强 🔗
- ✅ 新增站内页面选择器，支持搜索过滤
- ✅ 新增"新窗口打开"开关
- ✅ 优化链接跳转逻辑，内部链接无刷新跳转

### 技术改进
- 📝 完善 TypeScript 类型定义
- 🎨 配置面板分组展示，提升用户体验
- 🔄 条件表单动态显示，避免信息过载

---

## 历史版本 (v1.3.1)

**发布日期**: 2026-03-16

### Bug修复

#### 文章作者显示问题修复 🔧
- ✅ 修复文章列表/详情页作者显示为 "???" 的问题
- ✅ 修复数据库中用户 `display_name` 字段无效值
- ✅ 优化 `Post.to_dict()` 方法，添加防护逻辑

### 技术改进
- 🛡️ 作者不存在时显示 "未知用户"，避免 AttributeError
- 🛡️ `display_name` 无效时自动回退到 `username`
- 📝 增强代码健壮性，处理边界情况

---

## 上一版本 (v1.2.0)

**发布日期**: 2026-03-16

### 新增功能

#### 1. 横幅大图背景图片配置 🎨
- ✅ 支持从媒体库选择背景图片
- ✅ 支持直接上传图片
- ✅ 支持使用外部 URL 图片
- ✅ 4 种填充模式：Cover/Contain/Fill/Repeat
- ✅ 5 个位置选项：居中/顶部/底部/左侧/右侧
- ✅ 智能降级：无图自动使用背景色

#### 2. 按钮组件链接类型扩展 🔗
- ✅ 无链接模式（纯展示按钮）
- ✅ 跳转首页（快捷配置）
- ✅ 跳转站内页面（带页面选择器）
- ✅ 跳转外部链接（新窗口打开）

### 技术改进
- 📝 完善 TypeScript 类型定义
- 🔄 复用 ImagePicker 组件，提升开发效率
- 🎯 响应式 CSS 属性映射优化
- 🚀 React Router 路由集成

### 用户体验提升
- 💡 实时预览背景图片效果
- 💡 条件表单动态显示，避免信息过载
- 💡 外部链接新窗口打开，提升体验

---

## API接口

### 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/login | 用户登录 |
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/logout | 用户登出 |
| POST | /api/v1/auth/refresh | 刷新Token |
| GET | /api/v1/auth/me | 当前用户信息 |

### 文章管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/posts | 文章列表 (支持筛选、分页) |
| GET | /api/v1/posts/:id | 文章详情 |
| POST | /api/v1/posts | 创建文章 |
| PUT | /api/v1/posts/:id | 更新文章 |
| DELETE | /api/v1/posts/:id | 删除文章 |

### 分类管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/categories | 分类列表 (树形) |
| POST | /api/v1/categories | 创建分类 |
| PUT | /api/v1/categories/:id | 更新分类 |
| DELETE | /api/v1/categories/:id | 删除分类 |

### 媒体库

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/media | 媒体文件列表 |
| POST | /api/v1/media/upload | 上传文件 |
| PUT | /api/v1/media/:id | 更新媒体信息 |
| DELETE | /api/v1/media/:id | 删除媒体文件 |

### 页面管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/pages | 页面列表 |
| POST | /api/v1/pages | 创建页面 |
| PUT | /api/v1/pages/:id | 更新页面 |
| PUT | /api/v1/pages/:id/components | 更新页面组件配置 |

---

## 部署指南

### 生产环境部署 (Windows Server)

#### 1. 环境准备

```powershell
# 创建目录
mkdir D:\cms
cd D:\cms

# 克隆代码
git clone <repository-url> .
```

#### 2. 后端部署

```powershell
cd backend

# 创建虚拟环境
python -m venv venv
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量 (复制并修改)
copy .env.example .env

# 初始化数据库
flask db upgrade
python init_data.py
```

#### 3. 前端构建

```powershell
cd frontend

# 安装依赖
npm install

# 生产构建
npm run build
```

#### 4. Nginx配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 强制HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 静态资源
    location /static/ {
        alias D:/cms/backend/app/static/;
        expires 30d;
    }

    location /media/ {
        alias D:/cms/backend/media/;
        expires 30d;
    }

    # 前端页面
    location / {
        root D:/cms/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5. 启动服务

使用 Waitress 启动 (Windows友好):

```powershell
cd D:\cms\backend
venv\Scripts\activate
waitress-serve --host=127.0.0.1 --port=5000 run:app
```

或使用 NSSM 注册为 Windows 服务:

```powershell
# 下载 NSSM: https://nssm.cc/download

nssm install CMSApp "D:\cms\backend\venv\Scripts\python.exe"
nssm set CMSApp AppDirectory "D:\cms\backend"
nssm set CMSApp AppParameters "run.py"
nssm set CMSApp DisplayName "CMS Flask Application"
nssm start CMSApp
```

---

## 技术架构

```
┌─────────────────────────────────────────────────────┐
│                  用户浏览器                           │
│           (Chrome/Firefox/Safari/Edge)              │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│              Nginx (反向代理)                         │
│        - 静态资源服务                                 │
│        - HTTPS终止                                   │
│        - Gzip压缩                                    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           Flask应用服务器 (Waitress)                  │
│        - RESTful API                                │
│        - 业务逻辑处理                                 │
│        - 权限控制                                     │
└──────────┬──────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────┐
│  SQLite3数据库                                       │
│  - 业务数据                                          │
│  - 用户信息                                          │
│  - 配置信息                                          │
└─────────────────────────────────────────────────────┘
```

---

## 安全特性

- **JWT认证** - Token有效期2小时，支持自动刷新
- **密码加密** - bcrypt加密存储
- **XSS防护** - 输入过滤、输出转义
- **CSRF防护** - Token验证、SameSite Cookie
- **SQL注入防护** - ORM参数化查询
- **文件上传安全** - 类型白名单、大小限制、文件名随机化

---

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS 13+
- Android 8+

---

## 开发规范

- **Python**: 遵循 PEP 8 规范
- **JavaScript/TypeScript**: 使用 ESLint 配置
- **Git提交**: 清晰的 commit message
- **代码审查**: 关键代码互相 review

---

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 联系方式

- **项目文档**: 详见 `docs/` 目录
- **技术支持**: support@example.com
- **问题反馈**: 提交 GitHub Issue

---

**项目周期**: 2026 年 2 月 4 日 ~ 2 月 12 日  
**当前版本**: v1.6.0  
**技术栈**: Python Flask + React + SQLite3 + Nginx + Windows Server

## 版本历史

### v1.6.0 (2026-03-18)
- ✅ 项目目录结构扁平化迁移，将 backend/ 和 frontend/ 提升到根目录
- ✅ 消除 company_cms_project/ 中间层目录
- ✅ 修复 Flask-SQLAlchemy SQLite 路径解析问题
- ✅ 更新所有部署脚本和项目文档路径引用

### v1.5.1 (2026-03-17)
- ✅ 容器子组件新增"文章列表"选项
- ✅ 文章列表分类筛选改为下拉选择器
- ✅ 文章列表标签筛选改为下拉选择器
- ✅ 支持搜索过滤、清空选择功能

### v1.5.0 (2026-03-17)
- ✅ 页面编辑器容器嵌套功能，支持 2 层嵌套深度
- ✅ 嵌套容器编辑面板，展开/折叠编辑体验
- ✅ 容器子组件统一高度配置（80px ~ 400px）
- ✅ 图片组件宽高比配置（1:1、4:3、16:9、3:4）
- ✅ 动态选项过滤，防止过度嵌套

### v1.4.1 (2026-03-16)
- ✅ 横幅大图按钮组件完善：图标、样式、链接全面支持
- ✅ 新增按钮幽灵模式，默认开启适合背景图场景
- ✅ 新增按钮链接跳转功能（首页/站内页面/外部链接）
- ✅ 内容对齐联动，按钮随标题位置自动调整
- ✅ 配置面板分组展示，条件显示优化

### v1.4.0 (2026-03-16)
- ✅ 按钮组件全面升级：32种图标、5种类型、自定义颜色
- ✅ 新增按钮布局配置：对齐方式、宽度模式、内边距
- ✅ 新增站内页面选择器，支持搜索过滤
- ✅ 新增"新窗口打开"开关
- ✅ 配置面板分组展示，提升用户体验
- ✅ 完善 TypeScript 类型定义

### v1.3.1 (2026-03-17)
- ✅ 修复媒体库上传 401 认证失败问题
- ✅ 新增 Token 过期友好提示，自动跳转登录页
- ✅ 扩展文件类型支持：JFIF、BMP、ICO、SVG、MP4、WebM、PDF
- ✅ 使用 customRequest 动态获取 token，解决认证问题

### v1.3.0 (2026-03-16)
- ✅ 修复文章作者显示为 "???" 的问题
- ✅ 修复数据库中用户 display_name 无效值
- ✅ 优化 Post.to_dict() 方法，添加防护逻辑
- ✅ 增强代码健壮性，处理作者不存在等边界情况

### v1.2.0 (2026-03-16)
- ✅ 横幅大图组件新增背景图片配置功能
- ✅ 支持媒体库选择、上传、URL 三种图片来源
- ✅ 实现 4 种背景填充模式（Cover/Contain/Fill/Repeat）
- ✅ 实现 5 个位置选项（居中/顶部/底部/左侧/右侧）
- ✅ 按钮组件新增链接类型支持（首页/站内页面/外部链接）
- ✅ 优化编辑器 UI，条件表单动态显示
- ✅ 完善 TypeScript 类型定义

### v1.1.0 (2026-03-03)
- ✅ 新增自定义菜单页面支持
- ✅ 实现动态路由匹配机制
- ✅ 完善解决方案、成功案例、关于我们页面的拖拽编辑功能
- ✅ 添加预设页面模板
- ✅ 优化前台页面空内容时的用户体验
- ✅ 增强页面编辑器功能

### v1.0.0 (2026-02-12)
- ✅ MVP功能完成
- ✅ 用户认证与权限管理
- ✅ 文章管理与分类系统
- ✅ 媒体库管理
- ✅ 可视化拖拽页面编辑器
- ✅ 响应式前台展示
