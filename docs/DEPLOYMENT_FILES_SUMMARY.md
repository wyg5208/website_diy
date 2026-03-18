# Render 部署 - 完整文件清单

## ✅ 已创建的所有部署文件

### 🎯 核心配置文件

#### 1. `render.yaml` (后端)
**位置**: `backend/render.yaml`

**作用**: Render 平台的主要配置文件，定义服务、数据库和环境变量

**内容**:
- Web 服务配置 (Free 套餐)
- PostgreSQL 数据库配置
- 环境变量自动注入
- 健康检查路径

---

#### 2. `Procfile` (后端)
**位置**: `backend/Procfile`

**作用**: 定义应用启动命令

**内容**:
```
web: gunicorn run:app
```

---

#### 3. `requirements.txt` (后端) - 已更新
**位置**: `backend/requirements.txt`

**新增**: 
```
gunicorn==21.2.0  # WSGI 服务器，用于生产环境
```

---

### 🔧 部署脚本

#### 4. `prepare_render.bat` (后端)
**位置**: `backend/prepare_render.bat`

**作用**: Windows 下的准备脚本，检查和配置所有部署依赖

**功能**:
- ✅ 检查 Python 版本
- ✅ 验证依赖文件
- ✅ 安装 Python 包
- ✅ 检查数据库迁移
- ✅ 创建 .gitignore
- ✅ 提供下一步指引

---

#### 5. `prepare_render.sh` (后端)
**位置**: `backend/prepare_render.sh`

**作用**: Linux/Mac 下的准备脚本 (功能同上)

---

#### 6. `deploy_to_render.bat` (项目根目录)
**位置**: `deploy_to_render.bat`

**作用**: 一键部署脚本，自动化整个流程

**功能**:
1. 运行 prepare_render.bat
2. 初始化 Git 仓库
3. 添加并提交所有文件
4. 推送到 GitHub
5. 显示详细的后续步骤指引

---

### 📖 文档

#### 7. `README_RENDER.md` (后端)
**位置**: `backend/README_RENDER.md`

**内容**:
- 快速部署指南
- 手动部署步骤
- 环境变量配置
- 数据库迁移说明
- 常见问题解决
- 费用说明
- 验证方法

---

### 🔄 代码修改

#### 8. `run.py` (后端) - 已修改
**位置**: `backend/run.py`

**新增**:
```python
@app.route('/api/health')
def health_check():
    """健康检查接口 - 用于 Render 等平台的健康检查"""
    return {
        'status': 'ok',
        'message': 'CMS Backend is running',
        'timestamp': __import__('datetime').datetime.utcnow().isoformat()
    }
```

**作用**: Render 健康检查端点

---

#### 9. `request.ts` (前端) - 已修改
**位置**: `frontend/src/utils/request.ts`

**修改**:
```typescript
baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/v1'
```

**作用**: 支持环境变量配置 API 地址

---

#### 10. `vercel.json` (前端) - 已创建
**位置**: `frontend/vercel.json`

**作用**: Vercel 配置文件，包含 API 代理规则

---

#### 11. `.env.example` (前端) - 已创建
**位置**: `frontend/.env.example`

**作用**: 环境变量示例文件

---

## 🚀 如何使用

### 方法一：一键部署 (最简单)

```bash
# 在项目根目录执行
deploy_to_render.bat
```

然后按照提示操作即可!

---

### 方法二：手动部署

#### 步骤 1: 准备后端

```bash
cd backend
prepare_render.bat
```

#### 步骤 2: 提交到 GitHub

```bash
cd ../..
git init
git add .
git commit -m "Add Render deployment config"
git remote add origin https://github.com/你的用户名/company-cms.git
git push -u origin main
```

#### 步骤 3: 在 Render 部署

