import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employerService } from '../services/api';
import type { Task, TaskSubmission } from '../types';

interface FreelancerInfo {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  skills?: string[];
  rating?: number;
  completedTasks?: number;
}

interface SubmissionWithFreelancer extends TaskSubmission {
  freelancer: FreelancerInfo;
}

export default function ApplicationReviewPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      loadTaskAndSubmissions(taskId);
    }
  }, [taskId]);

  const loadTaskAndSubmissions = async (id: string) => {
    try {
      setLoading(true);
      const [taskData, submissionsData] = await Promise.all([
        employerService.getTaskById(id),
        employerService.getTaskSubmissions(id),
      ]);
      setTask(taskData);
      setSubmissions(submissionsData);
      setError(null);
    } catch (err) {
      setError('加载数据失败，请稍后重试');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    if (!confirm('确认通过该申请吗？')) return;
    
    try {
      setProcessingId(submissionId);
      await employerService.approveSubmission(submissionId);
      showToast('申请已通过', 'success');
      if (taskId) {
        loadTaskAndSubmissions(taskId);
      }
    } catch (err) {
      showToast('操作失败，请稍后重试', 'error');
      console.error('Failed to approve:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!confirm('确认拒绝该申请吗？')) return;
    
    try {
      setProcessingId(submissionId);
      await employerService.rejectSubmission(submissionId);
      showToast('申请已拒绝', 'success');
      if (taskId) {
        loadTaskAndSubmissions(taskId);
      }
    } catch (err) {
      showToast('操作失败，请稍后重试', 'error');
      console.error('Failed to reject:', err);
    } finally {
      setProcessingId(null);
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

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || '任务不存在'}</div>
          <button onClick={() => navigate('/employer/dashboard')} className="btn-primary">
            返回雇主管理
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link
          to="/employer/dashboard"
          className="text-gray-600 hover:text-primary-600 flex items-center space-x-2"
        >
          <span>←</span>
          <span>返回雇主管理</span>
        </Link>
      </div>

      {/* 任务信息 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h1>
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="mr-2">💰</span>
            预算：¥{task.budget.toLocaleString()}
          </div>
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            截止：{new Date(task.deadline).toLocaleDateString('zh-CN')}
          </div>
          <div className="flex items-center">
            <span className="mr-2">📊</span>
            状态：<StatusBadge status={task.status} />
          </div>
          <div className="flex items-center">
            <span className="mr-2">📝</span>
            申请数：{submissions.length}
          </div>
        </div>
      </div>

      {/* 申请列表 */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">申请列表</h2>
      
      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无申请</h3>
          <p className="text-gray-600">还没有自由职业者提交申请</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-6">
                {/* 自由职业者信息 */}
                <div className="flex-shrink-0">
                  {(submission.freelancer?.avatar) ? (
                    <img
                      src={submission.freelancer.avatar}
                      alt={submission.freelancer?.username || '自由职业者'}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-xl">
                        {(submission.freelancer?.username || '自').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* 头部信息 */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.freelancer?.username || '自由职业者'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <span className="mr-1">⭐</span>
                          {submission.freelancer?.rating?.toFixed(1) || '暂无'}
                          <span className="ml-1 text-gray-400">
                            ({submission.freelancer?.completedTasks || 0} 个完成的任务)
                          </span>
                        </div>
                      </div>
                    </div>
                    <SubmissionStatusBadge status={submission.status} />
                  </div>

                  {/* 技能标签 */}
                  {submission.freelancer?.skills && submission.freelancer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {submission.freelancer.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {submission.freelancer.skills.length > 5 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          +{submission.freelancer.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 申请内容 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">申请说明</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {submission.content}
                    </p>
                  </div>

                  {/* 附件 */}
                  {submission.attachmentUrls && submission.attachmentUrls.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">附件</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.attachmentUrls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            查看附件 {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  {submission.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        disabled={processingId === submission.id}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === submission.id ? '处理中...' : '通过申请'}
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        disabled={processingId === submission.id}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === submission.id ? '处理中...' : '拒绝申请'}
                      </button>
                    </div>
                  )}

                  {submission.status === 'accepted' && (
                    <div className="text-green-600 font-medium">
                      ✓ 已通过
                    </div>
                  )}

                  {submission.status === 'rejected' && (
                    <div className="text-red-600 font-medium">
                      ✗ 已拒绝
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast 容器 */}
      <ToastContainer />
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

function SubmissionStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: '待审核', color: 'bg-yellow-100 text-yellow-800' },
    accepted: { text: '已通过', color: 'bg-green-100 text-green-800' },
    rejected: { text: '已拒绝', color: 'bg-red-100 text-red-800' },
  };

  const config = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
}

// Toast 提示系统
let toastCallback: ((message: string, type: 'success' | 'error') => void) | null = null;

function showToast(message: string, type: 'success' | 'error') {
  if (toastCallback) {
    toastCallback(message, type);
  }
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  useEffect(() => {
    toastCallback = (message, type) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    return () => {
      toastCallback = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-up ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}