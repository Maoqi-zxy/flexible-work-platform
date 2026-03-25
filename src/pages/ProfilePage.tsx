import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import apiClient from '../services/api';

interface ProfilePageProps {
  user: User;
}

interface AppliedTask {
  id: string;
  task_id: number;
  task_title: string;
  task_status: string;
  status: string;
  enterprise_name: string;
  company_name: string;
  applied_at: string;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    // skills 可能是字符串或数组，需要兼容处理
    skills: (() => {
      if (!user?.skills) return '';
      if (Array.isArray(user.skills)) return user.skills.join(', ');
      return String(user.skills);  // 如果已经是字符串，直接返回
    })(),
  });
  const [appliedTasks, setAppliedTasks] = useState<AppliedTask[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ProfilePage 用户数据:', user);
    if (user?.userType === 'freelancer') {
      loadAppliedTasks();
    }
  }, [user]);

  const loadAppliedTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/my/applications');
      const data = response.data?.data || response.data || [];
      setAppliedTasks(data.map((item: any) => ({
        id: String(item.id),
        task_id: item.task_id,
        task_title: item.task_title,
        task_status: item.task_status,
        status: item.status,
        enterprise_name: item.enterprise_name,
        company_name: item.company_name,
        applied_at: item.applied_at,
      })));
    } catch (error) {
      console.error('加载申请任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载企业发布的任务
  useEffect(() => {
    if (user?.userType === 'enterprise') {
      loadPostedTasks();
    }
  }, [user]);

  const loadPostedTasks = async () => {
    try {
      const response = await apiClient.get('/api/my/tasks');
      const data = response.data?.tasks || response.data?.data || response.data || [];
      setPostedTasks(data.map((task: any) => ({
        id: String(task.id),
        title: task.title,
        budget: task.budget_min || task.budget_max || 0,
        status: task.status,
        applications: task.applications || 0,
      })));
    } catch (error) {
      console.error('加载发布任务失败:', error);
    }
  };

  const handleSave = () => {
    // 实际项目中这里会调用 API 更新用户信息
    const updatedUser = {
      ...user,
      username: formData.username,
      phone: formData.phone || undefined,
      companyName: formData.companyName || undefined,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('保存成功！');
  };

  // 只对企业用户显示
  const [postedTasks, setPostedTasks] = useState<any[]>([]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 个人信息卡片 */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn-primary"
          >
            {isEditing ? '保存' : '编辑资料'}
          </button>
        </div>

        <div className="flex items-center mb-6">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full mr-6" />
          ) : (
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mr-6">
              <span className="text-primary-600 font-bold text-3xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.username || '用户'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.userType === 'enterprise' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user?.userType === 'enterprise' ? '企业用户' : '自由职业者'}
              </span>
              <span className="text-sm text-gray-500">
                注册于 {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
              </span>
            </div>
          </div>
        </div>

        {/* 用户信息表单 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="input-field bg-gray-100"
            />
          </div>

          {user.userType === 'enterprise' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100"
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">技能标签</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100"
                placeholder="用逗号分隔"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="input-field disabled:bg-gray-100"
              placeholder="可选"
            />
          </div>
        </div>
      </div>

      {/* 我的任务 */}
      {loading ? (
        <div className="card text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : user?.userType === 'enterprise' ? (
        /* 企业用户 - 发布的任务 */
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">我发布的任务</h2>
          {postedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无发布的任务
            </div>
          ) : (
            <div className="space-y-4">
              {postedTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/task/${task.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>预算：¥{(task.budget || 0).toLocaleString()}</span>
                      <span>申请者：{task.applications || 0}人</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status === 'open' ? '招募中' : '进行中'}
                      </span>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    查看详情 →
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 自由职业者 - 申请的任务 */
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">我申请的任务</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : appliedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无申请的任务
            </div>
          ) : (
            <div className="space-y-4">
              {appliedTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/task/${task.task_id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{task.task_title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>企业：{task.enterprise_name || task.company_name}</span>
                      <span>申请时间：{new Date(task.applied_at).toLocaleDateString('zh-CN')}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.task_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.task_status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        task.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.task_status === 'in_progress' ? '进行中' :
                         task.task_status === 'completed' ? '已完成' :
                         task.status === 'approved' ? '已录用' :
                         task.status === 'rejected' ? '已拒绝' : '审核中'}
                      </span>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    查看详情 →
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}