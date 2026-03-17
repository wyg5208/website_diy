# 🚀 Render 部署 - 3 分钟快速启动

## 前置要求

确保已安装:
- ✅ Python 3.9+
- ✅ Git
- ✅ GitHub 账号
- ✅ Render 账号 (免费注册)

---

## 超简单 3 步部署

### 第 1 步：运行一键部署脚本 ⏱️ 1 分钟

在项目根目录，双击运行:

```
deploy_to_render.bat
```

**脚本会自动完成:**
- ✅ 检查所有依赖
- ✅ 初始化 Git
- ✅ 提交所有部署文件
- ✅ 准备推送到 GitHub

按照提示:
1. 输入提交信息 (或直接回车使用默认)
2. 输入你的 GitHub 仓库 URL (如还没有，先跳过)
3. 确认推送 (输入 `y`)

---

### 第 2 步：在 Render 创建服务 ⏱️ 2 分钟

#### A. 访问 Render
打开浏览器，访问：[https://render.com](https://render.com)

#### B. 登录/注册
- 使用 GitHub 账号快速登录
- 或邮箱注册 (免费)

#### C. 创建 Web Service
1. 点击右上角 **"New +"**
2. 选择 **"Web Service"**
3. 点击 **"Connect a repository"**
4. 选择你的 `company-cms` 仓库

#### D. 填写配置

**基础配置:**
```
Name: company-cms-backend
Region: Oregon (俄勒冈)
Branch: main
Root Directory: company_cms_project/backend
Build Command: pip install -r requirements.txt
Start Command: gunicorn run:app
```

**选择套餐:**
- 测试：选 **Free** (会休眠)
- 生产：选 **Starter** ($7/月，不休眠)

**添加环境变量:**
点击 "Advanced" -> "Add Environment Variable":
```
FLASK_ENV=production
SECRET_KEY=<点击生成随机字符串>
JWT_SECRET_KEY=<点击生成随机字符串>
UPLOAD_FOLDER=/tmp/media
MAX_CONTENT_LENGTH=52428800
```

#### E. 创建数据库
Render 会自动检测 `render.yaml` 并询问是否创建数据库
- 点击 **"Yes, create database"**

#### F. 开始部署
点击 **"Create Web Service"**

等待 3-5 分钟，看到绿色 ✅ 表示部署成功!

---

### 第 3 步：数据库迁移 ⏱️ 30 秒

在服务页面:

1. 点击 **"Shell"** 标签
2. 等待连接成功
3. 依次执行:

```bash
flask db upgrade
flask create_admin
```

按提示输入管理员信息:
```
用户名：admin
邮箱：admin@example.com
密码：****** (输入时不显示)
```

---

## 🎉 完成!

你的后端已经部署成功!

### 获取 API 地址

在服务页面找到 URL，格式类似:
```
https://company-cms-backend.onrender.com
```

### 下一步：部署前端到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 登录并导入 GitHub 仓库
3. Root Directory: `company_cms_project/frontend`
4. 添加环境变量:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api/v1
   ```
5. 点击 Deploy

---

## ✅ 验证部署

### 测试后端

浏览器访问:
```
https://your-backend.onrender.com/api/health
```

看到以下响应表示成功:
```json
{
  "status": "ok",
  "message": "CMS Backend is running"
}
```

### 测试前端

访问 Vercel 提供的域名，测试登录功能。

---

## 💡 常见问题

### Q: Free 套餐会休眠吗?
A: 是的，15 分钟无访问自动休眠。首次访问需要等待 10-30 秒唤醒。

### Q: 如何避免休眠?
A: 升级到 Starter 套餐 ($7/月),或使用 UptimeRobot 每 5 分钟 ping 一次。

### Q: 数据库 90 天后收费吗?
A: 是的，90 天后 PostgreSQL 收费 $7/月。可以选择删除重建或使用外部数据库。

### Q: 可以只部署前端吗?
A: 可以!如果只需要展示页面，可以把 API 调用改为静态数据。

---

## 📊 费用说明

| 服务 | 套餐 | 价格 |
|------|------|------|
| Vercel | Hobby (前端) | ¥0/月 |
| Render | Free (后端) | ¥0/月 |
| PostgreSQL | Free (90 天) | ¥0/月 |

**总计**: **¥0/月** (前 90 天测试版)

如需生产环境:
- Render Starter: ¥50/月
- PostgreSQL: ¥50/月
- **总计**: **¥100/月**

---

## 🔗 有用的链接

- [完整部署文档](DEPLOYMENT_FILES_SUMMARY.md)
- [详细指南](README_RENDER.md)
- [Render 官方文档](https://render.com/docs)
- [Vercel 部署指南](../VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🆘 需要帮助?

如果遇到问题:

1. 查看 Render Logs (日志标签页)
2. 阅读故障排查章节
3. 检查环境变量是否正确
4. 确保数据库已创建并迁移

---

**祝你部署顺利! 🎉**

有任何问题都可以查看我们的详细文档或联系支持。
