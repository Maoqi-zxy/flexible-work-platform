import { Outlet, Link, useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">灵</span>
              </div>
              <span className="text-xl font-bold text-gray-900">灵活用工平台</span>
            </Link>

            {/* 导航链接 */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                任务大厅
              </Link>
              {user?.userType === 'enterprise' && (
                <Link to="/publish" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  发布任务
                </Link>
              )}
            </nav>

            {/* 用户菜单 */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="hidden md:inline">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    退出
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                    登录
                  </Link>
                  <Link to="/register" className="btn-primary">
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">灵活用工平台</h3>
              <p className="text-gray-400 text-sm">
                连接企业与自由职业者，打造高效灵活的任务对接平台
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-white">任务大厅</Link></li>
                <li><Link to="/publish" className="hover:text-white">发布任务</Link></li>
                <li><Link to="/profile" className="hover:text-white">个人中心</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">联系我们</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>邮箱：support@flexwork.com</li>
                <li>电话：400-888-8888</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 灵活用工平台。All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}