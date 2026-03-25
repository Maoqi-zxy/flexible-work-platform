# 雇主审核功能 - 快速开始指南

## 🎯 功能概述

本次开发为灵活用工平台新增了完整的雇主审核功能，允许企业用户：
- 查看自己发布的所有任务
- 查看每个任务收到的申请数量
- 审核自由职业者的申请（通过/拒绝）
- 查看申请详情和自由职业者信息

## 📁 文件变更清单

### 新增文件
```
src/pages/EmployerDashboard.tsx          # 雇主管理仪表盘
src/pages/ApplicationReviewPage.tsx      # 申请审核页面
EMPLOYER_FEATURES.md                      # 功能说明文档
EMPLOYER_FEATURES_UI.md                   # UI/UX 说明文档
verify-employer-features.sh               # 验证脚本
```

### 修改文件
```
src/App.tsx                               # 添加新路由
src/components/Layout.tsx                 # 添加导航入口
src/services/api.ts                       # 添加 employerService
src/types/index.ts                        # 添加新类型定义
```

## 🚀 后端 API 需求

确保后端提供以下 API 接口：

### 1. 获取我的任务列表
```http
GET /api/employer/tasks
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "React 网站开发",
      "description": "...",
      "budget_min": 10000,
      "budget_max": 15000,
      "deadline": "2024-12-31",
      "status": "open",
      "enterprise_id": 1,
      "enterprise_name": "某某公司",
      "submissionCount": 5,  // ⚠️ 必需字段
      "created_at": "2024-03-01T10:00:00Z",
      "updated_at": "2024-03-01T10:00:00Z"
    }
  ]
}
```

### 2. 获取任务的申请列表
```http
GET /api/tasks/:id/submissions
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "task_id": 1,
      "freelancer_id": 100,
      "content": "申请说明...",
      "attachment_urls": ["url1", "url2"],
      "status": "pending",  // pending | accepted | rejected
      "submitted_at": "2024-03-02T10:00:00Z",
      "freelancer": {  // ⚠️ 必需包含自由职业者详细信息
        "id": 100,
        "username": "张三",
        "email": "zhangsan@example.com",
        "avatar": "https://...",
        "skills": ["React", "TypeScript", "Tailwind CSS"],
        "rating": 4.9,
        "completed_tasks": 12
      }
    }
  ]
}
```

### 3. 通过申请
```http
POST /api/submissions/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

Response:
{
  "code": 0,
  "message": "success"
}
```

### 4. 拒绝申请
```http
POST /api/submissions/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

Response:
{
  "code": 0,
  "message": "success"
}
```

## 🧪 测试步骤

### 步骤 1: 启动前端服务
```bash
cd flexible-work-platform
npm install
npm run dev
```

### 步骤 2: 准备测试账号
- 需要一个**企业用户**账号（`userType: 'enterprise'`）
- 需要几个**自由职业者**账号用于提交申请测试

### 步骤 3: 验证功能

#### 3.1 访问雇主管理仪表盘
1. 使用企业用户账号登录
2. 点击顶部导航栏"雇主管理"
3. 验证：
   - ✅ 能看到已发布的任务列表
   - ✅ 每个任务显示申请数量
   - ✅ 点击"查看申请"能跳转到审核页面

#### 3.2 验证权限控制
1. 退出登录
2. 直接在地址栏输入 `http://localhost:5173/employer/dashboard`
3. 验证：应该被重定向到首页

#### 3.3 测试申请审核
1. 进入申请审核页面
2. 查看申请列表和详情
3. 点击"通过申请"
4. 验证：
   - ✅ 出现确认对话框
   - ✅ 确认后显示 Toast 提示
   - ✅ 申请状态更新为"已通过"
   - ✅ 按钮消失，状态标识显示

5. 点击"拒绝申请"（对另一个申请）
6. 验证：
   - ✅ 出现确认对话框
   - ✅ 确认后显示 Toast 提示
   - ✅ 申请状态更新为"已拒绝"
   - ✅ 按钮消失，状态标识显示

### 步骤 4: 运行验证脚本
```bash
./verify-employer-features.sh
```

## 🐛 常见问题排查

### 问题 1: 页面显示"加载中..."但不显示数据
**原因**: API 请求失败或返回数据格式不对

**排查步骤**:
1. 打开浏览器开发者工具
2. 查看 Console 中的错误信息
3. 查看 Network 中的 API 请求响应
4. 确认后端 API 返回的字段名与前端期望一致

### 问题 2: 点击审核按钮无反应
**原因**: 
- Token 过期或无效
- 后端 API 未实现
- CORS 跨域问题

**排查步骤**:
1. 检查 Network 请求是否发送
2. 检查请求状态码
3. 检查是否有 CORS 错误

### 问题 3: 导航栏没有"雇主管理"入口
**原因**: 当前用户的 `userType` 不是 `'enterprise'`

**解决方法**:
- 确认登录的是企业用户账号
- 检查 localStorage 中的 user 对象

### 问题 4: Toast 提示不显示
**原因**: Toast 组件渲染问题

**解决方法**:
- 检查页面底部是否有 Toast 容器
- 刷新页面重试

## 📝 代码示例

### 如何在其他页面调用雇主服务

```typescript
import { employerService } from './services/api';

// 获取我的任务
const tasks = await employerService.getMyTasks();

// 获取任务详情
const task = await employerService.getTaskById(taskId);

// 获取申请列表
const submissions = await employerService.getTaskSubmissions(taskId);

// 通过申请
await employerService.approveSubmission(submissionId);

// 拒绝申请
await employerService.rejectSubmission(submissionId);
```

### 如何在组件中使用类型

```typescript
import type { EmployerTask, FreelancerProfile } from './types';

// 定义组件 Props
interface Props {
  task: EmployerTask;
  freelancer: FreelancerProfile;
}

// 使用类型
function TaskCard({ task }: Props) {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>申请数：{task.submissionCount}</p>
    </div>
  );
}
```

## 🎨 自定义样式

如果需要使用不同的主题色，可以在 `tailwind.config.js` 中修改 `primary` 颜色：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#...',
          100: '#...',
          // ...
          600: '#你的品牌色',
          // ...
        },
      },
    },
  },
}
```

## 🔄 后续开发建议

1. **添加筛选功能**
   - 按任务状态筛选
   - 按申请时间排序

2. **批量操作**
   - 支持多选申请批量通过/拒绝

3. **消息通知**
   - 审核结果通知自由职业者
   - 新申请通知雇主

4. **统计分析**
   - 任务完成率
   - 平均审核时间
   - 申请趋势图

5. **搜索功能**
   - 搜索自由职业者
   - 搜索申请内容

## 📞 技术支持

如有问题，请查看：
- `EMPLOYER_FEATURES.md` - 完整功能说明
- `EMPLOYER_FEATURES_UI.md` - UI/UX 详细说明
- 浏览器开发者工具 - 排查错误

---

**最后更新**: 2025-03-25  
**版本**: 1.0