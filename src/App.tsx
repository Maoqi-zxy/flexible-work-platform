import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { User } from './types';
import { authService } from './services/api';

// 页面组件
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskDetailPage from './pages/TaskDetailPage';
import PublishTaskPage from './pages/PublishTaskPage';
import ProfilePage from './pages/ProfilePage';
import EmployerDashboard from './pages/EmployerDashboard';
import ApplicationReviewPage from './pages/ApplicationReviewPage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // 加载期间显示 loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={currentUser} onLogout={handleLogout} />}>
        <Route index element={<HomePage />} />
        <Route path="task/:id" element={<TaskDetailPage />} />
        <Route 
          path="publish" 
          element={currentUser?.userType === 'enterprise' ? <PublishTaskPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="profile" 
          element={currentUser ? <ProfilePage user={currentUser} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="employer/dashboard" 
          element={currentUser?.userType === 'enterprise' ? <EmployerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="employer/applications/:taskId" 
          element={currentUser?.userType === 'enterprise' ? <ApplicationReviewPage /> : <Navigate to="/login" />} 
        />
      </Route>
      <Route path="login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="register" element={<RegisterPage onRegister={handleLogin} />} />
    </Routes>
  );
}

export default App;