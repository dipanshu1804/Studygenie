import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import ShortcutsModal from './ShortcutsModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll shadow state
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Global Ctrl+/ shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') { e.preventDefault(); setShowShortcuts((p) => !p); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleLogout   = () => { logout(); navigate('/'); setMenuOpen(false); };
  const openLogin      = () => { setAuthMode('login');    setShowAuth(true);  setMenuOpen(false); };
  const openRegister   = () => { setAuthMode('register'); setShowAuth(true);  setMenuOpen(false); };

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-light flex items-center justify-center text-white font-bold text-sm shadow-md shadow-accent-purple/30 group-hover:shadow-accent-purple/50 transition-shadow">
              SG
            </div>
            <span className="font-bold text-lg text-white group-hover:text-accent-light transition-colors">
              StudyGenie
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Keyboard shortcuts icon */}
            <button
              onClick={() => setShowShortcuts(true)}
              aria-label="Open keyboard shortcuts (Ctrl+/)"
              title="Keyboard shortcuts (Ctrl+/)"
              className="text-slate-500 hover:text-slate-300 transition-colors text-base px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple rounded"
            >
              ⌨
            </button>

            {user ? (
              <>
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  Hi,{' '}
                  <span className="text-accent-light font-medium nav-link">
                    {user.name.split(' ')[0]}
                  </span>
                  {user.streak >= 2 && (
                    <span className="text-orange-400 font-semibold text-xs bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded-full">
                      🔥 {user.streak}
                    </span>
                  )}
                </span>
                <Link
                  to="/dashboard"
                  className="nav-link px-4 py-1.5 rounded-lg text-sm bg-dark-600 hover:bg-dark-500 text-slate-300 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-lg text-sm bg-dark-700 hover:bg-red-900/40 text-slate-400 hover:text-red-400 border border-dark-500 hover:border-red-800 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="nav-link px-4 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-dark-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple"
                >
                  Login
                </button>
                <button
                  onClick={openRegister}
                  className="px-4 py-1.5 rounded-lg text-sm bg-accent-purple hover:bg-accent-violet text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple shadow-md shadow-accent-purple/20"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile: shortcuts + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setShowShortcuts(true)}
              aria-label="Open keyboard shortcuts"
              className="text-slate-500 hover:text-slate-300 transition-colors text-base px-1"
            >
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-dark-600 bg-dark-900/95 backdrop-blur-md px-4 py-3 flex flex-col gap-2 animate-fade-in-down">
            {user ? (
              <>
                <p className="text-slate-500 text-xs px-2 py-1">
                  Signed in as <span className="text-accent-light">{user.name}</span>
                  {user.streak >= 2 && <span className="ml-2 text-orange-400">🔥 {user.streak}</span>}
                </p>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm bg-dark-700 text-slate-300 hover:text-white hover:bg-dark-600 transition-colors text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 border border-dark-600 transition-colors"
                >
                  Logout
                </button>
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
