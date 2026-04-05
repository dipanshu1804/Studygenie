import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  onAuthClick: (mode: 'login' | 'register') => void
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ink-700/50 backdrop-blur-xl bg-ink-950/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-sage-500/20 border border-sage-500/30 flex items-center justify-center group-hover:bg-sage-500/30 transition-colors">
              <span className="text-sage-400 text-sm font-bold font-mono">SG</span>
            </div>
            <span className="font-display font-semibold text-lg text-white">
              Study<span className="text-sage-400">Genie</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') ? 'bg-ink-700 text-white' : 'text-gray-400 hover:text-white hover:bg-ink-800'
              }`}
            >
              Ask a Doubt
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard') ? 'bg-ink-700 text-white' : 'text-gray-400 hover:text-white hover:bg-ink-800'
                }`}
              >
                My History
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-800 border border-ink-600 hover:border-sage-500/40 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-sage-500/30 flex items-center justify-center">
                    <span className="text-sage-400 text-xs font-semibold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:block max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-ink-800 border border-ink-600 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-ink-600">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-ink-700 transition-colors"
                      onClick={() => setAvatarOpen(false)}
                    >
                      <span>📚</span> My History
                    </Link>
                    <button
                      onClick={() => { logout(); setAvatarOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-coral-400 hover:bg-ink-700 transition-colors"
                    >
                      <span>→</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAuthClick('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="px-4 py-2 text-sm font-medium bg-sage-500 hover:bg-sage-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-sage-500/20"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-ink-700 py-3 space-y-1 animate-fade-in">
            <Link to="/" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-ink-800 rounded-lg" onClick={() => setMenuOpen(false)}>Ask a Doubt</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-ink-800 rounded-lg" onClick={() => setMenuOpen(false)}>My History</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
