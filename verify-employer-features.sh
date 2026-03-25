#!/bin/bash

# 雇主审核功能验证脚本

echo "🔍 验证雇主审核功能文件..."
echo ""

# 检查文件是否存在
files=(
  "src/pages/EmployerDashboard.tsx"
  "src/pages/ApplicationReviewPage.tsx"
  "src/components/Layout.tsx"
  "src/services/api.ts"
  "src/types/index.ts"
  "src/App.tsx"
)

all_exists=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
    all_exists=false
  fi
done

echo ""

if [ "$all_exists" = true ]; then
  echo "✅ 所有文件都已创建！"
  echo ""
  
  # 检查新增的类型定义
  echo "📋 检查类型定义..."
  if grep -q "EmployerTask" src/types/index.ts; then
    echo "✅ EmployerTask 类型已添加"
  fi
  
  if grep -q "FreelancerProfile" src/types/index.ts; then
    echo "✅ FreelancerProfile 类型已添加"
  fi
  
  # 检查 API 服务
  echo ""
  echo "🔌 检查 API 服务..."
  if grep -q "employerService" src/services/api.ts; then
    echo "✅ employerService 已添加"
  fi
  
  # 检查路由
  echo ""
  echo "🛣️  检查路由配置..."
  if grep -q "employer/dashboard" src/App.tsx; then
    echo "✅ /employer/dashboard 路由已添加"
  fi
  
  if grep -q "employer/applications/:taskId" src/App.tsx; then
    echo "✅ /employer/applications/:taskId 路由已添加"
  fi
  
  # 检查导航
  echo ""
  echo "🧭 检查导航栏..."
  if grep -q "雇主管理" src/components/Layout.tsx; then
    echo "✅ 雇主管理导航链接已添加"
  fi
  
  echo ""
  echo "🎉 验证完成！雇主审核功能已就绪。"
  echo ""
  echo "📝 下一步:"
  echo "   1. 确保后端 API 已实现 (见 EMPLOYER_FEATURES.md)"
  echo "   2. 企业用户登录后访问 /employer/dashboard"
  echo "   3. 测试任务列表和申请审核功能"
else
  echo ""
  echo "❌ 有文件缺失，请检查！"
  exit 1
fi