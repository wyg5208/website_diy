# 企业网站CMS系统详细需求文档

**版本**: 2.0  
**日期**: 2026年2月3日  
**技术栈**: Python Flask + Nginx + Windows Server  

---

## 一、项目概述

### 1.1 项目背景
为满足企业形象展示需求，开发一套功能完善、易于维护的企业官网内容管理系统(CMS)，支持可视化拖拽配置，降低技术门槛，提升网站管理效率。系统采用轻量级架构，部署于Windows Server环境，适合中小企业快速搭建和运维。

### 1.2 项目目标
- 实现企业官网的快速搭建和灵活配置
- 提供直观的可视化编辑体验，支持拖拽式组件布局
- 支持多终端适配(PC、平板、手机)和SEO优化
- 确保系统安全性、高性能和可扩展性
- 降低技术门槛，非技术人员可独立完成网站内容更新
- 支持多站点管理，一套系统管理多个企业站点

### 1.3 技术架构概览

#### 架构模式
- **前后端分离架构**: 前端使用React/Vue，后端提供RESTful API
- **混合模式支持**: 支持纯HTML模板渲染(Jinja2)和SPA单页应用两种模式

#### 系统组成
```
┌─────────────────────────────────────────────────────┐
│                  用户浏览器                           │
│           (Chrome/Firefox/Safari/Edge)              │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│              Nginx (反向代理)                         │
│        - 静态资源服务                                 │
│        - 负载均衡                                     │
│        - HTTPS终止                                   │
│        - Gzip压缩                                    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           Flask应用服务器 (Gunicorn)                  │
│        - RESTful API                                │
│        - 模板渲染                                     │
│        - 业务逻辑处理                                 │
│        - 权限控制                                     │
└──────────┬───────────────────┬──────────────────────┘
           │                   │
┌──────────▼─────┐    ┌────────▼──────────┐
│  MySQL数据库    │    │   Redis缓存       │
│  - 业务数据     │    │   - Session      │
│  - 用户信息     │    │   - 页面缓存      │
│  - 配置信息     │    │   - Token        │
└────────────────┘    └──────────────────┘
```

---

## 二、功能需求详细说明

### 2.1 前端可视化编辑模块

#### 2.1.1 拖拽布局配置系统

**核心功能**:
1. **页面布局组件库**
   - 预置10+种布局模板
     - 单栏布局(适合文章页)
     - 双栏布局(左侧边栏+主内容)
     - 三栏布局(左右侧边栏+主内容)
     - 网格布局(2×2, 3×3等)
     - F型布局(首页常用)
     - 卡片流式布局
   - 支持自定义栅格系统(12栏/24栏)
   - 响应式断点设置(xs/sm/md/lg/xl)

2. **组件拖拽系统**
   - **拖拽操作**:
     - 从组件面板拖入新组件
     - 组件在页面内拖动排序
     - 跨容器拖拽
     - 组件复制/删除
   - **拖拽反馈**:
     - 实时显示可放置区域
     - 高亮显示目标位置
     - 拖拽过程中显示组件预览
   - **技术实现**: 
     - React: react-dnd / dnd-kit
     - Vue: Sortable.js / vue-draggable

3. **实时预览功能**
   - 编辑模式与预览模式无缝切换
   - 多设备预览(桌面/平板/手机)
   - 预览时隐藏编辑工具栏
   - 支持全屏预览

4. **响应式布局**
   - 可为不同屏幕尺寸设置不同布局
   - 组件在不同断点的显示/隐藏控制
   - 移动端优先设计

#### 2.1.2 内容组件库

**基础组件**:

1. **文本编辑器组件**
   - **富文本编辑器**: Quill.js / TinyMCE
   - **支持功能**:
     - 文字格式化(粗体、斜体、下划线、颜色)
     - 段落样式(标题、列表、引用)
     - 图片/视频插入
     - 代码块
     - 表格编辑
     - 超链接管理
   - **配置项**:
     - 字体大小、行高、对齐方式
     - 文本颜色、背景色
     - 最大字符数限制

2. **图片组件**
   - **轮播图组件**:
     - 支持3-10张图片轮播
     - 切换效果(淡入淡出、滑动、3D翻转)
     - 自动播放间隔设置
     - 指示器样式(圆点、缩略图、数字)
     - 支持图片链接跳转
   - **画廊组件**:
     - 瀑布流布局
     - 网格布局
     - 灯箱效果
     - 图片懒加载
   - **单图展示**:
     - 响应式图片
     - 图片裁剪/缩放模式
     - 图片描述/水印

3. **视频组件**
   - 支持视频平台:
     - 本地视频上传(MP4/WebM)
     - YouTube嵌入
     - 优酷/腾讯视频嵌入
   - 播放器配置:
     - 自动播放、循环播放
     - 控制条样式
     - 封面图设置
     - 字幕支持

4. **表单组件**
   - **联系表单**:
     - 字段类型: 文本、邮箱、电话、下拉、多选、日期
     - 表单验证(必填、格式、长度)
     - 自定义提交成功提示
     - 邮件通知功能
   - **预约表单**:
     - 日期时间选择器
     - 可用时段设置
     - 预约状态管理
   - **问卷调查**:
     - 单选题、多选题、简答题
     - 问卷结果统计

5. **导航组件**
   - **顶部导航**:
     - 横向/纵向布局
     - 多级菜单(最多3级)
     - 下拉菜单动画
     - 当前页高亮
   - **面包屑导航**:
     - 自动生成路径
     - 自定义分隔符
   - **侧边导航**:
     - 固定/跟随滚动
     - 折叠/展开功能

6. **社交媒体组件**
   - 社交图标链接(微信、微博、抖音、LinkedIn等)
   - 分享按钮(分享到微信、QQ、微博)
   - 社交媒体信息流嵌入

**高级组件**:

7. **Tab标签页组件**
   - 多标签页切换
   - 标签样式自定义
   - 默认激活标签设置

8. **折叠面板组件**
   - 手风琴效果
   - 多个面板同时展开
   - 展开/折叠动画

9. **统计数字组件**
   - 数字滚动动画
   - 前缀/后缀符号
   - 图标配置

10. **时间轴组件**
    - 垂直/水平时间轴
    - 时间节点样式
    - 事件描述

11. **团队成员组件**
    - 成员卡片布局
    - 头像、姓名、职位、简介
    - 社交链接

12. **客户案例/合作伙伴组件**
    - Logo墙展示
    - 案例详情页链接
    - 分类筛选

