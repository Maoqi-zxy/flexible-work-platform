import { useState } from 'react';
import type { User } from '../types';

interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    companyName: user.companyName || '',
    skills: user.skills?.join(', ') || '',
  });

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

  // Mock 数据 - 用户发布的任务
  const myPostedTasks = [
    { id: '1', title: '企业官网 redesign', status: 'open', applicants: 5, budget: 8000 },
    { id: '7', title: '小程序开发', status: 'in_progress', applicants: 12, budget: 15000 },
  ];

  // Mock 数据 - 用户申请的任务
  const myAppliedTasks = [
    { id: '3', title: '数据可视化大屏', status: 'pending', appliedAt: '2024-03-17' },
    { id: '5', title: '后台管理系统', status: 'accepted', appliedAt: '2024-03-15' },
  ];

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
            <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.userType === 'enterprise' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.userType === 'enterprise' ? '企业用户' : '自由职业者'}
              </span>
              <span className="text-sm text-gray-500">
                注册于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
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
      {user.userType === 'enterprise' ? (
        /* 企业用户 - 发布的任务 */
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">我发布的任务</h2>
          {myPostedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无发布的任务
            </div>
          ) : (
            <div className="space-y-4">
              {myPostedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>预算：¥{task.budget.toLocaleString()}</span>
                      <span>申请者：{task.applicants}人</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status === 'open' ? '招募中' : '进行中'}
                      </span>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    查看详情
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 自由职业者 - 申请的任务 */
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">我申请的任务</h2>
          {myAppliedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无申请的任务
            </div>
          ) : (
            <div className="space-y-4">
              {myAppliedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>申请时间：{new Date(task.appliedAt).toLocaleDateString('zh-CN')}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {task.status === 'pending' ? '审核中' : '已录用'}
                      </span>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    查看详情
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}