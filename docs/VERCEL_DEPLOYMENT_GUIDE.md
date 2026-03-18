# Vercel 部署指南

## 项目架构说明

本项目是前后端分离架构:
- **前端**: React + Vite + TypeScript (位于 `frontend/`)
- **后端**: Flask + Python (位于 `backend/`)

## 部署方案

### 方案一：前端部署到 Vercel + 后端部署到其他平台 (推荐)

#### 1. 前端部署到 Vercel

**步骤 1: 准备前端代码**

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 构建测试
npm run build
```

**步骤 2: 配置环境变量**

在 Vercel 项目设置中添加环境变量:
- `VITE_API_URL`: 后端 API 地址 (如 `https://your-app.railway.app`)

**步骤 3: 推送到 GitHub**

```bash
# 在项目根目录初始化 git (如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库 (替换为你的 GitHub 仓库 URL)
git remote add origin https://github.com/yourusername/company-cms.git

# 推送
git push origin main
```

**步骤 4: 在 Vercel 部署**

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 配置项目设置:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量 `VITE_API_URL`
6. 点击 "Deploy"

#### 2. 后端部署到 Render (推荐免费方案)

**步骤 1: 准备后端代码**

创建 `render.yaml`:

```yaml
services:
  - type: web
    name: company-cms-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn run:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: SECRET_KEY
        generateValue: true
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: cms-db
          property: connectionString

databases:
  - name: cms-db
    databaseName: company_cms
```

创建 `requirements.txt` (如果还没有):

```bash
pip freeze > requirements.txt
# 确保包含: Flask, flask-sqlalchemy, flask-migrate, gunicorn, python-dotenv
```

**步骤 2: 在 Render 部署**

1. 访问 [render.com](https://render.com)
2. 注册账号并创建 "New Web Service"
3. 连接你的 GitHub 仓库
4. 配置:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
5. 添加环境变量
6. 创建 PostgreSQL 数据库
7. 点击 "Create Web Service"

**步骤 3: 数据库迁移**

在 Render 的 SSH 控制台执行:
```bash
flask db upgrade
flask create_admin
```

---

#### 2. 后端部署到 Railway (付费方案)

**注意**: Railway 从 2023 年起已取消免费套餐，需付费使用。

**步骤 1: 准备后端代码**

创建 `Procfile`:

```bash
# backend/Procfile
web: gunicorn run:app
```

创建 `.railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn run:app",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**步骤 2: 在 Railway 部署**

1. 访问 [railway.app](https://railway.app)
2. 创建新项目，选择 "Deploy from GitHub repo"
3. 选择你的仓库
4. 设置环境变量:
   - `FLASK_ENV`: production
   - `SECRET_KEY`: 生成一个随机密钥
   - `JWT_SECRET_KEY`: 生成一个随机密钥
   - `DATABASE_URL`: Railway 会自动提供 PostgreSQL URL
5. Railway 会自动检测 Python 项目并部署

**步骤 3: 数据库迁移**

```bash
# 在 Railway 的命令行中执行
flask db upgrade
```

**步骤 4: 创建管理员账户**

```bash
flask create_admin
```

**Railway 费用说明:**
- 基础费用: $5/月
- 使用量另计 (约 $0.20/小时)
- 适合预算充足的生产环境

### 方案二：仅部署前端静态网站

如果你只需要展示静态页面，不需要后台管理功能:

1. 直接部署前端到 Vercel
2. 将 API 请求改为模拟数据或第三方 API

## 环境变量配置

### 前端环境变量 (.env.production)

```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 后端环境变量

```env
FLASK_ENV=production
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-secret
DATABASE_URL=postgresql://user:password@host:port/database
UPLOAD_FOLDER=/tmp/media
MAX_CONTENT_LENGTH=52428800
```

## 注意事项

1. **CORS 配置**: 确保后端 CORS 配置允许 Vercel 域名访问
2. **数据库**: 生产环境建议使用 PostgreSQL 而不是 SQLite
3. **文件上传**: 生产环境需要使用对象存储 (如 AWS S3、阿里云 OSS)
4. **HTTPS**: Vercel 默认提供 HTTPS
5. **自定义域名**: 可在 Vercel 绑定自定义域名

## 本地测试生产构建

```bash
cd frontend
npm run build
npm run preview
```

## 故障排查

### 前端构建失败

检查 Node.js 版本是否兼容:
```bash
node --version  # 建议使用 18.x 或更高版本
npm --version
```

### API 请求失败

1. 检查后端服务是否正常运行
2. 检查 CORS 配置
3. 检查环境变量是否正确配置
4. 检查网络请求是否被浏览器拦截 (混合内容问题)

## 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Railway 文档](https://docs.railway.app)
- [Flask 部署指南](https://flask.palletsprojects.com/en/stable/deploying/)