#### 2.1.3 组件通用配置

**样式配置**:
- 边距设置(margin/padding)
- 背景设置(颜色/图片/渐变)
- 边框设置(样式/颜色/圆角)
- 阴影效果
- 动画效果(淡入、滑入、缩放)

**显示配置**:
- 显示/隐藏
- 响应式显示控制
- 条件显示(基于用户登录状态等)

**高级配置**:
- 自定义CSS类名
- 自定义HTML属性
- 锚点ID设置

---

### 2.2 后台管理模块

#### 2.2.1 用户权限管理系统

**角色体系**:
1. **超级管理员(Super Admin)**
   - 所有权限
   - 用户管理
   - 系统配置
   - 数据备份/恢复

2. **管理员(Admin)**
   - 内容管理(增删改查)
   - 媒体库管理
   - 页面发布
   - 用户管理(除超级管理员)

3. **编辑(Editor)**
   - 内容编辑
   - 媒体上传
   - 页面编辑(需审核)

4. **作者(Author)**
   - 创建文章
   - 编辑自己的内容
   - 上传媒体

5. **访客(Viewer)**
   - 仅查看权限
   - 导出数据

**权限粒度**:
- 模块级权限(页面管理、文章管理等)
- 操作级权限(创建、读取、更新、删除)
- 数据级权限(只能操作自己的数据)

**技术实现**:
- 基于Flask-Security / Flask-Principal
- RBAC(基于角色的访问控制)模型
- 装饰器方式的权限验证
- 数据库表结构:
  ```
  users (用户表)
  roles (角色表)
  permissions (权限表)
  user_roles (用户角色关联)
  role_permissions (角色权限关联)
  ```

**用户管理功能**:
- 用户注册(可开启/关闭)
- 邮箱/手机号验证
- 密码强度要求配置
- 密码加密(bcrypt/pbkdf2)
- 密码重置(邮件链接)
- 登录日志记录
- 多设备登录管理
- 账号锁定机制(登录失败超过N次)

#### 2.2.2 内容管理系统

**文章管理**:
1. **文章列表**
   - 列表视图/卡片视图切换
   - 筛选: 状态、分类、标签、作者、日期
   - 排序: 发布时间、更新时间、浏览量
   - 批量操作: 删除、修改状态、移动分类
   - 搜索: 标题、内容、作者

2. **文章编辑器**
   - 标题输入
   - 富文本编辑器
   - 特色图片上传
   - 文章摘要
   - 分类/标签选择
   - SEO设置(URL别名、Meta描述、关键词)
   - 发布设置:
     - 草稿/待审核/已发布
     - 定时发布
     - 置顶文章
     - 允许评论开关
   - 自定义字段(扩展字段)
   - 版本历史/恢复

3. **分类管理**
   - 树形分类结构(无限层级)
   - 分类排序
   - 分类别名(slug)
   - 分类描述
   - 分类图标/图片

4. **标签管理**
   - 标签云展示
   - 标签合并
   - 标签使用统计

**页面管理**:
1. **页面列表**
   - 页面树形结构
   - 拖拽排序
   - 快速编辑
   - 页面预览

2. **页面编辑器**
   - 可视化拖拽编辑器
   - 页面模板选择
   - 页面设置:
     - URL路径
     - 父级页面
     - 页面状态(草稿/发布/私密)
     - 访问权限(公开/登录可见)
   - 页面SEO设置

3. **模板系统**
   - 首页模板
   - 文章列表模板
   - 文章详情模板
   - 单页模板
   - 自定义模板

**媒体库管理**:
1. **文件上传**
   - 支持格式:
     - 图片: JPG, PNG, GIF, SVG, WebP
     - 视频: MP4, WebM, MOV
     - 文档: PDF, DOC, DOCX, XLS, XLSX
   - 拖拽上传
   - 批量上传
   - 粘贴上传(截图)
   - 文件大小限制(可配置)
   - 图片自动压缩

2. **媒体管理**
   - 列表视图/网格视图
   - 文件夹组织
   - 文件筛选(类型、日期、尺寸)
   - 文件搜索
   - 图片编辑:
     - 裁剪
     - 旋转
     - 缩放
     - 滤镜
   - 文件信息编辑(标题、描述、ALT文本)

3. **存储管理**
   - 本地存储
   - 云存储支持:
     - 阿里云OSS
     - 腾讯云COS
     - 七牛云
   - 存储空间统计
   - 未使用文件清理

#### 2.2.3 系统配置

**网站基本设置**:
- 网站名称
- 网站Logo/Favicon
- 网站描述
- 联系方式(电话、邮箱、地址)
- 社交媒体链接
- 版权信息
- ICP备案号

**SEO配置**:
- 默认Meta标题模板
- 默认Meta描述模板
- 默认关键词
- Google Analytics ID
- 百度统计代码
- 自定义头部代码(<head>)
- 自定义底部代码(</body>前)

**URL配置**:
- URL重写规则
- 固定链接格式:
  - /post/{id}
  - /post/{slug}
  - /{year}/{month}/{slug}
- 分页URL格式

**邮件配置**:
- SMTP服务器设置
- 发件人邮箱
- 邮件模板管理
- 测试邮件发送

**安全设置**:
- HTTPS强制跳转
- CORS配置
- API访问频率限制
- IP黑名单/白名单
- 文件上传安全规则

**性能配置**:
- 缓存开关
- 缓存过期时间
- 静态资源CDN地址
- 图片压缩质量
- 懒加载开关

**备份管理**:
- 自动备份设置:
  - 备份频率(每日/每周)
  - 备份时间
  - 保留备份数量
- 手动备份
- 备份下载
- 备份恢复
- 备份到云存储

---

### 2.3 核心功能模块

#### 2.3.1 多语言支持

**功能实现**:
1. **语言切换**
   - 前端语言切换组件
   - URL语言参数(/zh/, /en/)
   - Cookie记住语言偏好
   - 浏览器语言自动检测

2. **内容多语言管理**
   - 文章多语言版本
   - 页面多语言版本
   - 语言版本关联
   - 未翻译内容提示

3. **界面多语言**
   - 后台界面中英文
   - 前端界面语言包
   - 自定义翻译管理

**技术实现**:
- Flask-Babel (国际化)
- 数据库表设计:
  ```
  posts (主表)
  post_translations (翻译表)
  - post_id
  - language_code
  - title
  - content
  ```

#### 2.3.2 SEO优化系统

