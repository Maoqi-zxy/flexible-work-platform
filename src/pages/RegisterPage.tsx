import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User } from '../types';

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'freelancer' as 'enterprise' | 'freelancer',
    companyName: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  const handleConfirm = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少 6 位');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.userType,  // 后端期望字段名：role
        company_name: formData.userType === 'enterprise' ? formData.companyName : undefined,  // 后端期望字段名：company_name
        skills: formData.userType === 'freelancer' && formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      };

      const result = await authService.register(registerData);
      
      console.log('注册成功，后端返回:', result);
      
      // AuthResponse 返回格式：{ user: { id, username, email, role, userType, ... }, token: string }
      const user = result.user || result;
      // 兼容后端返回：role → userType
      const userData = {
        ...user,
        userType: user.role || user.userType,
      };
      
      localStorage.setItem('token', result.token || 'registered');
      localStorage.setItem('user', JSON.stringify(userData));
      onRegister(userData);
      
      console.log('注册成功，显示弹窗...');
      setRegisteredUser(userData);
      setShowSuccessModal(true);
      // 不直接跳转，等待用户点击确认按钮
    } catch (err: any) {
      console.error('注册失败:', err);
      console.error('错误详情:', err.response?.data);
      setError(err.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">灵</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">灵活用工平台</span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">创建账号</h2>
            <p className="text-gray-600 mt-2">加入我们，开启灵活用工之旅</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 用户类型选择 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'freelancer' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.userType === 'freelancer'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium text-gray-900">自由职业者</div>
              <div className="text-xs text-gray-500 mt-1">接任务赚钱</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'enterprise' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.userType === 'enterprise'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-medium text-gray-900">企业用户</div>
              <div className="text-xs text-gray-500 mt-1">发布任务</div>
            </button>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="至少 6 位"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="再次输入密码"
              />
            </div>

            {formData.userType === 'enterprise' ? (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称
                </label>
                <input
                  id="companyName"
                  type="text"
                  required={formData.userType === 'enterprise'}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input-field"
                  placeholder="请输入公司名称"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  技能标签
                </label>
                <input
                  id="skills"
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="input-field"
                  placeholder="例如：React, Vue, Node.js（用逗号分隔）"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已有账号？{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 注册成功弹窗 */}
      {showSuccessModal && registeredUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            {/* 成功图标 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">注册成功！🎉</h3>
              <p className="text-gray-600">欢迎加入灵活用工平台</p>
            </div>

            {/* 用户信息卡片 */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">用户名</p>
                    <p className="font-medium text-gray-900">{registeredUser.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">邮箱</p>
                    <p className="font-medium text-gray-900">{registeredUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">角色</p>
                    <p className="font-medium text-gray-900">
                      {registeredUser.userType === 'enterprise' ? (
                        <span className="inline-flex items-center">
                          <span className="mr-1">🏢</span>
                          企业用户
                        </span>
                      ) : (
                        <span className="inline-flex items-center">
                          <span className="mr-1">👤</span>
                          自由职业者
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 确认按钮 */}
            <button
              onClick={handleConfirm}
              className="w-full btn-primary py-3 text-lg font-medium"
            >
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  );
}