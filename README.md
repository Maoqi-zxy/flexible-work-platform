# 灵活用工平台 - 前端应用

一个现代化的灵活用工任务对接平台，连接企业需求方和自由职业者。

## 🌟 项目演示

**本地预览**: http://localhost:3000

运行以下命令启动本地预览服务器：
```bash
npx serve dist -l 3000
```

## 🛠️ 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **路由**: React Router v7
- **HTTP 客户端**: Axios
- **样式**: Tailwind CSS 4
- **包管理器**: npm

## ✨ 核心功能

### 1. 用户系统
- [x] 用户注册（企业/自由职业者）
- [x] 用户登录（支持快速登录测试）
- [x] 个人中心
- [x] 用户资料管理

### 2. 任务管理
- [x] 任务大厅（列表展示）
- [x] 任务搜索与筛选
- [x] 任务详情页
- [x] 任务发布（企业用户）
- [x] 任务申请（自由职业者）

### 3. 响应式设计
- [x] 移动端适配
- [x] 平板适配
- [x] 桌面端优化

## 📁 项目结构

```
flexible-work-platform/
├── src/
│   ├── components/     # 可复用组件
│   │   └── Layout.tsx  # 布局组件
│   ├── pages/          # 页面组件
│   │   ├── HomePage.tsx        # 首页/任务大厅
│   │   ├── LoginPage.tsx       # 登录页
│   │   ├── RegisterPage.tsx    # 注册页
│   │   ├── TaskDetailPage.tsx  # 任务详情页
│   │   ├── PublishTaskPage.tsx # 任务发布页
│   │   └── ProfilePage.tsx     # 个人中心
│   ├── services/       # API 服务
│   │   └── api.ts      # API 客户端
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 应用根组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── dist/               # 构建输出目录
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── netlify.toml        # Netlify 部署配置
├── vercel.json         # Vercel 部署配置
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 3. 构建生产版本

```bash
npm run build
```

构建完成后，产物在 `dist` 目录

### 4. 预览生产构建

```bash
npx serve dist -l 3000
```

## 🌐 部署

### 方式一：部署到 Netlify（推荐）

1. 访问 [Netlify](https://netlify.com) 并登录

2. 点击 "Add new site" → "Import an existing project"

3. 连接 GitHub 仓库或手动上传 `dist` 目录

4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

5. 点击 "Deploy site"

**或者使用 Netlify CLI:**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 方式二：部署到 Vercel

1. 访问 [Vercel](https://vercel.com) 并登录

2. 点击 "Add New" → "Project"

3. 导入 GitHub 仓库

4. Vercel 会自动检测 Vite 配置，点击 "Deploy"

**或使用 Vercel CLI:**

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### 方式三：部署到 GitHub Pages

1. 安装 gh-pages:
```bash
npm install -D gh-pages
```

2. 添加部署脚本到 package.json:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://你的用户名.github.io/你的仓库名"
}
```

3. 在 vite.config.ts 添加 base:
```ts
export default defineConfig({
  base: '/你的仓库名/',
  // ...其他配置
})
```

4. 部署:
```bash
npm run deploy
```

### 方式四：静态托管（任意服务器）

构建后将 `dist` 目录上传到任意静态文件托管服务：
- Cloudflare Pages
- AWS S3 + CloudFront
- 阿里云 OSS
- 腾讯云 COS

## 🔌 API 接口

项目配置为调用后端 API，需要在 `.env` 文件中配置:

```env
VITE_API_URL=http://localhost:8080/api
```

### 主要 API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /auth/login | 用户登录 |
| POST | /auth/register | 用户注册 |
| GET | /tasks | 获取任务列表 |
| GET | /tasks/:id | 获取任务详情 |
| POST | /tasks | 发布任务 |
| POST | /tasks/:id/submit | 提交任务申请 |

## 📝 Mock 数据

由于后端 API 暂未就绪，项目内置了 Mock 数据用于演示:

### 测试账号

在登录页可以使用快速登录按钮：
- **企业账号**: 发布任务、查看申请者
- **个人账号**: 浏览任务、申请任务

### 示例数据
- 首页展示 6 个示例任务
- 任务详情页有完整的任务描述
- 个人中心展示用户发布的任务/申请的任务

## 🎨 设计特点

1. **现代化 UI** - 简洁明快的设计风格，蓝白配色
2. **响应式布局** - 完美适配手机、平板、桌面
3. **流畅交互** - 优雅的过渡动画和 hover 效果
4. **清晰的信息层级** - 卡片式设计，易于浏览
5. **移动优先** - 针对移动端优化的触控区域和布局

## 📸 页面预览

### 首页/任务大厅
- 任务卡片展示
- 状态筛选（全部/招募中/进行中/已完成）
- 关键词搜索
- Responsive 网格布局

### 任务详情页
- 完整任务描述
- 技能标签
- 发布者信息
- 申请按钮（自由职业者）

### 登录/注册页
- 简洁的表单设计
- 用户类型选择（企业/个人）
- 快速登录测试

### 个人中心
- 用户信息展示与编辑
- 我发布的任务（企业）
- 我申请的任务（个人）

## 🔧 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| VITE_API_URL | 后端 API 地址 | http://localhost:8080/api |

## 📄 许可证

MIT License

---

## 👨‍💻 关于项目

**开发者**: 猫柒  
**创建时间**: 2024 年 3 月  
**项目类型**: 灵活用工平台 MVP  
**技术栈**: React + TypeScript + Vite + Tailwind CSS

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📞 联系

如有问题或建议，请联系开发者。