#!/bin/bash

# 灵活用工平台 - 自动化部署脚本
# 使用方法：./deploy-vercel.sh

set -e

echo "🚀 开始部署到 Vercel..."

# 进入项目目录
cd "$(dirname "$0")"

# 检查是否已登录 Vercel
if [ ! -f "$HOME/.vercel/auth.json" ]; then
    echo "📝 请先登录 Vercel"
    echo "运行：npx vercel login"
    echo ""
    npx vercel login
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署到 Vercel
echo "📦 部署到 Vercel..."

# 创建或更新项目
npx vercel --yes --name flexible-work-platform

# 部署到生产环境
echo "🌐 部署到生产环境..."
npx vercel --prod --yes

echo ""
echo "✅ 部署完成！"
echo "请查看上面的输出获取访问 URL"