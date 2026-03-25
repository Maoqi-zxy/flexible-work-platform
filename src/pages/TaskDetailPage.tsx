import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskService, authService } from '../services/api';
import type { Task, User } from '../types';

// Mock 数据
const mockTask: Task = {
  id: '1',
  title: '企业官网 redesign',
  description: `需要重新设计我们公司官网，包括首页、关于我们、产品展示、联系方式等页面。

具体要求：
1. 现代化、简洁的设计风格
2. 响应式布局，适配PC 和移动端
3. 加载速度快，性能优化
4. SEO 友好
5. 包含简单的后台管理系统

技术栈要求：
- React 18+
- TypeScript
- Tailwind CSS
- 有类似项目经验者优先

项目周期：4 周
预算：¥8,000
付款方式：50% 预付款 + 50% 验收后`,
  budget: 8000,
  deadline: '2024-04-15',
  status: 'open',
  publisherId: '101',
  publisherName: '科技创新公司',
  publisherAvatar: undefined,
  skills: ['UI 设计', 'React', '响应式设计', 'TypeScript', 'Tailwind CSS'],
  createdAt: '2024-03-18T10:00:00Z',
  updatedAt: '2024-03-18T10:00:00Z',
};

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitContent, setSubmitContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await taskService.getTaskById(id!);
      console.log('任务详情数据:', data);
      setTask(data);
    } catch (error) {
      console.error('加载任务详情失败，使用 mock 数据:', error);
      // 找不到任务时使用 mock 数据
      setTask(mockTask);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submitContent.trim()) {
      alert('请填写提交内容');
      return;
    }

    setSubmitting(true);
    try {
      await taskService.submitTask(id!, submitContent);
      alert('✅ 提交成功！等待雇主审核');
      setShowSubmitModal(false);
      setSubmitContent('');
      loadTask();
    } catch (error: any) {
      console.error('提交失败:', error);
      alert(error.response?.data?.message || '❌ 提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const canApply = currentUser?.userType === 'freelancer' && task?.status === 'open';
  const isOwner = currentUser?.id === task?.publisherId;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">任务不存在</h3>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            返回任务大厅
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      {/* 任务详情卡片 */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
              task.status === 'open' ? 'bg-green-100 text-green-800' :
              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              task.status === 'completed' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.status === 'open' ? '招募中' :
               task.status === 'in_progress' ? '进行中' :
               task.status === 'completed' ? '已完成' : '已关闭'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {task.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>发布于 {new Date(task.createdAt).toLocaleDateString('zh-CN')}</span>
              <span className="mx-2">•</span>
              <span>截止日期 {new Date(task.deadline).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600 mb-1">
              ¥{task.budget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">预算</div>
          </div>
        </div>

        {/* 发布者信息 */}
        <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-primary-600 font-bold text-lg">
              {task.publisherName ? task.publisherName.charAt(0) : '企'}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{task.publisherName || '未知企业'}</div>
            <div className="text-sm text-gray-500">任务发布者</div>
          </div>
        </div>

        {/* 任务描述 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">任务描述</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {task.description}
          </div>
        </div>

        {/* 技能标签 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">所需技能</h2>
          <div className="flex flex-wrap gap-2">
            {(task.skills || []).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          {canApply ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex-1 btn-primary py-3 text-lg"
            >
              立即申请
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
            >
              {task.status !== 'open' ? '任务已结束' : '需登录并认证为自由职业者'}
            </button>
          )}
          
          {isOwner && (
            <Link
              to={`/task/${id}/edit`}
              className="btn-secondary py-3 px-6"
            >
              编辑任务
            </Link>
          )}
        </div>
      </div>

      {/* 提交模态框 */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">提交申请</h3>
            <textarea
              value={submitContent}
              onChange={(e) => setSubmitContent(e.target.value)}
              placeholder="请简要介绍您的相关经验、完成方案和预计时间..."
              className="input-field h-40 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {submitting ? '提交中...' : '提交申请'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}