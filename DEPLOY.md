# 灵活用工平台 - 部署指南

## 📦 项目已就绪

本项目已完成开发，包含以下文件：

```
flexible-work-platform/
├── src/                    # 源代码
│   ├── components/         # 组件
│   ├── pages/              # 页面
│   ├── services/           # API 服务
│   ├── types/              # TypeScript 类型
│   ├── App.tsx             # 应用根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 样式
├── dist/                   # 构建产物（已生成）
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── netlify.toml            # Netlify 部署配置
├── vercel.json             # Vercel 部署配置
└── README.md               # 项目文档
```

## 🚀 快速部署（3 种方式）

### 方式一：Netlify Drop（最简单，无需命令行）

1. 访问 https://app.netlify.com/drop
2. 将 `dist` 文件夹拖拽到上传区域
3. 等待部署完成
4. 获得公开访问 URL

**优点**: 无需注册、无需命令行、30 秒上线
**缺点**: 临时部署，需要注册后才能自定义域名

---

### 方式二：Vercel（推荐）

1. 访问 https://vercel.com 并注册/登录

2. 点击 "Add New" → "Project"

3. 选择部署方式：
   
   **A. GitHub 导入**（推荐）
   - 将代码推送到 GitHub
   - 导入仓库
   - 自动部署
   
   **B. Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   cd flexible-work-platform
   vercel
   vercel --prod
   ```

4. 获得公开访问 URL（类似：https://your-project.vercel.app）

**优点**: 自动 HTTPS、全球 CDN、自动部署
**部署时间**: 2-3 分钟

---

### 方式三：Netlify（推荐）

1. 访问 https://app.netlify.com 并注册/登录

2. 点击 "Add new site" → "Deploy manually"

3. 上传 `dist` 文件夹

4. 或连接 GitHub 自动部署

**或使用 CLI:**
```bash
npm install -g netlify-cli
netlify login
cd flexible-work-platform
netlify deploy --prod
```

**优点**:  бесплатные、自动 HTTPS、表单功能
**部署时间**: 2-3 分钟

---

## 📤 推送到 GitHub

如果要使用 CI/CD 自动部署，先创建 GitHub 仓库：

```bash
# 初始化 Git（如未初始化）
cd flexible-work-platform
git init

# 创建 .gitignore
cat > .gitignore << EOF
node_modules
dist
.env
.env.local
.DS_Store
*.log
EOF

# 添加并提交
git add .
git commit -m "Initial commit: 灵活用工平台 MVP"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/flexible-work-platform.git

# 推送
git branch -M main
git push -u origin main
```

然后在 Vercel/Netlify 导入 GitHub 仓库即可自动部署。

## 🌍 获取公开 URL

部署完成后，你会获得类似以下的公开 URL：

- **Vercel**: `https://灵活用工平台 - 你的用户名.vercel.app`
- **Netlify**: `https://灵活用工平台 - 随机字符串.netlify.app`

## ✅ 部署检查清单

- [ ] 项目可以本地构建 (`npm run build`)
- [ ] 构建产物在 `dist` 目录
- [ ] 已选择部署平台（Vercel/Netlify）
- [ ] 已完成部署
- [ ] 测试首页可以访问
- [ ] 测试登录/注册功能
- [ ] 测试任务列表和详情
- [ ] 测试移动端适配
- [ ] 记录公开 URL

## 🔧 配置后端 API

部署后，如果需要连接真实后端 API：

1. 在部署平台设置环境变量：
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables

2. 添加变量：
   ```
   VITE_API_URL=https://你的后端地址.com/api
   ```

3. 重新部署

## 📱 移动端测试

使用 Chrome DevTools 测试移动端：
1. 打开部署后的 URL
2. 按 F12 打开开发者工具
3. 点击设备切换按钮（或按 Ctrl+Shift+M）
4. 选择不同设备测试响应式效果

## 🎯 下一步

1. 获取公开 URL
2. 测试所有功能
3. 分享给团队成员或用户
4. 收集反馈并迭代

---

**开发完成时间**: 2024 年 3 月 20 日  
**部署文档版本**: v1.0