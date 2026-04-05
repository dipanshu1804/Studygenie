import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Stats {
  totalQuestions: number;
  bookmarked: number;
  rated: number;
  avgRating: number | null;
  streak: number;
  joinedDate: string;
  subjectBreakdown: Record<string, number>;
}

export default function ProfilePage() {
  const { user, updateName } = useAuth();

  // Redirect guests
  if (!user) return <Navigate to="/" replace />;

  const [stats, setStats]             = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Inline name edit
  const [editing, setEditing]         = useState(false);
  const [nameInput, setNameInput]     = useState(user.name);
  const [savingName, setSavingName]   = useState(false);

  // Password change
  const [currentPw, setCurrentPw]     = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [savingPw, setSavingPw]       = useState(false);
  const [showPw, setShowPw]           = useState(false);

  useEffect(() => {
    api.get('/auth/stats')
      .then((r) => setStats(r.data))
      .catch(() => toast.error('Could not load stats'))
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Handlers ──────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!nameInput.trim() || nameInput.trim() === user.name) {
      setEditing(false);
      setNameInput(user.name);
      return;
    }
    setSavingName(true);
    try {
      const res = await api.patch('/auth/profile', { name: nameInput.trim() });
      updateName(res.data.user.name);
      setEditing(false);
      toast.success('Name updated!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to update name';
      toast.error(msg);
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('New passwords do not match'); return; }
    if (newPw.length < 6)    { toast.error('Password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      await api.patch('/auth/password', { currentPassword: currentPw, newPassword: newPw });
      toast.success('Password updated successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setSavingPw(false);
    }
  };

  // ── Derived ───────────────────────────────────────────────────
  const avatar    = user.name.charAt(0).toUpperCase();
  const joinedStr = stats?.joinedDate
    ? new Date(stats.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null;

  const sortedSubjects = stats
    ? Object.entries(stats.subjectBreakdown).sort((a, b) => b[1] - a[1])
    : [];
  const maxSubjectCount = sortedSubjects[0]?.[1] || 1;

  const inputCls = 'w-full bg-dark-700 border border-dark-500 focus:border-accent-purple rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none transition-colors';

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-28 pb-16">
        <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

        {/* ── PROFILE CARD ──────────────────────────────────── */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-light flex items-center justify-center text-white font-black text-3xl shrink-0 shadow-lg shadow-accent-purple/30">
              {avatar}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name (inline edit) */}
              {editing ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') { setEditing(false); setNameInput(user.name); }
                    }}
                    className="bg-dark-700 border border-accent-purple rounded-lg px-3 py-1.5 text-white text-lg font-bold focus:outline-none w-48"
                  />
                  <button
                    data-ripple
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="px-3 py-1.5 rounded-lg bg-accent-purple hover:bg-accent-violet text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {savingName ? '…' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setNameInput(user.name); }}
                    className="px-3 py-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 text-slate-400 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1 group">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <button
                    onClick={() => { setEditing(true); setNameInput(user.name); }}
                    title="Edit name"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-accent-light text-sm p-1 rounded"
                  >
                    ✏
                  </button>
                </div>
              )}
              <p className="text-slate-400 text-sm">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                {joinedStr && <span>📅 Member since {joinedStr}</span>}
                {user.streak >= 1 && (
                  <span className="text-orange-400 font-semibold">
                    🔥 {user.streak} day streak
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS CARDS ────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Questions Asked', value: stats?.totalQuestions ?? '—', icon: '❓' },
            { label: 'Bookmarked',       value: stats?.bookmarked ?? '—',       icon: '★' },
            { label: 'Study Streak',     value: stats?.streak != null ? `${stats.streak}d` : '—', icon: '🔥' },
            { label: 'Avg Rating',       value: stats?.avgRating != null ? `${stats.avgRating}/5` : '—', icon: '⭐' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-dark-800 border border-dark-600 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {statsLoading ? <span className="text-dark-500 animate-pulse">…</span> : value}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ── SUBJECT BREAKDOWN ──────────────────────────────── */}
        {sortedSubjects.length > 0 && (
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-base mb-4">📊 Subject Breakdown</h2>
            <div className="space-y-3">
              {sortedSubjects.map(([subject, count]) => (
                <div key={subject} className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-28 shrink-0 truncate">{subject}</span>
                  <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-purple to-accent-light rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxSubjectCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs w-6 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHANGE PASSWORD ────────────────────────────────── */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <h2 className="text-white font-bold text-base mb-5">🔐 Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className={inputCls}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">New Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="At least 6 characters"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Confirm New Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                className={`${inputCls} ${confirmPw && confirmPw !== newPw ? 'border-red-500' : ''}`}
                required
              />
              {confirmPw && confirmPw !== newPw && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-slate-500 text-xs cursor-pointer select-none">
                <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="accent-accent-purple" />
                Show passwords
              </label>
              <button
                data-ripple
                type="submit"
                disabled={savingPw || !currentPw || !newPw || !confirmPw || newPw !== confirmPw}
                className="px-5 py-2 rounded-xl bg-accent-purple hover:bg-accent-violet text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPw ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