**URL优化**:
- 友好URL结构(去除?id=)
- 自动生成slug(中文转拼音)
- 自定义URL别名
- URL重定向管理(301/302)
- 规范链接(Canonical URL)

**Meta标签管理**:
- 每页独立设置Title/Description/Keywords
- Open Graph标签(社交分享)
- Twitter Card标签
- 自动生成Meta标签(基于内容)

**Sitemap生成**:
- 自动生成XML Sitemap
- Sitemap优先级设置
- 更新频率设置
- 提交到搜索引擎

**其他SEO功能**:
- Robots.txt编辑
- 404页面自定义
- 301重定向管理
- 面包屑导航
- 图片ALT标签自动填充
- 内链建议
- 外链nofollow设置

#### 2.3.3 性能优化

**缓存策略**:
1. **页面缓存**
   - 全页面缓存(Redis)
   - 缓存预热
   - 缓存失效策略
   - 登录用户不缓存

2. **数据缓存**
   - 数据库查询结果缓存
   - API响应缓存
   - 缓存Key命名规范

3. **静态资源缓存**
   - 浏览器缓存(Expires/Cache-Control)
   - 版本号/哈希值更新策略

**资源优化**:
- 图片懒加载(Intersection Observer)
- 响应式图片(srcset)
- WebP格式支持
- CSS/JS压缩合并
- 关键CSS内联
- 异步加载非关键资源

**数据库优化**:
- 索引优化
- 查询优化(避免N+1)
- 连接池配置
- 慢查询日志

**CDN配置**:
- 静态资源CDN加速
- CDN域名配置
- CDN缓存刷新

---

## 三、技术架构详细设计

### 3.1 技术栈确认

#### 3.1.1 后端技术栈

**核心框架**:
- **Python**: 3.9+
- **Flask**: 2.3+
  - Flask-SQLAlchemy: ORM
  - Flask-Migrate: 数据库迁移
  - Flask-Login: 用户认证
  - Flask-WTF: 表单验证
  - Flask-CORS: 跨域支持
  - Flask-RESTful: API开发
  - Flask-Caching: 缓存
  - Flask-Babel: 国际化

**数据库**:
- **SQLite3**: 3.35+ (主数据库)
  - 单文件数据库，零配置
  - 支持ACID事务
  - 适合中小型网站(< 100万条记录)
  - 简化部署和备份
- **Redis**: 6.0+ (可选，用于缓存和Session)
  - 仅在高并发需求时使用
  - 可用文件缓存替代

**WSGI服务器**:
- **Gunicorn** 或 **Waitress**(Windows友好)
  - 多worker进程
  - 异步worker(gevent)

**文件存储**:
- 本地存储(Windows文件系统)
- 可选云存储(OSS SDK)

**其他依赖**:
- Pillow: 图片处理
- PyJWT: JWT Token
- python-dotenv: 环境变量
- requests: HTTP客户端
- celery: 异步任务(可选)

#### 3.1.2 前端技术栈

**选项一: React技术栈**
- **React**: 18+
- **TypeScript**: 5+
- **构建工具**: Vite
- **UI组件库**: Ant Design 5
- **状态管理**: Redux Toolkit / Zustand
- **路由**: React Router 6
- **拖拽**: dnd-kit / react-beautiful-dnd
- **富文本**: Quill / TinyMCE
- **HTTP客户端**: Axios
- **表单**: React Hook Form
- **图标**: Ant Design Icons

**选项二: Vue技术栈**
- **Vue**: 3+
- **TypeScript**: 5+
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **拖拽**: vue-draggable-plus
- **富文本**: Quill / TinyMCE
- **HTTP客户端**: Axios
- **表单**: VeeValidate
- **图标**: Element Plus Icons

**选项三: 纯HTML模板**(适合简单后台)
- **模板引擎**: Jinja2(Flask内置)
- **UI框架**: Bootstrap 5 / Tailwind CSS
- **JavaScript**: jQuery / Vanilla JS
- **组件**: Alpine.js(轻量级)

#### 3.1.3 部署环境

**操作系统**: Windows Server 2019/2022

**Web服务器**: Nginx 1.24+
- 反向代理配置
- 静态文件服务
- Gzip压缩
- SSL/TLS配置
- 负载均衡(可选)

**Python运行环境**:
- 虚拟环境(venv)
- pip包管理
- 环境变量配置

**进程管理**:
- **NSSM**(Non-Sucking Service Manager)
  - 将Gunicorn注册为Windows服务
  - 开机自启动
  - 崩溃自动重启

**数据库**:
- SQLite3数据库文件(无需服务)
- Redis服务(可选，仅高并发时使用)

**监控工具**:
- 日志: logging模块 + RotatingFileHandler
- 性能监控: Flask-Profiler(可选)
- 错误追踪: Sentry(可选)

### 3.2 数据库设计

#### 3.2.0 SQLite3选型说明

**为什么选择SQLite3？**

对于企业官网CMS系统，SQLite3是更优选择，理由如下：

1. **场景适配性**
   - 网站以静态内容为主
   - 内容更新频率低（每周/每月更新）
   - 预计数据量：< 10万条记录
   - 并发读取：< 100用户同时访问
   - 写入频率：低（主要是管理员偶尔更新）

2. **技术优势**
   - **零配置**：无需安装数据库服务，单个文件即可
   - **简化部署**：随应用一起部署，无需单独维护数据库服务
   - **轻松备份**：直接复制.db文件即可完成备份
   - **高性能读取**：对于读多写少的场景，性能优异
   - **ACID支持**：完整的事务支持，数据安全可靠
   - **跨平台**：Python内置支持，无需额外安装

3. **运维优势**
   - 无需DBA维护
   - 减少服务器资源占用
   - 降低系统复杂度
   - 备份恢复简单直观

4. **性能指标**
   - 支持100,000+条记录
   - 读取性能：每秒数千次查询
   - 适合并发读取，少量写入的场景
   - 单个数据库文件可达281TB

**何时考虑升级到MySQL？**

如果出现以下情况，可考虑迁移：
- 日均访问量 > 10万PV
- 并发写入频繁（多个编辑同时操作）
- 数据量 > 100万条
- 需要复杂的分布式部署
- 需要主从复制、读写分离

**数据库文件组织**
```
D:/cms/data/
├── cms.db          # 主数据库文件
├── backups/        # 备份目录
│   ├── cms_20260203.db
│   └── cms_20260202.db
└── logs/           # SQLite日志
```

