import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const LS = {
  fontSize:    'sg_font_size',
  streakToast: 'sg_show_streak_toast',
  tips:        'sg_show_tips',
};

function Toggle({
  checked, onChange, label, description,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-slate-500 text-xs mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-accent-purple' : 'bg-dark-500'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return <Navigate to="/" replace />;

  const [fontSize,    setFontSizeState]    = useState<'normal' | 'large'>(
    () => (localStorage.getItem(LS.fontSize) as 'normal' | 'large') || 'normal'
  );
  const [streakToast, setStreakToastState] = useState(
    () => localStorage.getItem(LS.streakToast) !== 'false'
  );
  const [tips,        setTipsState]        = useState(
    () => localStorage.getItem(LS.tips) !== 'false'
  );
  const [clearConfirm, setClearConfirm]   = useState(false);
  const [clearing,     setClearing]       = useState(false);
  const [exporting,    setExporting]      = useState(false);

  // Apply font size to body
  useEffect(() => {
    document.body.style.fontSize = fontSize === 'large' ? '18px' : '';
  }, [fontSize]);

  const setFontSize = (v: 'normal' | 'large') => {
    setFontSizeState(v);
    localStorage.setItem(LS.fontSize, v);
  };
  const setStreakToast = (v: boolean) => {
    setStreakToastState(v);
    localStorage.setItem(LS.streakToast, String(v));
  };
  const setTips = (v: boolean) => {
    setTipsState(v);
    localStorage.setItem(LS.tips, String(v));
  };

  // ── Export data ───────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/query/history');
      const queries = res.data.queries || res.data;
      const exportData = {
        exportedAt: new Date().toISOString(),
        user: { name: user.name, email: user.email },
        totalQuestions: queries.length,
        queries: queries.map((q: {
          question: string; subject: string; response: string;
          isBookmarked: boolean; rating: number | null; createdAt: string;
        }) => ({
          question:    q.question,
          subject:     q.subject,
          response:    q.response,
          isBookmarked: q.isBookmarked,
          rating:      q.rating,
          date:        q.createdAt,
        })),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = `studygenie_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  // ── Clear history ─────────────────────────────────────────────
  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await api.delete('/query/all');
      toast.success('All history cleared');
      setClearConfirm(false);
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  // ── Section wrapper ───────────────────────────────────────────
  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-5">
      <h2 className="text-white font-bold text-base flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-28 pb-16 space-y-5">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>

        {/* ── APPEARANCE ────────────────────────────────────── */}
        <Section title="Appearance" icon="🎨">
          {/* Theme */}
          <div>
            <p className="text-white text-sm font-medium mb-3">Theme</p>
            <div className="grid grid-cols-2 gap-3">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { if (theme !== t) toggleTheme(); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    theme === t
                      ? 'border-accent-purple bg-accent-purple/10'
                      : 'border-dark-500 bg-dark-700 hover:border-dark-400'
                  }`}
                >
                  {/* Mini preview */}
                  <div className={`w-full h-10 rounded-lg flex items-center gap-1.5 px-2 ${t === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${t === 'dark' ? 'bg-violet-500' : 'bg-violet-600'}`} />
                    <div className={`flex-1 h-1.5 rounded-full ${t === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />
                  </div>
                  <span className={`text-sm font-semibold capitalize ${theme === t ? 'text-accent-light' : 'text-slate-400'}`}>
                    {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </span>
                  {theme === t && <span className="text-accent-purple text-xs">● Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div className="border-t border-dark-600 pt-4">
            <p className="text-white text-sm font-medium mb-3">Text Size</p>
            <div className="flex gap-3">
              {(['normal', 'large'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFontSize(s)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all capitalize ${
                    fontSize === s
                      ? 'border-accent-purple bg-accent-purple/10 text-accent-light'
                      : 'border-dark-500 bg-dark-700 text-slate-400 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  {s === 'normal' ? 'Aa Normal' : 'Aa Large'}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── NOTIFICATIONS ─────────────────────────────────── */}
        <Section title="Notifications" icon="🔔">
          <Toggle
            checked={streakToast}
            onChange={setStreakToast}
            label="Streak milestone toasts"
            description="Show celebration messages at 3, 7, 14, 30-day streaks"
          />
          <div className="border-t border-dark-600" />
          <Toggle
            checked={tips}
            onChange={setTips}
            label="Tips and suggestions"
            description="Show helpful hints while using the app"
          />
        </Section>

        {/* ── DATA & PRIVACY ────────────────────────────────── */}
        <Section title="Data & Privacy" icon="🗄">
          <div className="flex flex-col gap-3">
            <button
              data-ripple
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-dark-400 text-slate-300 hover:text-white text-sm font-medium transition-all text-left disabled:opacity-50"
            >
              <span className="text-xl">⬇</span>
              <div>
                <p className="font-semibold">Export My Data</p>
                <p className="text-slate-500 text-xs">Download all your questions as a .json file</p>
              </div>
              {exporting && <span className="ml-auto text-accent-light text-xs">Exporting…</span>}
            </button>

            {!clearConfirm ? (
              <button
                type="button"
                onClick={() => setClearConfirm(true)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-dark-700 hover:bg-red-900/20 border border-dark-500 hover:border-red-800/40 text-slate-300 hover:text-red-400 text-sm font-medium transition-all text-left"
              >
                <span className="text-xl">🗑</span>
                <div>
                  <p className="font-semibold">Clear All History</p>
                  <p className="text-slate-500 text-xs">Permanently delete all your saved questions</p>
                </div>
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-3">
                <p className="text-red-400 text-sm font-semibold">⚠ This action cannot be undone.</p>
                <p className="text-slate-400 text-xs">All your questions and answers will be permanently deleted.</p>
                <div className="flex gap-2">
                  <button
                    data-ripple
                    onClick={handleClearHistory}
                    disabled={clearing}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {clearing ? 'Deleting…' : 'Yes, Delete Everything'}
                  </button>
                  <button
                    onClick={() => setClearConfirm(false)}
                    className="flex-1 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-slate-300 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-dark-600 pt-3">
            <p className="text-slate-500 text-xs flex items-center gap-1.5">
              <span className="text-green-400">🔒</span>
              Your data is stored securely in MongoDB Atlas with encrypted passwords
            </p>
          </div>
        </Section>

        {/* ── ABOUT ─────────────────────────────────────────── */}
        <Section title="About" icon="ℹ">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">App</span>
              <span className="text-white font-medium">StudyGenie</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Version</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Stack</span>
              <span className="text-white font-medium">MongoDB · Express · React · Node</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AI Model</span>
              <span className="text-white font-medium">OpenAI GPT-4o-mini</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Author</span>
              <span className="text-white font-medium">Dipanshu Tomar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Institution</span>
              <span className="text-white font-medium text-right max-w-[60%]">Chitkara University, HP</span>
            </div>
            <div className="border-t border-dark-600 pt-3">
              <a
                href="https://github.com/dipanshu1804/Studygenie"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent-light hover:text-accent-violet transition-colors text-xs font-medium"
              >
                <span>⬡</span> View on GitHub →
              </a>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
