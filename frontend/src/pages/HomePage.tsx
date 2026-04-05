import { useState, useEffect, useRef, useCallback, FormEvent, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ResponseCard from '../components/ResponseCard';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS } from '../utils/subjects';
import api from '../utils/api';

const MAX_CHARS = 500;
const WARN_THRESHOLD = 450;
const DRAFT_KEY = 'sg_draft';

const EXAMPLE_QUESTIONS = [
  { question: 'Explain recursion in programming with an example', subject: 'Programming' },
  { question: 'Solve: if 2x + 5 = 13, find x', subject: 'Mathematics' },
  { question: "What is Newton's second law of motion?", subject: 'Physics' },
];

const TEMPLATES = [
  { subject: 'Mathematics', emoji: '📐', text: 'Solve step by step: [your equation here]' },
  { subject: 'Programming', emoji: '💻', text: 'Explain this code and what it does:\n\n[paste code here]' },
  { subject: 'Science',     emoji: '🔬', text: 'Explain the concept of [topic] with a real world example' },
  { subject: 'Physics',     emoji: '⚛️', text: 'Explain [law/concept] with a practical example and its formula' },
  { subject: 'Biology',     emoji: '🧬', text: 'Describe the process of [biological process] step by step' },
  { subject: 'History',     emoji: '📜', text: 'What were the causes and effects of [event]?' },
];

const HERO_PHRASES = [
  'Ask anything about Mathematics...',
  'Get help with Programming...',
  'Understand Science concepts...',
  'Explore History topics...',
  'Solve Physics problems...',
];

const STREAK_MILESTONES: Record<number, string> = {
  3:  '🔥 3 day streak! Keep it up!',
  7:  "🔥 7 day streak! You're on fire!",
  14: '🔥 14 day streak! Incredible focus!',
  30: '🔥 30 day streak! Absolute legend!',
};

interface QueryResult {
  queryId: string | null;
  question: string;
  subject: string;
  response: string;
}

