#!/bin/bash

# Render 部署准备脚本
# 用于检查和配置后端项目以适配 Render 平台

echo "🚀 Render 部署准备脚本"
echo "====================="
echo ""

# 检查 Python 版本
echo "📌 检查 Python 版本..."
python --version
if [ $? -ne 0 ]; then
    echo "❌ 未检测到 Python，请安装 Python 3.9+"
    exit 1
fi
echo "✅ Python 版本检查通过"
echo ""

# 检查依赖文件
echo "📌 检查 requirements.txt..."
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt 不存在"
    exit 1
fi
echo "✅ requirements.txt 存在"
echo ""

# 检查 render.yaml 配置文件
echo "📌 检查 render.yaml..."
if [ ! -f "render.yaml" ]; then
    echo "⚠️  render.yaml 不存在，将使用默认配置"
else
    echo "✅ render.yaml 存在"
fi
echo ""

# 检查 Procfile
echo "📌 检查 Procfile..."
if [ ! -f "Procfile" ]; then
    echo "❌ Procfile 不存在"
    exit 1
fi
echo "✅ Procfile 存在"
echo ""

# 更新依赖
echo "📦 更新依赖..."
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "⚠️  依赖安装失败，请检查 requirements.txt"
fi
echo ""

# 检查数据库迁移
echo "📌 检查数据库迁移脚本..."
if [ -d "migrations" ]; then
    echo "✅ Flask-Migrate 已配置"
else
    echo "⚠️  migrations 目录不存在"
fi
echo ""

# 检查环境变量文件
echo "📌 检查 .env 文件..."
if [ -f ".env" ]; then
    echo "✅ .env 文件存在"
    echo "⚠️  注意：生产环境请在 Render 后台配置环境变量，不要提交 .env 到 Git"
else
    echo "ℹ️  .env 文件不存在 (生产环境不需要)"
fi
echo ""

# 创建 .gitignore 检查
echo "📌 检查 .gitignore..."
GITIGNORE_CONTENTS="__pycache__
*.pyc
*.pyo
*.db
.env
instance/
logs/
media/
*.egg-info/
dist/
build/
.pytest_cache/
.coverage
*.so
"

if [ ! -f ".gitignore" ]; then
    echo "$GITIGNORE_CONTENTS" > .gitignore
    echo "✅ 已创建 .gitignore"
else
    echo "✅ .gitignore 已存在"
fi
echo ""

# 添加健康检查接口
echo "📌 检查健康检查接口..."
if grep -q "health" run.py; then
    echo "✅ 健康检查接口已存在"
else
    echo "⚠️  建议添加健康检查接口到 run.py:"
    echo ""
    echo "@app.route('/api/health')"
    echo "def health_check():"
    echo "    return {'status': 'ok', 'message': 'Service is running'}"
fi
echo ""

echo "====================="
echo "✅ 部署准备完成!"
echo ""
echo "下一步操作:"
echo "1. 将所有文件提交到 Git 仓库"
echo "2. 在 Render.com 创建新项目"
echo "3. 连接你的 GitHub 仓库"
echo "4. 设置 Root Directory: company_cms_project/backend"
echo "5. Render 会自动识别 render.yaml 并部署"
echo ""
echo "🎉 祝部署顺利!"