#### 3.2.1 核心数据表

**用户与权限表**:
```sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(64),
    avatar VARCHAR(255),
    status TINYINT DEFAULT 1 COMMENT '1:正常 0:禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME,
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- 角色表
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 权限表
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) UNIQUE NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(255),
    module VARCHAR(64) COMMENT '所属模块'
);

-- 角色权限关联表
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

**内容管理表**:
```sql
-- 文章/页面表
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(20) NOT NULL COMMENT 'post/page',
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content LONGTEXT,
    excerpt TEXT,
    featured_image VARCHAR(255),
    author_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' COMMENT 'draft/published/private',
    comment_status TINYINT DEFAULT 1,
    is_sticky TINYINT DEFAULT 0,
    view_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    parent_id INT DEFAULT 0,
    template VARCHAR(64),
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_type_status (type, status),
    INDEX idx_slug (slug),
    INDEX idx_published_at (published_at)
    -- SQLite不支持FULLTEXT，可使用FTS5虚拟表
);

-- 分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    parent_id INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    icon VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id)
);

-- 文章分类关联表
CREATE TABLE post_categories (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 标签表
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 文章标签关联表
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

**媒体库表**:
```sql
CREATE TABLE media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    mime_type VARCHAR(100),
    file_size INT,
    width INT,
    height INT,
    title VARCHAR(255),
    alt_text VARCHAR(255),
    description TEXT,
    folder_id INT DEFAULT 0,
    uploader_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id),
    INDEX idx_mime_type (mime_type),
    INDEX idx_folder_id (folder_id)
);
```

**页面配置表**:
```sql
-- 页面组件配置
CREATE TABLE page_components (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_id INT NOT NULL,
    component_type VARCHAR(64) NOT NULL,
    component_data JSON,
    sort_order INT DEFAULT 0,
    parent_id INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_page_id (page_id)
);

-- 站点配置表
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'text',
    description VARCHAR(255),
    group_name VARCHAR(64),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**多语言表**:
```sql
CREATE TABLE post_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    content LONGTEXT,
    excerpt TEXT,
    slug VARCHAR(255),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_lang (post_id, language_code)
);
```

**SQLite3全文搜索解决方案**

由于SQLite不支持FULLTEXT索引，可使用FTS5虚拟表：

```sql
-- 创建FTS5虚拟表用于全文搜索
CREATE VIRTUAL TABLE posts_fts USING fts5(
    title, 
    content,
    content=posts,
    content_rowid=id
);

-- 创建触发器保持同步
CREATE TRIGGER posts_ai AFTER INSERT ON posts BEGIN
    INSERT INTO posts_fts(rowid, title, content)
    VALUES (new.id, new.title, new.content);
END;

CREATE TRIGGER posts_ad AFTER DELETE ON posts BEGIN
    DELETE FROM posts_fts WHERE rowid = old.id;
END;

CREATE TRIGGER posts_au AFTER UPDATE ON posts BEGIN
    UPDATE posts_fts SET title = new.title, content = new.content
    WHERE rowid = new.id;
END;

