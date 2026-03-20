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

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout user={currentUser} onLogout={handleLogout} />}>
        <Route index element={<HomePage />} />
        <Route path="task/:id" element={<TaskDetailPage />} />
        <Route 
          path="publish" 
          element={currentUser?.userType === 'enterprise' ? <PublishTaskPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="profile" 
          element={currentUser ? <ProfilePage user={currentUser} /> : <Navigate to="/login" />} 
        />
      </Route>
      <Route path="login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="register" element={<RegisterPage onRegister={handleLogin} />} />
    </Routes>
  );
}

export default App;