export default function HomePage() {
  const { user, updateStreak } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion]         = useState('');
  const [subject, setSubject]           = useState('General');
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState<QueryResult | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [showAuth, setShowAuth]         = useState(false);
  const [authMode, setAuthMode]         = useState<'login' | 'register'>('register');
  const [showTemplates, setShowTemplates] = useState(false);
  const [draft, setDraft]               = useState<{ question: string; subject: string } | null>(null);
  const [phraseIndex, setPhraseIndex]   = useState(0);
  const [phraseKey, setPhraseKey]       = useState(0); // force re-mount for animation restart

  // ── Cycling hero phrases ─────────────────────────────────────────
  const advancePhrase = useCallback(() => {
    setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length);
    setPhraseKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = setInterval(advancePhrase, 3000);
    return () => clearInterval(id);
  }, [advancePhrase]);

  // ── Draft: load on mount ─────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.question?.trim()) setDraft(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // ── Draft: save on question change (1s debounce) ─────────────────
  useEffect(() => {
    if (!question.trim()) return;
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ question, subject }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [question, subject]);

  // ── Ctrl+K: focus textarea ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ── Close templates dropdown on outside click ─────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (templateRef.current && !templateRef.current.contains(e.target as Node)) {
        setShowTemplates(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
  };

  const restoreDraft = () => {
    if (!draft) return;
    setQuestion(draft.question);
    setSubject(draft.subject);
    clearDraft();
    textareaRef.current?.focus();
  };

  const applyStreak = (streak: number | null | undefined) => {
    if (streak == null) return;
    updateStreak(streak);
    const msg = STREAK_MILESTONES[streak];
    if (msg) toast.success(msg, { duration: 4000 });
  };

  const handleQuestionChange = (val: string) => {
    if (val.length <= MAX_CHARS) setQuestion(val);
    if (error) setError(null);
  };

  const submitQuestion = async () => {
    if (!question.trim()) { setError('Please enter your question'); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    clearDraft();
    try {
      const res = await api.post('/query/ask', { question: question.trim(), subject });
      setResult({ queryId: res.data.queryId, question: question.trim(), subject, response: res.data.response });
      applyStreak(res.data.streak);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Failed to get answer. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); submitQuestion(); };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); submitQuestion(); }
  };

  const fillExample = (ex: typeof EXAMPLE_QUESTIONS[number]) => {
    setQuestion(ex.question);
    setSubject(ex.subject);
    setError(null);
  };

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setQuestion(tpl.text);
    setSubject(tpl.subject);
    setShowTemplates(false);
    setError(null);
    textareaRef.current?.focus();
  };

  const charCount = question.length;
  const isNearLimit = charCount >= WARN_THRESHOLD;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-light text-xs font-medium mb-4">
            ✨ Powered by GPT-4o-mini
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Got a doubt?{' '}
            <span className="bg-gradient-to-r from-accent-purple to-accent-light bg-clip-text text-transparent">
              Ask StudyGenie
            </span>
          </h1>
          {/* Cycling subtitle phrase */}
          <div className="h-7 overflow-hidden relative">
            <p
              key={phraseKey}
              className="hero-phrase text-slate-400 text-lg absolute inset-x-0"
            >
              {HERO_PHRASES[phraseIndex]}
            </p>
          </div>
        </div>

        {/* Draft Banner */}
        {draft && !question && (
          <div className="flex items-center justify-between gap-3 bg-dark-800 border border-accent-purple/30 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-accent-purple text-sm shrink-0">📝</span>
              <p className="text-slate-300 text-sm truncate">
                Unsaved draft: <span className="text-slate-400 italic">"{draft.question.slice(0, 60)}{draft.question.length > 60 ? '…' : ''}"</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={restoreDraft}
                className="px-3 py-1 rounded-lg text-xs bg-accent-purple hover:bg-accent-violet text-white transition-colors"
              >
                Restore
              </button>
              <button
                onClick={clearDraft}
                className="px-3 py-1 rounded-lg text-xs bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-8 shadow-xl">
          {/* Subject selector + Templates */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-400">Select Subject</label>
              {/* Templates dropdown */}
              <div className="relative" ref={templateRef}>
                <button
                  type="button"
                  onClick={() => setShowTemplates((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white border border-dark-500 transition-colors"
                >
                  📋 Templates
                  <span className={`transition-transform duration-150 ${showTemplates ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {showTemplates && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-dark-700 border border-dark-500 rounded-xl shadow-xl z-20 overflow-hidden">
                    <p className="text-xs text-slate-500 px-3 pt-3 pb-1">Click a template to fill the question box</p>
                    {TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.subject}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-dark-600 text-left transition-colors group"
                      >
                        <span className="shrink-0 text-sm mt-0.5">{tpl.emoji}</span>
                        <div>
                          <p className="text-xs font-medium text-slate-300 group-hover:text-white">{tpl.subject}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{tpl.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSubject(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    subject === s.value
                      ? 'bg-accent-purple text-white border border-accent-purple'
                      : 'bg-dark-700 text-slate-400 hover:text-white border border-dark-500 hover:border-dark-400'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question input */}
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">
              Your Question
              <span className="text-slate-600 text-xs ml-2 font-normal">Ctrl+K to focus</span>
            </label>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              disabled={loading}
              className={`w-full bg-dark-700 border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors resize-none disabled:opacity-60 ${
                error ? 'border-red-500 focus:border-red-500' : 'border-dark-500 focus:border-accent-purple'
              }`}
              placeholder="e.g. Explain the difference between stack and heap memory in C++..."
            />
            <div className="flex items-center justify-between mt-1">
              {error ? <p className="text-red-400 text-xs">{error}</p> : <span />}
              <span className={`text-xs ml-auto ${isNearLimit ? 'text-red-400' : 'text-slate-600'}`}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-violet hover:from-accent-violet hover:to-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all shadow-lg shadow-accent-purple/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="thinking-dot" />
                <span className="thinking-dot" />
                <span className="thinking-dot" />
              </span>
            ) : '✦ Get Answer'}
          </button>
          <p className="text-center text-xs text-slate-600 mt-2">Press Ctrl+Enter to submit</p>
        </form>

        {/* Result */}
        {result && (
          <div className="animate-fade-in-up">
            <h2 className="text-slate-400 text-sm font-medium mb-3">✦ StudyGenie's Answer</h2>
            <ResponseCard
              queryId={result.queryId}
              question={result.question}
              subject={result.subject}
              response={result.response}
              isNew
            />
          </div>
        )}

        {/* Below-form content — only when no result */}
        {!result && (
          <>
            {/* Example Questions */}
            <div className="mb-8">
              <p className="text-sm text-slate-500 mb-3">Try an example:</p>
              <div className="space-y-2">
                {EXAMPLE_QUESTIONS.map((ex) => {
                  const subjectMeta = SUBJECTS.find((s) => s.value === ex.subject);
                  return (
                    <button
                      key={ex.question}
                      type="button"
                      onClick={() => fillExample(ex)}
                      className="w-full flex items-center gap-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-dark-500 rounded-xl px-4 py-3 text-left transition-all group"
                    >
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-dark-600 text-xs text-slate-400 group-hover:text-slate-300">
                        {subjectMeta?.emoji} {ex.subject}
                      </span>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {ex.question}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: '⚡', title: 'Instant Answers', desc: 'Get AI-generated explanations in seconds' },
                { icon: '📚', title: '9 Subjects', desc: 'From Math to Programming to Biology' },
                { icon: '💾', title: 'Save History', desc: 'Login to bookmark and review past answers' },
              ].map((f) => (
                <div key={f.title} className="bg-dark-800 border border-dark-600 rounded-xl p-4">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
                  <div className="text-slate-500 text-xs">{f.desc}</div>
                </div>
              ))}
            </div>

            {/* How StudyGenie Works */}
            <div className="mb-8">
              <h2 className="text-white font-bold text-lg text-center mb-6">How StudyGenie Works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: '1', icon: '✏️', title: 'Type your question', desc: 'Enter any academic doubt in your own words' },
                  { step: '2', icon: '📖', title: 'Select your subject', desc: 'Pick the subject so the AI focuses its answer' },
                  { step: '3', icon: '💡', title: 'Get instant explanation', desc: 'Receive a clear, step-by-step breakdown' },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="relative bg-dark-800 border border-dark-600 rounded-xl p-5 text-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent-purple text-white text-xs font-bold flex items-center justify-center">
                      {step}
                    </div>
                    <div className="text-3xl mb-2 mt-1">{icon}</div>
                    <div className="text-white font-semibold text-sm mb-1">{title}</div>
                    <div className="text-slate-500 text-xs">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign Up Banner (guests only) */}
            {!user && (
              <div className="flex items-center justify-between gap-4 bg-accent-purple/10 border border-accent-purple/25 rounded-2xl px-6 py-4">
                <div>
                  <p className="text-white font-semibold text-sm">Sign in to save your question history</p>
                  <p className="text-slate-400 text-xs mt-0.5">Bookmark answers, rate responses, and track your learning</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setShowAuth(true); }}
                  className="shrink-0 px-4 py-2 rounded-xl text-sm bg-accent-purple hover:bg-accent-violet text-white font-medium transition-colors"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </div>
  );
}
