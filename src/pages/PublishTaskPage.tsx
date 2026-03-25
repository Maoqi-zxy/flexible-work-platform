import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';

export default function PublishTaskPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('请填写任务标题');
      return;
    }

    if (!formData.description.trim()) {
      setError('请填写任务描述');
      return;
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      setError('请输入有效的预算金额');
      return;
    }

    if (!formData.deadline) {
      setError('请选择截止日期');
      return;
    }

    setLoading(true);

    try {
      const budget = Number(formData.budget);
      await taskService.createTask({
        title: formData.title,
        description: formData.description,
        category: '开发',  // 默认分类
        budget_min: budget,
        budget_max: budget * 1.2,  // 预算范围上浮 20%
        deadline: formData.deadline,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      
      alert('任务发布成功！');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '发布失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">发布新任务</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 任务标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              任务标题 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="简明扼要地描述任务内容"
            />
          </div>

          {/* 任务描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              任务描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field h-40 resize-none"
              placeholder="详细描述任务需求、技术要求、交付标准等"
            />
          </div>

          {/* 预算 */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              预算金额（元）<span className="text-red-500">*</span>
            </label>
            <input
              id="budget"
              type="number"
              required
              min="0"
              step="100"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="input-field"
              placeholder="例如：5000"
            />
          </div>

          {/* 截止日期 */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              截止日期 <span className="text-red-500">*</span>
            </label>
            <input
              id="deadline"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input-field"
            />
          </div>

          {/* 技能要求 */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
              技能要求
            </label>
            <input
              id="skills"
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="input-field"
              placeholder="例如：React, TypeScript, Tailwind CSS（用逗号分隔）"
            />
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">发布小贴士：</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>清晰的任务描述能吸引更多合适的自由职业者</li>
                  <li>合理的预算有助于快速找到合适人选</li>
                  <li>明确的截止日期有助于项目进度管理</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '发布中...' : '发布任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}