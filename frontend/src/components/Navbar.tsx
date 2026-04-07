import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';
import ShortcutsModal from './ShortcutsModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showAuth,      setShowAuth]      = useState(false);
  const [authMode,      setAuthMode]      = useState<'login' | 'register'>('login');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [avatarOpen,    setAvatarOpen]    = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Global Ctrl+/ shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') { e.preventDefault(); setShowShortcuts((p) => !p); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setAvatarOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setAvatarOpen(false);
  };
  const openLogin    = () => { setAuthMode('login');    setShowAuth(true); setMenuOpen(false); };
  const openRegister = () => { setAuthMode('register'); setShowAuth(true); setMenuOpen(false); };

  const avatar = user ? user.name.charAt(0).toUpperCase() : '';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-md border-dark-500 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-dark-900/80 backdrop-blur-md border-dark-600'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-200">
              <img src="/favicon.svg" alt="StudyGenie Logo" className="w-full h-full" />
            </div>
            <span className="font-bold text-lg text-white group-hover:text-accent-light transition-colors">
              StudyGenie
            </span>
          </Link>

          {/* ── Desktop ─────────────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Quiz */}
            <Link
              to="/quiz"
              className="nav-link px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              🧠 Quiz
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="text-slate-500 hover:text-slate-300 transition-colors text-base px-1.5 py-1 rounded"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={() => setShowShortcuts(true)}
              aria-label="Open keyboard shortcuts (Ctrl+/)"
              title="Keyboard shortcuts (Ctrl+/)"
              className="text-slate-500 hover:text-slate-300 transition-colors text-base px-1 rounded"
            >
              ⌨
            </button>

            {user ? (
              <>
                {/* Streak badge */}
                {user.streak >= 2 && (
                  <span className="text-orange-400 font-semibold text-xs bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded-full">
                    <span className="flame-flicker">🔥</span> {user.streak}
                  </span>
                )}

                {/* Avatar dropdown */}
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen((p) => !p)}
                    aria-label="Open user menu"
                    aria-expanded={avatarOpen}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-dark-600 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-light flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:shadow-md group-hover:shadow-accent-purple/30 transition-shadow">
                      {avatar}
                    </div>
                    <span className="text-slate-300 text-sm font-medium max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className={`text-slate-500 text-xs transition-transform duration-150 ${avatarOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>

                  {/* Dropdown */}
                  {avatarOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-dark-600 bg-dark-700/50">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-slate-500 text-xs truncate">{user.email}</p>
                      </div>
                      {[
                        { to: '/profile',   icon: '👤', label: 'My Profile' },
                        { to: '/settings',  icon: '⚙',  label: 'Settings'   },
                        { to: '/dashboard', icon: '📋', label: 'My History'  },
                      ].map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-dark-700 transition-colors text-sm"
                        >
                          <span className="w-4 text-center">{icon}</span>
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-dark-600 mx-3" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors text-sm"
                      >
                        <span className="w-4 text-center">↩</span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="nav-link px-4 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-dark-600 transition-colors"
                >
                  Login
                </button>
                <button
                  data-ripple
                  onClick={openRegister}
                  className="px-4 py-1.5 rounded-lg text-sm bg-accent-purple hover:bg-accent-violet text-white transition-colors shadow-md shadow-accent-purple/20"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* ── Mobile: theme + shortcuts + hamburger ────────── */}
          <div className="flex sm:hidden items-center gap-2">
            <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-300 transition-colors text-base px-1">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setShowShortcuts(true)} className="text-slate-500 hover:text-slate-300 transition-colors text-base px-1">
              ⌨
            </button>
            <button
              className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-dark-700 transition-colors"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`block w-5 h-0.5 bg-slate-300 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-300 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-300 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────── */}
        {menuOpen && (
          <div className="sm:hidden border-t border-dark-600 bg-dark-900/95 backdrop-blur-md px-4 py-3 flex flex-col gap-2 animate-fade-in-down">
            <Link to="/quiz" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm bg-dark-700 text-slate-300 hover:text-white hover:bg-dark-600 transition-colors text-center">
              🧠 Quiz
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-dark-800 rounded-xl border border-dark-600">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-light flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                    {user.streak >= 2 && (
                      <p className="text-orange-400 text-xs"><span className="flame-flicker">🔥</span> {user.streak} day streak</p>
                    )}
                  </div>
                </div>
                <Link to="/profile"   onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm bg-dark-700 text-slate-300 hover:text-white hover:bg-dark-600 transition-colors">👤 My Profile</Link>
                <Link to="/settings"  onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm bg-dark-700 text-slate-300 hover:text-white hover:bg-dark-600 transition-colors">⚙ Settings</Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm bg-dark-700 text-slate-300 hover:text-white hover:bg-dark-600 transition-colors">📋 My History</Link>
                <button onClick={handleLogout} className="px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 border border-dark-600 transition-colors">↩ Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={openLogin}    className="px-4 py-2.5 rounded-lg text-sm bg-dark-700 text-slate-300 hover:text-white hover:bg-dark-600 transition-colors">Login</button>
                <button onClick={openRegister} className="px-4 py-2.5 rounded-lg text-sm bg-accent-purple hover:bg-accent-violet text-white transition-colors">Sign Up Free</button>
              </>
            )}
          </div>
        )}
      </nav>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
}
