import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SubjectPage from './pages/SubjectPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingPage from './pages/LoadingPage';
import { useAuth } from './context/AuthContext';

// ── Global ripple handler ────────────────────────────────────────
function useRipple() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as Element).closest('[data-ripple]') as HTMLElement | null;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x    = e.clientX - rect.left  - size / 2;
      const y    = e.clientY - rect.top   - size / 2;
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove(), { once: true });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
}

// ── Page transition wrapper ──────────────────────────────────────
function AnimatedRoutes({ user, logout }: { user: ReturnType<typeof useAuth>['user']; logout: () => void }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage]                     = useState<'enter' | 'exit'>('enter');
  const isMounting                             = useRef(true);

  useEffect(() => {
    if (isMounting.current) { isMounting.current = false; return; }
    if (location.key === displayLocation.key) return;
    setStage('exit');
    const t = setTimeout(() => {
      setDisplayLocation(location);
      setStage('enter');
    }, 210);
    return () => clearTimeout(t);
  }, [location.key]);

  return (
    <div key={displayLocation.key} className={stage === 'exit' ? 'page-exit' : 'page-enter'}>
      <Routes location={displayLocation}>
        <Route path="/"                     element={<HomePage />} />
        <Route path="/quiz"                 element={<QuizPage />} />
        <Route path="/dashboard"            element={user ? <DashboardPage /> : <Navigate to="/" replace />} />
        <Route path="/profile"              element={<ProfilePage />} />
        <Route path="/settings"             element={<SettingsPage />} />
        <Route path="/subject/:subjectName" element={<SubjectPage />} />
        <Route path="*"                     element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const { user, logout, loading } = useAuth();
  useRipple();

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

  return <AnimatedRoutes user={user} logout={logout} />;
}

export default App;