-- 全文搜索查询示例
SELECT posts.* FROM posts 
JOIN posts_fts ON posts.id = posts_fts.rowid 
WHERE posts_fts MATCH '关键词';
```

### 3.3 API接口设计

#### 3.3.1 接口规范

**基础规范**:
- 协议: HTTPS
- 格式: JSON
- 编码: UTF-8
- API前缀: `/api/v1/`
- 认证方式: JWT Token (Header: `Authorization: Bearer <token>`)

**请求格式**:
```json
{
  "data": {},
  "meta": {
    "request_id": "uuid"
  }
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "meta": {
    "timestamp": 1234567890,
    "request_id": "uuid"
  }
}
```

**HTTP状态码**:
- 200: 成功
- 201: 创建成功
- 204: 删除成功
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

**分页格式**:
```json
{
  "code": 200,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

#### 3.3.2 核心接口列表

**认证接口**:
```
POST   /api/v1/auth/login           登录
POST   /api/v1/auth/logout          登出
POST   /api/v1/auth/register        注册
POST   /api/v1/auth/refresh         刷新Token
POST   /api/v1/auth/forgot-password 忘记密码
POST   /api/v1/auth/reset-password  重置密码
GET    /api/v1/auth/me              当前用户信息
```

**用户管理接口**:
```
GET    /api/v1/users                用户列表
GET    /api/v1/users/:id            用户详情
POST   /api/v1/users                创建用户
PUT    /api/v1/users/:id            更新用户
DELETE /api/v1/users/:id            删除用户
PUT    /api/v1/users/:id/roles      分配角色
```

**文章管理接口**:
```
GET    /api/v1/posts                文章列表(支持筛选)
GET    /api/v1/posts/:id            文章详情
POST   /api/v1/posts                创建文章
PUT    /api/v1/posts/:id            更新文章
DELETE /api/v1/posts/:id            删除文章
POST   /api/v1/posts/bulk-delete    批量删除
PUT    /api/v1/posts/:id/status     修改状态
```

**页面管理接口**:
```
GET    /api/v1/pages                页面列表
GET    /api/v1/pages/:id            页面详情
POST   /api/v1/pages                创建页面
PUT    /api/v1/pages/:id            更新页面
DELETE /api/v1/pages/:id            删除页面
GET    /api/v1/pages/:id/components 页面组件配置
PUT    /api/v1/pages/:id/components 更新组件配置
```

**分类标签接口**:
```
GET    /api/v1/categories           分类列表(树形)
POST   /api/v1/categories           创建分类
PUT    /api/v1/categories/:id       更新分类
DELETE /api/v1/categories/:id       删除分类

GET    /api/v1/tags                 标签列表
POST   /api/v1/tags                 创建标签
PUT    /api/v1/tags/:id             更新标签
DELETE /api/v1/tags/:id             删除标签
```

**媒体库接口**:
```
GET    /api/v1/media                媒体列表
GET    /api/v1/media/:id            媒体详情
POST   /api/v1/media/upload         上传文件
POST   /api/v1/media/bulk-upload    批量上传
PUT    /api/v1/media/:id            更新媒体信息
DELETE /api/v1/media/:id            删除媒体
```

**系统配置接口**:
```
GET    /api/v1/settings             所有配置
GET    /api/v1/settings/:group      分组配置
PUT    /api/v1/settings             更新配置
POST   /api/v1/backup               创建备份
GET    /api/v1/backup               备份列表
POST   /api/v1/backup/:id/restore   恢复备份
```

### 3.4 安全设计

#### 3.4.1 认证与授权

**JWT Token机制**:
- Access Token: 有效期2小时
- Refresh Token: 有效期7天
- Token存储: LocalStorage/Cookie
- Token刷新机制

**密码安全**:
- bcrypt加密(cost=12)
- 密码强度要求: 8位以上,包含字母数字
- 密码历史记录(防止重复使用)
- 登录失败锁定(5次失败锁定30分钟)

**会话管理**:
- Session存储在Redis
- 单点登录/多点登录可配置
- 异常登录检测(IP/设备变化)

#### 3.4.2 数据安全

**SQL注入防护**:
- ORM参数化查询
- 输入验证
- 避免动态SQL

**XSS防护**:
- 输入过滤
- 输出转义(Jinja2自动转义)
- CSP(Content Security Policy)头

**CSRF防护**:
- Flask-WTF CSRF Token
- SameSite Cookie
- 双重提交Cookie

**文件上传安全**:
- 文件类型白名单
- 文件大小限制
- 文件名随机化
- 病毒扫描(可选)
- 存储路径限制

**数据传输安全**:
- HTTPS强制跳转
- HSTS头
- 敏感数据加密

#### 3.4.3 API安全

**访问频率限制**:
- Flask-Limiter
- 基于IP限流
- 基于用户限流
- 不同接口不同限制

**API密钥管理**:
- 第三方服务API Key加密存储
- 环境变量管理
- 定期轮换

### 3.5 部署配置

#### 3.5.1 Nginx配置示例

**nginx.conf**:
```nginx
http {
    upstream flask_app {
        server 127.0.0.1:8000;
        # 负载均衡(可选)
        # server 127.0.0.1:8001;
    }

    server {
        listen 80;
        server_name example.com;
        
        # 强制HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name example.com;

        # SSL证书配置
        ssl_certificate /path/to/cert.pem;
        ssl_certificate_key /path/to/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # 日志
        access_log C:/logs/nginx/access.log;
        error_log C:/logs/nginx/error.log;

        # 客户端最大上传大小
        client_max_body_size 50M;

        # Gzip压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

        # 静态文件
        location /static/ {
            alias C:/cms/static/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        location /media/ {
            alias C:/cms/media/;
            expires 30d;
        }

        # 前端页面(SPA)
        location / {
            root C:/cms/frontend/dist;
            try_files $uri $uri/ /index.html;
        }

        # API代理
        location /api/ {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket支持(如需要)
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # 后台管理(如果使用纯HTML)
        location /admin/ {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### 3.5.2 Flask应用配置

**config.py**:
```python
import os
from datetime import timedelta

class Config:
    # 基础配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = False
    TESTING = False
    
    # 数据库配置
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///D:/cms/data/cms.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    # SQLite不需要连接池配置
    
    # Redis配置
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # 缓存配置
    CACHE_TYPE = 'redis'
    CACHE_REDIS_URL = REDIS_URL
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Session配置
    SESSION_TYPE = 'redis'
    SESSION_REDIS = 'redis://localhost:6379/1'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # JWT配置
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    
    # 文件上传
    UPLOAD_FOLDER = 'D:/cms/media'
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'mp4', 'pdf'}
    
    # 邮件配置
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    
    # 分页
    POSTS_PER_PAGE = 20
    
    # CORS
    CORS_ORIGINS = ['http://localhost:3000', 'https://example.com']

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    pass

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

**requirements.txt**:
```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-Login==0.6.2
Flask-WTF==1.1.1
Flask-CORS==4.0.0
Flask-RESTful==0.3.10
Flask-Caching==2.0.2
Flask-Babel==3.1.0
Flask-JWT-Extended==4.5.2
redis==5.0.0  # 可选，高并发时使用
Pillow==10.0.0
bcrypt==4.0.1
python-dotenv==1.0.0
waitress==2.1.2  # Windows友好的WSGI服务器
requests==2.31.0
```

#### 3.5.3 Windows服务配置

**使用NSSM注册服务**:
```powershell
# 下载NSSM
# https://nssm.cc/download

# 安装Flask服务
nssm install CMSFlaskApp "D:\cms\venv\Scripts\gunicorn.exe"
nssm set CMSFlaskApp AppDirectory "D:\cms"
nssm set CMSFlaskApp AppParameters "-w 4 -b 127.0.0.1:8000 --access-logfile D:\cms\logs\access.log --error-logfile D:\cms\logs\error.log wsgi:app"
nssm set CMSFlaskApp DisplayName "CMS Flask Application"
nssm set CMSFlaskApp Description "企业CMS系统后端服务"
nssm set CMSFlaskApp Start SERVICE_AUTO_START

# 启动服务
nssm start CMSFlaskApp

# 查看状态
nssm status CMSFlaskApp
```

**环境变量配置(.env)**:
```
FLASK_ENV=production
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///D:/cms/data/cms.db
REDIS_URL=redis://localhost:6379/0  # 可选
MAIL_SERVER=smtp.example.com
MAIL_USERNAME=noreply@example.com
MAIL_PASSWORD=your-mail-password
```

---

## 四、非功能需求详细说明

### 4.1 性能要求

**响应时间**:
- 首页加载: < 2秒
- 内页加载: < 3秒
- API响应: < 500ms
- 数据库查询: < 100ms
- 文件上传: 10MB/s

**并发性能**:
- 并发用户: 1000+
- QPS(每秒查询): 500+
- 数据库连接池: 50

**资源占用**:
- 内存使用: < 2GB
- CPU使用: < 70%
- 磁盘IO: < 80%

### 4.2 安全要求

**防护措施**:
- XSS防护: 输入过滤+输出转义
- CSRF防护: Token验证
- SQL注入防护: ORM参数化
- 文件上传防护: 类型检查+大小限制
- DDoS防护: 限流+CDN
- 密码强度: 8位以上,复杂度检查

**审计日志**:
- 用户登录日志
- 操作审计日志
- 错误日志
- 安全事件日志

**数据加密**:
- 传输加密: HTTPS/TLS 1.2+
- 密码加密: bcrypt
- 敏感数据加密: AES-256

### 4.3 可用性要求

**系统可用性**: 99.9% (每月宕机时间 < 43分钟)

**备份策略**:
- 数据库备份: 每日全量备份
- 文件备份: 每日增量备份
- 备份保留: 30天
- 异地备份: 云存储