1. 访问 [render.com](https://render.com)
2. 登录并创建 "New Web Service"
3. 连接 GitHub 仓库
4. 配置:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
5. 添加环境变量
6. 点击 "Create Web Service"

#### 步骤 4: 数据库迁移

在 Render Shell 中执行:
```bash
flask db upgrade
flask create_admin
```

#### 步骤 5: 部署前端到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. 添加环境变量:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api/v1
   ```
5. 点击 "Deploy"

---

## 📊 部署架构

```
┌─────────────────┐
│   Vercel CDN    │ ← 前端 (React + Vite)
│  (全球加速)     │
└────────┬────────┘
         │
         │ HTTPS
         │
         ▼
┌─────────────────┐
│    Render       │ ← 后端 (Flask + Gunicorn)
│  (自动扩展)     │
└────────┬────────┘
         │
         │ 内部连接
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ ← 数据库 (托管)
│   (Render DB)   │
└─────────────────┘
```

---

## 💰 费用明细

| 服务 | 套餐 | 功能 | 价格 |
|------|------|------|------|
| **Vercel** | Hobby | 无限流量、自动 HTTPS | ¥0/月 |
| **Render** | Free | 750 小时/月、会休眠 | ¥0/月 |
| **Render** | Starter | 不休眠、更多资源 | ¥50/月 |
| **PostgreSQL** | Free | 前 90 天免费 | ¥0/月 (前 90 天) |
| **PostgreSQL** | Standard | 生产数据库 | ¥50/月 (90 天后) |

**总计**:
- **开发测试**: ¥0/月 (使用免费版)
- **生产环境**: ¥100/月 (Starter + 数据库)

---

## ✅ 检查清单

部署前确认:

- [ ] Python 3.9+ 已安装
- [ ] Node.js 18+ 已安装
- [ ] Git 已安装并配置
- [ ] GitHub 账号已注册
- [ ] Render 账号已注册
- [ ] Vercel 账号已注册
- [ ] 所有依赖已安装 (`pip install`, `npm install`)
- [ ] 本地测试通过

---

## 🎯 部署后验证

### 1. 测试后端健康检查

```bash
curl https://your-backend.onrender.com/api/health
```

预期响应:
```json
{
  "status": "ok",
  "message": "CMS Backend is running",
  "timestamp": "2026-03-13T..."
}
```

### 2. 测试前端

访问 Vercel 部署的 URL，测试:
- [ ] 页面加载正常
- [ ] 可以登录
- [ ] 可以访问后台管理
- [ ] 文章列表正常
- [ ] 媒体库上传正常

### 3. 测试 API 集成

- [ ] 前端能正确调用后端 API
- [ ] Token 认证正常
- [ ] 文件上传正常
- [ ] 数据库读写正常

---

## 🔧 故障排查

### 问题 1: 构建失败

**症状**: Render 构建阶段报错

**解决**:
```bash
cd backend
pip install --upgrade pip
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

### 问题 2: 数据库连接失败

**症状**: 应用启动时报数据库错误

**解决**:
1. 检查 DATABASE_URL 环境变量是否正确
2. 确认数据库已创建
3. 执行迁移：`flask db upgrade`

### 问题 3: CORS 错误

**症状**: 浏览器控制台显示 CORS 错误

**解决**:
更新 `backend/config.py`:
```python
CORS_ORIGINS = [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'  # 添加你的域名
]
```

### 问题 4: 静态文件 404

**症状**: 前端构建后找不到静态资源

**解决**:
确保 Vite 配置正确:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

---

## 📞 获取帮助

如果遇到问题:

1. 查看 Render 日志 (Logs 标签)
2. 查看 Vercel 函数日志 (Functions 标签)
3. 检查浏览器控制台错误
4. 阅读官方文档
5. 查看本文档的故障排查部分

---

## 🎉 完成!

恭喜你完成了整个部署流程!

现在你的 CMS 系统已经运行在云端:
- ✨ 前端：Vercel CDN 加速
- ✨ 后端：Render 自动扩展
- ✨ 数据库：PostgreSQL 托管服务

随时随地访问你的网站吧! 🚀
