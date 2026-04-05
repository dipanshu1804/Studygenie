import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingPage from './pages/LoadingPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout, loading } = useAuth();

  // Check for expired JWT on mount
  useEffect(() => {
    const token = localStorage.getItem('sg_token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        logout();
        toast.error('Session expired, please sign in again');
      }
    } catch {
      logout();
    }
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/dashboard"
        element={user ? <DashboardPage /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