**容灾恢复**:
- RTO(恢复时间目标): < 30分钟
- RPO(恢复点目标): < 1小时
- 备份恢复测试: 每月1次

**监控告警**:
- 服务状态监控
- 性能指标监控
- 错误率监控
- 磁盘空间监控
- 告警通知: 邮件/短信

### 4.4 兼容性要求

**浏览器兼容**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**移动端兼容**:
- iOS 13+
- Android 8+
- 响应式设计(320px ~ 1920px)

**分辨率支持**:
- 手机: 375×667 ~ 414×896
- 平板: 768×1024 ~ 1024×768
- 桌面: 1366×768 ~ 1920×1080

### 4.5 可维护性要求

**代码规范**:
- Python: PEP 8
- JavaScript: ESLint
- 代码注释覆盖率: > 30%
- 函数复杂度: < 10

**文档要求**:
- API文档(Swagger)
- 数据库设计文档
- 部署运维文档
- 用户操作手册

**版本控制**:
- Git分支管理(Git Flow)
- 代码审查(Pull Request)
- 版本标签(Semantic Versioning)

---

## 五、项目实施计划

### 5.0 项目时间线

**项目周期**: 2026年2月4日 ~ 2月12日  
**开发时间**: 8天  
**交付日期**: 2026年2月12日

**时间分配**:
| 阶段 | 时间 | 工作日 | 说明 |
|------|------|--------|------|
| 需求设计 | 2月4日 | 1天 | 架构设计、环境搭建 |
| 后端开发 | 2月5日-2月7日 | 3天 | 核心API和后台管理 |
| 前端开发 | 2月8日-2月9日 | 2天 | 管理后台界面 |
| 可视化编辑器 | 2月10日 | 1天 | 简化版拖拽编辑器 |
| 测试部署 | 2月11日 | 1天 | 测试、修复、部署 |
| 交付培训 | 2月12日 | 1天 | 验收、培训、文档 |

**MVP功能范围**:

鉴于8天的紧凑周期，本项目采用**MVP(最小可行产品)**策略:

**必须实现**:
- ✅ 用户登录/权限管理
- ✅ 文章管理(CRUD)
- ✅ 分类管理
- ✅ 媒体库(图片上传)
- ✅ 简化版可视化编辑器(3-5个核心组件)
- ✅ 前台展示页面
- ✅ 基础SEO功能

**V2版本延后**:
- ⏸ 高级组件(轮播图、Tab等)
- ⏸ 多语言支持
- ⏸ 复杂权限控制
- ⏸ 数据统计图表
- ⏸ 高级SEO功能

### 5.1 项目阶段

#### 阶段一: 架构设计与环境搭建 (1天 - 2月4日)
**目标**: 完成项目初始化和核心架构设计

**上午任务** (9:00-12:00):
- [ ] 团队会议,确认MVP功能范围
- [ ] 技术方案评审
- [ ] 任务分工明确
- [ ] 安装Python 3.9+, 创建虚拟环境
- [ ] 安装依赖包(Flask, SQLAlchemy等)
- [ ] Git仓库初始化
- [ ] IDE配置(VSCode/PyCharm)
- [ ] 前端环境(Node.js, npm/yarn)

**下午任务** (14:00-18:00):
- [ ] Flask应用结构设计(蓝图模式)
- [ ] 配置文件设计(config.py)
- [ ] 数据库初始化(SQLite3)
- [ ] 日志系统配置
- [ ] 设计核心数据表(用户、文章、分类、媒体)
- [ ] 编写SQLAlchemy模型
- [ ] 初始化数据库表结构
- [ ] 创建测试数据

**交付物**:
- ✅ 可运行的Flask应用
- ✅ SQLite数据库文件
- ✅ 数据模型完成
- ✅ 项目基础框架

#### 阶段二: 后端核心API开发 (3天 - 2月5日至2月7日)

**第2天 (2月5日) - 认证系统和文章API**:

**上午任务** (9:00-12:00):
- [ ] JWT Token生成和验证
- [ ] 用户注册接口
- [ ] 用户登录接口
- [ ] Token刷新接口
- [ ] 密码加密(bcrypt)
- [ ] 权限装饰器(@login_required)

**下午任务** (14:00-18:00):
- [ ] 文章列表接口(分页、筛选)
- [ ] 文章详情接口
- [ ] 创建文章接口
- [ ] 更新文章接口
- [ ] 删除文章接口
- [ ] 分类列表(树形结构)
- [ ] 创建/更新/删除分类
- [ ] 使用Postman测试所有接口

**交付物**:
- ✅ 认证系统完成
- ✅ 文章和分类API完成
- ✅ Postman测试集合

---

**第3天 (2月6日) - 媒体库与页面管理API**:

**上午任务** (9:00-12:00):
- [ ] 文件上传接口(支持图片)
- [ ] 图片压缩和缩略图生成(Pillow)
- [ ] 文件类型验证
- [ ] 媒体列表接口
- [ ] 文件删除接口
- [ ] 文件信息更新(标题、描述)

**下午任务** (14:00-18:00):
- [ ] 页面CRUD接口
- [ ] 页面组件配置(JSON存储)
- [ ] 页面状态管理(草稿/发布)
- [ ] 网站基本信息设置
- [ ] SEO配置接口
- [ ] 接口性能测试
- [ ] 错误处理完善

**交付物**:
- ✅ 媒体库功能完成
- ✅ 页面管理API完成
- ✅ 所有后端API完成80%

---

**第4天 (2月7日) - 后端收尾与前端启动**:

**上午任务 - 后端团队** (9:00-12:00):
- [ ] 数据验证优化(表单验证)
- [ ] API限流配置(Flask-Limiter)
- [ ] 缓存配置(可选)
- [ ] 接口文档完善(Swagger)
- [ ] 单元测试补充

**下午任务 - 前端团队** (14:00-18:00):
- [ ] React/Vue项目创建(Vite)
- [ ] UI框架集成(Ant Design/Element Plus)
- [ ] 路由配置(React Router/Vue Router)
- [ ] HTTP客户端配置(Axios)
- [ ] 全局状态管理(Redux/Pinia)
- [ ] 布局框架(管理后台布局)

**交付物**:
- ✅ 后端API全部完成
- ✅ 前端框架搭建完成
- ✅ 登录页面完成

#### 阶段三: 管理后台界面开发 (2天 - 2月8日至2月9日)

**第5天 (2月8日) - 核心管理页面(上)**:

