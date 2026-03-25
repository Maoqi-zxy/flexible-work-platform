import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerService } from '../services/api';
import type { Task } from '../types';

interface EmployerTask extends Task {
  submissionCount: number;
}

export default function EmployerDashboard() {
  const [tasks, setTasks] = useState<EmployerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await employerService.getMyTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('加载任务列表失败，请稍后重试');
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button onClick={loadTasks} className="btn-primary">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">雇主管理</h1>
        <p className="text-gray-600">管理您发布的任务和申请</p>
      </div>

      {/* 任务列表 */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无任务</h3>
          <p className="text-gray-600 mb-6">您还没有发布任何任务</p>
          <Link to="/publish" className="btn-primary">
            发布第一个任务
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">💰</span>
                      ¥{(task.budget || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      截止：{new Date(task.deadline).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📝</span>
                      {task.submissionCount} 个申请
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📊</span>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>

                <Link
                  to={`/employer/applications/${task.id}`}
                  className="ml-6 flex-shrink-0"
                >
                  <button className="btn-primary whitespace-nowrap">
                    查看申请
                    {task.submissionCount > 0 && (
                      <span className="ml-2 bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {task.submissionCount}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { text: string; color: string }> = {
    open: { text: '招募中', color: 'bg-green-100 text-green-800' },
    in_progress: { text: '进行中', color: 'bg-blue-100 text-blue-800' },
    completed: { text: '已完成', color: 'bg-gray-100 text-gray-800' },
    closed: { text: '已关闭', color: 'bg-red-100 text-red-800' },
  };

  const config = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
}