# Render 快速部署指南

## 🚀 一键部署 (推荐)

### Windows 用户

在项目根目录运行:

```bash
deploy_to_render.bat
```

脚本会自动完成:
1. ✅ 检查并准备所有部署文件
2. ✅ 初始化 Git 仓库
3. ✅ 提交所有文件
4. ✅ 推送到 GitHub

然后按照提示在 Render 控制台操作即可。

---

## 📋 手动部署步骤

### 步骤 1: 准备项目

```bash
# 进入后端目录
cd company_cms_project/backend

# 运行准备脚本
prepare_render.bat  # Windows
# 或
./prepare_render.sh  # Linux/Mac
```

### 步骤 2: 提交到 GitHub

```bash
# 返回项目根目录
cd ../..

# 初始化 Git (如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "Add Render deployment configuration"

# 关联远程仓库 (替换为你的仓库 URL)
git remote add origin https://github.com/你的用户名/company-cms.git

# 推送
git push -u origin main
```

### 步骤 3: 在 Render 部署

1. **访问** [render.com](https://render.com)
2. **登录** (使用 GitHub 账号)
3. **创建服务**: 
   - 点击 "New +" 
   - 选择 "Web Service"
4. **连接仓库**:
   - 选择 "Connect a repository"
   - 选择你的 `company-cms` 仓库
5. **配置服务**:
   ```
   Name: company-cms-backend
   Region: Oregon (推荐)
   Branch: main
   Root Directory: company_cms_project/backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn run:app
   ```
6. **选择套餐**:
   - Free (免费，会休眠)
   - Starter ($7/月，不休眠)
7. **添加环境变量**:
   ```
   FLASK_ENV=production
   SECRET_KEY=<自动生成随机字符串>
   JWT_SECRET_KEY=<自动生成随机字符串>
   UPLOAD_FOLDER=/tmp/media
   MAX_CONTENT_LENGTH=52428800
   ```
8. **创建数据库**:
   - Render 会自动检测 render.yaml
   - 自动创建 PostgreSQL 数据库
9. **点击** "Create Web Service"

### 步骤 4: 数据库迁移

部署完成后，在 Render 控制台:

1. 进入你的服务页面
2. 点击 "Shell" 标签
3. 执行命令:
   ```bash
   flask db upgrade
   flask create_admin
   ```

### 步骤 5: 获取 API 地址

在服务页面找到你的应用 URL，格式类似:
```
https://company-cms-backend.onrender.com
```

这就是你的后端 API 地址!

---

## 🔧 前端 Vercel 部署

### 更新环境变量

在 Vercel 项目设置中添加:

```
VITE_API_URL=https://company-cms-backend.onrender.com/api/v1
```

### 重新部署

```bash
cd company_cms_project/frontend
npm run build
```

Vercel 会自动检测更改并重新部署。

---

## 🎯 验证部署

### 测试后端健康检查

访问:
```
https://your-app.onrender.com/api/health
```

应该返回:
```json
{
  "status": "ok",
  "message": "CMS Backend is running",
  "timestamp": "..."
}
```

### 测试前端

访问 Vercel 部署的 URL，测试登录功能。

---

## ⚠️ 常见问题

### 1. 部署失败：Build Error

**原因**: 依赖安装失败

**解决**:
```bash
cd company_cms_project/backend
pip install --upgrade pip
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

### 2. 数据库错误

**原因**: 数据库未迁移

**解决**: 在 Render Shell 中执行:
```bash
flask db upgrade
```

### 3. CORS 错误

**原因**: 后端未允许 Vercel 域名

**解决**: 更新 `config.py`:
```python
CORS_ORIGINS = [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'  # 添加你的 Vercel 域名
]
```

### 4. 免费实例休眠

**现象**: 首次访问慢 (10-30 秒)

**解决**: 
- 升级到付费套餐 ($7/月)
- 或使用 UptimeRobot 等工具定期 ping 服务

---

## 💰 费用说明

### Render 免费版
- ✅ Web 服务: 750 小时/月
- ✅ PostgreSQL: 免费 90 天
- ⚠️ 限制: 实例会休眠
- 💡 适合: 个人项目、测试

### Render 付费版
- 💵 Starter: $7/月
- ✅ 不休眠
- ✅ 更多资源
- 💡 适合: 生产环境

### 总成本估算
- **前端 (Vercel)**: ¥0/月
- **后端 (Render 免费)**: ¥0/月 (前 90 天)
- **后端 (Render Starter)**: ¥50/月
- **数据库 (90 天后)**: ¥50/月

**合计**: ¥0-100/月

---

## 📝 已创建的部署文件

| 文件 | 位置 | 说明 |
|------|------|------|
| `render.yaml` | `backend/` | Render 配置文件 |
| `Procfile` | `backend/` | 启动进程定义 |
| `requirements.txt` | `backend/` | Python 依赖 (含 gunicorn) |
| `prepare_render.bat` | `backend/` | 准备脚本 (Windows) |
| `prepare_render.sh` | `backend/` | 准备脚本 (Linux/Mac) |
| `deploy_to_render.bat` | 根目录 | 一键部署脚本 |
| `run.py` | `backend/` | 添加了健康检查接口 |

---

## 🔗 相关资源

- [Render 官方文档](https://render.com/docs)
- [Flask 部署指南](https://flask.palletsprojects.com/deploying/)
- [Vercel 部署文档](https://vercel.com/docs)
- [Gunicorn 文档](https://docs.gunicorn.org/)

---

## 🎉 部署成功!

完成以上步骤后，你的 CMS 系统就已经部署到云端了!

**前端**: Vercel (全球 CDN 加速)  
**后端**: Render (自动扩展)  
**数据库**: PostgreSQL (托管服务)

随时随地访问你的网站! 🚀