**上午任务** (9:00-12:00):
- [ ] 登录页面UI
- [ ] JWT Token存储和自动刷新
- [ ] 路由守卫(权限验证)
- [ ] 管理后台布局(顶部导航+侧边栏)
- [ ] 首页仪表盘(基础数据统计)

**下午任务** (14:00-18:00):
- [ ] 文章列表页(表格展示、搜索筛选、分页、批量操作)
- [ ] 文章编辑页(表单设计、富文本编辑器集成)
- [ ] 分类选择组件
- [ ] 图片上传组件
- [ ] 保存/发布功能

**交付物**:
- ✅ 登录功能完成
- ✅ 文章管理页面完成

---

**第6天 (2月9日) - 管理后台界面(下)**:

**上午任务** (9:00-12:00):
- [ ] 媒体列表(网格视图)
- [ ] 文件上传组件(拖拽上传)
- [ ] 图片预览功能
- [ ] 文件信息编辑
- [ ] 批量删除功能

**下午任务** (14:00-18:00):
- [ ] 分类列表(树形展示)
- [ ] 添加/编辑分类
- [ ] 拖拽排序
- [ ] 网站基本信息表单
- [ ] SEO设置表单
- [ ] 响应式适配
- [ ] 加载状态优化
- [ ] 错误提示优化

**交付物**:
- ✅ 所有管理后台页面完成
- ✅ UI交互流畅

#### 阶段四: 可视化编辑器与前台展示 (1天 - 2月10日)

**第7天 (2月10日) - 简化版编辑器和前台**:

**上午任务** (9:00-12:00) - 简化版可视化编辑器:
- [ ] 拖拽系统集成(react-dnd-kit)
- [ ] 组件面板(左侧)
- [ ] 画布区域(中间)
- [ ] 属性配置面板(右侧)
- [ ] 5个核心组件开发:
  - 文本组件(标题、段落)
  - 图片组件(单图展示)
  - 容器组件(基础布局)
  - 按钮组件(CTA按钮)
  - 表单组件(联系表单)
- [ ] 组件添加/删除功能
- [ ] 样式配置(边距、颜色)
- [ ] 保存配置到JSON

**下午任务** (14:00-18:00) - 前台展示页面:
- [ ] 首页模板
- [ ] 文章列表页
- [ ] 文章详情页
- [ ] 单页面渲染(根据JSON配置)
- [ ] 导航菜单
- [ ] 基础样式
- [ ] 响应式设计(移动端适配)
- [ ] SEO友好(Meta标签)

**技术简化说明**:
- 使用成熟的拖拽库
- 组件配置用JSON存储
- 不做复杂的嵌套和响应式
- 只实现5个基础组件

**交付物**:
- ✅ 可视化编辑器基础版完成
- ✅ 前台展示页面完成

#### 阶段五: 测试、修复与部署 (1天 - 2月11日)

**第8天 (2月11日) - 全面测试与生产部署**:

**上午任务** (9:00-12:00) - 功能测试:
- [ ] 用户注册登录测试
- [ ] 文章CRUD完整流程测试
- [ ] 媒体上传测试
- [ ] 可视化编辑器测试
- [ ] 前台展示测试
- [ ] 权限测试
- [ ] Chrome浏览器测试
- [ ] Firefox浏览器测试
- [ ] 移动端测试(响应式)

**下午任务** (14:00-18:00) - Bug修复与部署:
- [ ] 修复测试发现的问题
- [ ] 性能优化
- [ ] 代码清理
- [ ] Windows Server配置
- [ ] SQLite3数据库文件初始化
- [ ] Nginx配置
- [ ] Flask服务配置(NSSM/Waitress)
- [ ] SSL证书配置
- [ ] 前端构建和部署

**交付物**:
- ✅ 所有功能测试通过
- ✅ 系统部署到生产环境
- ✅ 系统正常运行

#### 阶段六: 交付与培训 (1天 - 2月12日)

**第9天 (2月12日) - 项目验收、培训和交付**:

**上午任务** (9:00-12:00):
- [ ] 功能演示
- [ ] 性能测试报告
- [ ] 安全检查
- [ ] 验收测试
- [ ] 管理员培训(30分钟)
  - 系统登录
  - 用户管理
  - 系统配置
  - 数据备份
- [ ] 编辑人员培训(30分钟)
  - 文章创建和发布
  - 媒体上传管理
  - 页面编辑器使用
  - 常见问题处理

**下午任务** (14:00-18:00) - 文档编写:
- [ ] 用户操作手册(1小时)
  - 登录指南
  - 功能使用说明
  - 常见问题FAQ
- [ ] 技术文档(1小时)
  - 系统架构说明
  - API接口文档
  - 数据库设计文档
- [ ] 运维文档(1小时)
  - 部署指南
  - 备份恢复流程
  - 故障排查指南
  - 系统监控
- [ ] 项目总结
  - 交付物检查清单
  - 已知问题列表
  - 后续优化建议
  - 项目复盘会议

**交付物**:
- ✅ 完整的CMS系统
- ✅ 操作手册和技术文档
- ✅ 培训完成
- ✅ 项目正式交付



### 5.2 关键里程碑

| 里程碑 | 日期 | 验收标准 |
|--------|------|----------|
| M1: 架构搭建完成 | 2月4日 18:00 | ✅ Flask项目可运行<br>✅ 数据库表创建完成 |
| M2: 后端API完成 | 2月6日 18:00 | ✅ 所有核心API开发完成<br>✅ Postman测试通过 |
| M3: 前端框架搭建 | 2月7日 18:00 | ✅ 前端项目可运行<br>✅ 登录页面完成 |
| M4: 管理后台完成 | 2月9日 18:00 | ✅ 所有管理页面完成<br>✅ 功能可正常使用 |
| M5: 编辑器和前台完成 | 2月10日 18:00 | ✅ 可视化编辑器可用<br>✅ 前台页面展示正常 |
| M6: 测试部署完成 | 2月11日 18:00 | ✅ 系统部署成功<br>✅ 测试通过 |
| M7: 项目交付 | 2月12日 18:00 | ✅ 用户验收通过<br>✅ 文档齐全 |

### 5.3 团队配置建议

**最小团队(3人)**:
- 全栈工程师 × 2 (负责后端+前端)
- 测试/部署工程师 × 1 (兼职)

**理想团队(4人)**:
- 后端工程师 × 2 (Python/Flask)
- 前端工程师 × 1 (React/Vue)
- 测试工程师 × 1

