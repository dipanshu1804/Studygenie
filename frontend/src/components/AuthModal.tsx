import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Props {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ mode, onClose, onSwitchMode }: Props) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });

  useEffect(() => { setError(null); }, [mode]);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome to StudyGenie');
      } else {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      }
      onClose();
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fixed backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Fixed centered container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">

        {/* Modal card */}
        <div className="relative w-full max-w-md pointer-events-auto bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl overflow-hidden animate-fade-up">

          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage-600 via-sage-400 to-sage-300" />

          {/* Logo */}
          <div className="flex justify-center pt-8 pb-2">
            <img src="/favicon.svg" alt="StudyGenie" className="w-12 h-12 rounded-xl shadow-lg" />
          </div>

          <div className="px-8 pb-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm text-slate-400">
                {mode === 'login'
                  ? 'Sign in to access your question history'
                  : 'Join StudyGenie and start learning smarter'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-ink-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-ink-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-ink-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                    disabled={loading}
                    className="input-field"
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  required
                  disabled={loading}
                  className="input-field"
                  autoFocus={mode === 'login'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder={mode === 'register' ? 'Minimum 6 characters' : '••••••••'}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="input-field"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-sage-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                className="text-sage-400 hover:text-sage-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