**工作量估算**:
- 项目周期: 8天(2月4日-2月12日)
- 工作模式: 每天上午9:00-12:00, 下午14:00-18:00
- 总工时: 约240-320小时(根据团队规模)

---

## 六、验收标准

### 6.1 功能验收标准

**MVP必须实现的功能** (8天周期):
- [x] 用户登录和权限管理 ✅
- [x] 文章管理(增删改查) ✅
- [x] 分类管理 ✅
- [x] 媒体库(图片上传) ✅
- [x] 简化版可视化编辑器(5个核心组件) ✅
- [x] 前台展示页面 ✅
- [x] 基础SEO功能 ✅

**V2版本延后的功能**:
- [ ] 高级组件(轮播图、Tab等)
- [ ] 多语言支持(中英文)
- [ ] 复杂权限控制
- [ ] 数据统计图表
- [ ] 高级SEO功能
- [ ] 数据备份恢复界面

**功能测试用例通过率**: ≥ 90% (MVP版本)

### 6.2 性能验收标准

- [ ] 页面加载时间 < 3秒
- [ ] API响应时间 < 500ms
- [ ] 图片上传速度正常(< 5秒/5MB)
- [ ] 支持至少10个并发用户 (MVP阶段)
- [ ] SQLite读取性能正常

### 6.3 安全验收标准

- [x] 通过XSS安全测试
- [x] 通过CSRF安全测试
- [x] 通过SQL注入测试
- [x] 文件上传安全验证
- [x] HTTPS强制跳转
- [x] 密码加密存储

### 6.4 兼容性验收标准

- [x] Chrome浏览器正常运行
- [x] Firefox浏览器正常运行
- [x] Safari浏览器正常运行
- [x] Edge浏览器正常运行
- [x] 移动端响应式适配
- [x] 支持1366×768及以上分辨率

### 6.5 文档验收标准

- [x] 需求规格说明书
- [x] 系统设计文档
- [x] 数据库设计文档
- [x] API接口文档(Swagger)
- [x] 部署运维文档
- [x] 用户操作手册
- [x] 代码注释覆盖率 > 30%

---

## 七、风险管理

### 7.1 技术风险

**风险1: Windows Server环境兼容性问题**
- 影响: 中
- 概率: 低
- 应对措施: 
  - 使用Waitress替代Gunicorn(Windows友好)
  - 提前在Windows环境测试
  - 准备Docker容器化方案作为备选

**风险2: 拖拽编辑器性能问题**
- 影响: 高
- 概率: 中
- 应对措施:
  - 使用虚拟滚动优化长列表
  - 组件懒加载
  - 限制单页组件数量
  - 性能监控和优化

**风险3: 数据库性能瓶颈**
- 影响: 高
- 概率: 中
- 应对措施:
  - 合理设计索引
  - 查询优化
  - Redis缓存
  - 数据库读写分离(如需要)

### 7.2 项目风险

**风险4: 需求变更频繁**
- 影响: 高
- 概率: 中
- 应对措施:
  - 需求评审严格把关
  - 变更流程控制
  - 预留20%缓冲时间

**风险5: 人员变动**
- 影响: 高
- 概率: 低
- 应对措施:
  - 代码规范和文档完善
  - 知识共享和培训
  - 关键角色备份

### 7.3 安全风险

**风险6: 数据泄露**
- 影响: 高
- 概率: 低
- 应对措施:
  - 安全开发培训
  - 代码安全审计
  - 渗透测试
  - 日志监控

---

## 八、成本预算

### 8.1 开发成本

**人力成本** (按16周计算):
- 项目经理: 16周
- 后端工程师×2: 32周
- 前端工程师×2: 32周
- UI设计师: 8周
- 测试工程师: 4周

### 8.2 软硬件成本

**服务器**(第一年):
- Windows Server 2022许可: ¥5,000
- 服务器硬件/云服务器: ¥8,000/年 (由于SQLite降低配置需求)
- SSL证书: ¥1,000/年
- 域名: ¥100/年
- 备份存储: ¥1,000/年 (数据库文件备份更简单)

**软件许可**:
- SQLite3: 免费（公有领域）
- Redis: 免费（开源，可选）
- Nginx: 免费（开源）
- Python/Flask: 免费（开源）

**第三方服务**:
- 云存储(OSS): ¥1,000/年 (可选)
- 邮件服务: ¥500/年
- CDN加速: ¥2,000/年 (可选)

**合计**: 约¥15,600/年 (相比MySQL方案节省约¥6,000/年)

---

## 九、附录

### 9.1 技术术语表

| 术语 | 说明 |
|------|------|
| CMS | Content Management System,内容管理系统 |
| SPA | Single Page Application,单页应用 |
| ORM | Object Relational Mapping,对象关系映射 |
| JWT | JSON Web Token,JSON网络令牌 |
| RBAC | Role-Based Access Control,基于角色的访问控制 |
| CSRF | Cross-Site Request Forgery,跨站请求伪造 |
| XSS | Cross-Site Scripting,跨站脚本攻击 |
| SEO | Search Engine Optimization,搜索引擎优化 |
| CDN | Content Delivery Network,内容分发网络 |
| SSL/TLS | 安全套接字层/传输层安全 |

### 9.2 参考资料

**官方文档**:
- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/
- Vue: https://vuejs.org/
- Nginx: https://nginx.org/en/docs/
- MySQL: https://dev.mysql.com/doc/

**相关技术**:
- Flask-SQLAlchemy: https://flask-sqlalchemy.palletsprojects.com/
- Ant Design: https://ant.design/
- Element Plus: https://element-plus.org/
- Quill.js: https://quilljs.com/

### 9.3 联系方式

**项目支持**:
- 技术支持邮箱: support@example.com
- 紧急联系电话: 400-xxx-xxxx
- 工作时间: 工作日 9:00-18:00

---

## 十、更新记录

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| 1.0 | 2026-02-01 | 初稿 | - |
| 2.0 | 2026-02-03 | 详细需求文档,明确技术栈 | - |

---

**文档说明**:
- 本文档为企业网站CMS系统的详细需求文档
- 技术栈: Python Flask + Nginx + Windows Server
- 前端可选: React/Vue/纯HTML
- 建议在项目启动前进行详细的技术评审
- 具体细节可在开发过程中根据实际情况调整

**审批流程**:
- [ ] 需求方确认
- [ ] 技术负责人审核
- [ ] 项目经理批准
- [ ] 开发团队评审

---

**END**