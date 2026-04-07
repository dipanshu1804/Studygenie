import {
  useState, useEffect, useRef, useCallback,
  FormEvent, KeyboardEvent,
} from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResponseCard from '../components/ResponseCard';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS } from '../utils/subjects';
import { SUBJECT_CONTENT, DIFFICULTY_META } from '../data/subjectContent';
import api from '../utils/api';

const MAX_CHARS = 500;
const WARN_THRESHOLD = 450;
const DRAFT_KEY = 'sg_draft';

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

const THINKING_PHRASES = ['Thinking...', 'Analyzing...', 'Generating...', 'Almost done...'];

const STATS_ITEMS = [
  'GPT-4o-mini Powered',
  '9 Academic Subjects',
  'Step-by-Step Answers',
  'Free Forever',
  'No Ads',
  'Dark & Light Theme',
  'Mobile Friendly',
  'Bookmark Answers',
  'Follow-up Questions',
  'Study Streak Tracker',
];

const SUBJECT_SHOWCASE = [
  {
    value: 'Mathematics', emoji: '📐', color: 'from-blue-600/15 to-indigo-600/15',
    border: 'border-blue-500/20', accent: 'text-blue-400',
    examples: ['Solve: 2x² + 5x − 3 = 0', 'Explain differentiation'],
  },
  {
    value: 'Programming', emoji: '💻', color: 'from-emerald-600/15 to-teal-600/15',
    border: 'border-emerald-500/20', accent: 'text-emerald-400',
    examples: ['Explain recursion with an example', 'What is Big O notation?'],
  },
  {
    value: 'Science', emoji: '🔬', color: 'from-cyan-600/15 to-sky-600/15',
    border: 'border-cyan-500/20', accent: 'text-cyan-400',
    examples: ['What is photosynthesis?', "Explain Newton's laws"],
  },
  {
    value: 'Physics', emoji: '⚛️', color: 'from-violet-600/15 to-purple-600/15',
    border: 'border-violet-500/20', accent: 'text-violet-400',
    examples: ['What is Ohm\'s law?', 'Explain quantum entanglement'],
  },
  {
    value: 'Chemistry', emoji: '🧪', color: 'from-orange-600/15 to-amber-600/15',
    border: 'border-orange-500/20', accent: 'text-orange-400',
    examples: ['What is a covalent bond?', 'Explain oxidation-reduction'],
  },
  {
    value: 'Biology', emoji: '🧬', color: 'from-rose-600/15 to-pink-600/15',
    border: 'border-rose-500/20', accent: 'text-rose-400',
    examples: ['How does DNA replication work?', 'Explain cell division'],
  },
  {
    value: 'History', emoji: '📜', color: 'from-yellow-600/15 to-amber-600/15',
    border: 'border-yellow-500/20', accent: 'text-yellow-400',
    examples: ['Causes of World War I', 'What was the Renaissance?'],
  },
  {
    value: 'English', emoji: '📝', color: 'from-fuchsia-600/15 to-pink-600/15',
    border: 'border-fuchsia-500/20', accent: 'text-fuchsia-400',
    examples: ['Explain metaphors vs similes', 'How to structure an essay?'],
  },
  {
    value: 'General', emoji: '💡', color: 'from-slate-600/15 to-slate-700/15',
    border: 'border-slate-500/20', accent: 'text-slate-400',
    examples: ['How does the internet work?', 'Explain machine learning'],
  },
];

const TESTIMONIALS = [
  {
    text: 'StudyGenie helped me understand recursion in 5 minutes! The step-by-step breakdown was exactly what I needed.',
    author: 'CS Student',
    initial: 'C',
    color: 'bg-accent-purple',
    stars: 5,
  },
  {
    text: 'Finally understand integration after using this. The explanations are way clearer than my textbook.',
    author: 'Engineering Student',
    initial: 'E',
    color: 'bg-emerald-600',
    stars: 5,
  },
  {
    text: 'Best tool for last-minute exam prep. I just type my doubt and get a perfect answer instantly.',
    author: 'Science Student',
    initial: 'S',
    color: 'bg-blue-600',
    stars: 5,
  },
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
  const location     = useLocation();
  const navigate     = useNavigate();
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const templateRef  = useRef<HTMLDivElement>(null);
  const formRef      = useRef<HTMLDivElement>(null);
  const hiwRef       = useRef<HTMLElement>(null);
  const showcaseRef  = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLElement>(null);

  // Form state
  const [question, setQuestion]           = useState('');
  const [subject, setSubject]             = useState('General');
  const [loading, setLoading]             = useState(false);
  const [result, setResult]               = useState<QueryResult | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [showAuth, setShowAuth]           = useState(false);
  const [authMode, setAuthMode]           = useState<'login' | 'register'>('register');
  const [showTemplates, setShowTemplates] = useState(false);
  const [draft, setDraft]                 = useState<{ question: string; subject: string } | null>(null);

  // Hero state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseKey, setPhraseKey]     = useState(0);
  const [count, setCount]             = useState(0);

  // Scroll-reveal visibility flags
  const [hiwVisible, setHiwVisible]             = useState(false);
  const [showcaseVisible, setShowcaseVisible]   = useState(false);
  const [testimonialVisible, setTestimonialVisible] = useState(false);

  // Animation states
  const [thinkingIndex, setThinkingIndex]     = useState(0);
  const [bouncingSubject, setBouncingSubject] = useState<string | null>(null);
  const [counterShake, setCounterShake]       = useState(false);

  // Subject info modal
  const [subjectModalId, setSubjectModalId]   = useState<string | null>(null);

  // ── Animated counter (ease-out cubic) ──────────────────────────
  useEffect(() => {
    const target = 10000;
    const duration = 1800;
    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(target);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Cycling hero phrases ─────────────────────────────────────────
  const advancePhrase = useCallback(() => {
    setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length);
    setPhraseKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = setInterval(advancePhrase, 3000);
    return () => clearInterval(id);
  }, [advancePhrase]);

  // ── Thinking text cycle ──────────────────────────────────────────
  useEffect(() => {
    if (!loading) { setThinkingIndex(0); return; }
    const id = setInterval(() => setThinkingIndex((i) => (i + 1) % THINKING_PHRASES.length), 2000);
    return () => clearInterval(id);
  }, [loading]);

  // ── Intersection Observer for scroll-reveal sections ─────────────
  useEffect(() => {
    const makeObs = (setter: (v: boolean) => void) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true); }, { threshold: 0.1 });

    const obsHiw  = makeObs(setHiwVisible);
    const obsShow = makeObs(setShowcaseVisible);
    const obsTest = makeObs(setTestimonialVisible);

    if (hiwRef.current)        obsHiw.observe(hiwRef.current);
    if (showcaseRef.current)   obsShow.observe(showcaseRef.current);
    if (testimonialRef.current) obsTest.observe(testimonialRef.current);

    return () => { obsHiw.disconnect(); obsShow.disconnect(); obsTest.disconnect(); };
  }, []);

  // ── Prefill from SubjectPage navigation (legacy prefill key) ────
  useEffect(() => {
    const prefill = (location.state as { prefill?: { question: string; subject: string } } | null)?.prefill;
    if (!prefill) return;
    if (prefill.subject) setSubject(prefill.subject);
    if (prefill.question) setQuestion(prefill.question);
    window.history.replaceState({}, '');
    if (prefill.question) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        textareaRef.current?.focus();
      }, 300);
    }
  }, []);

  // ── Prefill from SubjectPage navigation (direct state format) ───
  useEffect(() => {
    const state = location.state as { question?: string; subject?: string } | null;
    if (!state) return;
    if (state.subject) setSubject(state.subject);
    if (state.question) setQuestion(state.question);
    window.history.replaceState({}, '');
    if (state.question) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        textareaRef.current?.focus();
      }, 300);
    }
  }, [location.state]);

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

  // ── Draft: auto-save (1s debounce) ──────────────────────────────
  useEffect(() => {
    if (!question.trim()) return;
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ question, subject }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [question, subject]);

  // ── Ctrl+K: focus textarea ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); textareaRef.current?.focus(); }
      if (e.key === 'Escape') setSubjectModalId(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ── Close templates on outside click ────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (templateRef.current && !templateRef.current.contains(e.target as Node))
        setShowTemplates(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────
  const clearDraft = () => { localStorage.removeItem(DRAFT_KEY); setDraft(null); };
  const restoreDraft = () => {
    if (!draft) return;
    setQuestion(draft.question);
    setSubject(draft.subject);
    clearDraft();
    textareaRef.current?.focus();
  };

  const selectSubject = (val: string) => {
    setSubject(val);
    setBouncingSubject(val);
    setTimeout(() => setBouncingSubject(null), 400);
  };

  const scrollToForm = (subjectValue?: string) => {
    if (subjectValue) selectSubject(subjectValue);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => textareaRef.current?.focus(), 400);
    }, 50);
  };

  const applyStreak = (streak: number | null | undefined) => {
    if (streak == null) return;
    updateStreak(streak);
    const msg = STREAK_MILESTONES[streak];
    if (msg) toast.success(msg, { duration: 4000 });
  };

  const handleQuestionChange = (val: string) => {
    if (val.length > MAX_CHARS) {
      setCounterShake(true);
      setTimeout(() => setCounterShake(false), 400);
      return;
    }
    setQuestion(val);
    if (error) setError(null);
  };

  const isSubmitting = useRef(false);

  const submitQuestion = async () => {
    if (isSubmitting.current) return;
    if (!question.trim()) { setError('Please enter your question'); return; }
    isSubmitting.current = true;
    setLoading(true); setError(null); setResult(null); clearDraft();
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
      isSubmitting.current = false;
    }
  };

  const handleSubmit  = (e: FormEvent)                       => { e.preventDefault(); submitQuestion(); };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); submitQuestion(); }
  };
  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setQuestion(tpl.text); setSubject(tpl.subject);
    setShowTemplates(false); setError(null);
    textareaRef.current?.focus();
  };

  const charCount    = question.length;
  const isNearLimit  = charCount >= WARN_THRESHOLD;

  // Build duplicate items for seamless marquee loop
  const marqueeItems = [...STATS_ITEMS, ...STATS_ITEMS];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-28 pb-10 text-center">
        {/* AI badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-light text-xs font-medium mb-6 animate-fade-in-down">
          ✨ Powered by GPT-4o-mini
        </div>

        {/* Animated counter */}
        <div className="mb-4">
          <span className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-accent-purple via-accent-violet to-accent-light bg-clip-text text-transparent tabular-nums">
            {count.toLocaleString()}+
          </span>
          <p className="text-slate-400 text-base mt-1 font-medium">Questions Answered</p>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Got a doubt?{' '}
          <span className="bg-gradient-to-r from-accent-purple to-accent-light bg-clip-text text-transparent">
            Ask StudyGenie
          </span>
        </h1>

        {/* Cycling subtitle */}
        <div className="h-7 overflow-hidden relative mb-8">
          <p key={phraseKey} className="hero-phrase text-slate-400 text-lg absolute inset-x-0">
            {HERO_PHRASES[phraseIndex]}
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: '⚡', label: 'Instant AI Answers' },
            { icon: '📚', label: '9 Subjects' },
            { icon: '🔒', label: 'Free to Use' },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-dark-700 border border-dark-500 text-slate-300 text-sm font-medium"
            >
              {icon} {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS MARQUEE BAR ───────────────────────────────────── */}
      <div className="border-y border-dark-600 bg-dark-800/60 overflow-hidden py-3 mb-10">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-slate-400 text-sm font-medium px-6 whitespace-nowrap">{item}</span>
              <span className="text-dark-500 text-xs select-none">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FORM SECTION ─────────────────────────────────────────── */}
      <div ref={formRef} className="max-w-3xl mx-auto px-4 pb-12">
        {/* Draft Banner */}
        {draft && !question && (
          <div className="flex items-center justify-between gap-3 bg-dark-800 border border-accent-purple/30 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-accent-purple text-sm shrink-0">📝</span>
              <p className="text-slate-300 text-sm truncate">
                Unsaved draft:{' '}
                <span className="text-slate-400 italic">
                  "{draft.question.slice(0, 60)}{draft.question.length > 60 ? '…' : ''}"
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button data-ripple onClick={restoreDraft} className="px-3 py-1 rounded-lg text-xs bg-accent-purple hover:bg-accent-violet text-white transition-colors">
                Restore
              </button>
              <button onClick={clearDraft} className="px-3 py-1 rounded-lg text-xs bg-dark-700 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors">
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
              <div className="relative" ref={templateRef}>
                <button
                  type="button"
                  onClick={() => setShowTemplates((p) => !p)}
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
                <div key={s.value} className="relative group/sub inline-flex">
                  <button
                    type="button"
                    onClick={() => selectSubject(s.value)}
                    className={`pl-3 pr-7 py-1.5 rounded-lg text-sm transition-colors ${
                      bouncingSubject === s.value ? 'spring-bounce' : ''
                    } ${
                      subject === s.value
                        ? 'bg-accent-purple text-white border border-accent-purple'
                        : 'bg-dark-700 text-slate-400 hover:text-white border border-dark-500 hover:border-dark-400'
                    }`}
                  >
                    {s.emoji} {s.label}
                  </button>
                  {/* Info icon — navigates to subject page on hover */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(`/subject/${s.value}`); }}
                    title={`Learn about ${s.label}`}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover/sub:opacity-100"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
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
              className={`input-glow w-full bg-dark-700 border rounded-xl px-4 py-3 text-white placeholder-slate-600 transition-colors resize-none disabled:opacity-60 ${
                error ? 'border-red-500' : 'border-dark-500 focus:border-accent-purple'
              }`}
              placeholder="e.g. Explain the difference between stack and heap memory in C++..."
            />
            <div className="flex items-center justify-between mt-1">
              {error ? <p className="text-red-400 text-xs">{error}</p> : <span />}
              <span className={`text-xs ml-auto ${counterShake ? 'counter-shake' : isNearLimit ? 'text-red-400' : 'text-slate-600'}`}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </div>

          <button
            data-ripple
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-violet hover:from-accent-violet hover:to-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all shadow-lg shadow-accent-purple/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="thinking-dot" />
                <span className="thinking-dot" />
                <span className="thinking-dot" />
                <span key={thinkingIndex} className="thinking-label ml-1 text-white/90 text-sm font-normal">
                  {THINKING_PHRASES[thinkingIndex]}
                </span>
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

        {/* Signup banner (guests only, below form) */}
        {!user && (
          <div className="flex items-center justify-between gap-4 bg-accent-purple/10 border border-accent-purple/25 rounded-2xl px-6 py-4 mt-6">
            <div>
              <p className="text-white font-semibold text-sm">Sign in to save your question history</p>
              <p className="text-slate-400 text-xs mt-0.5">Bookmark answers, rate responses, and track your learning</p>
            </div>
            <button
              data-ripple
              type="button"
              onClick={() => { setAuthMode('register'); setShowAuth(true); }}
              className="shrink-0 px-4 py-2 rounded-xl text-sm bg-accent-purple hover:bg-accent-violet text-white font-medium transition-colors"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section ref={hiwRef} className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-accent-light text-sm font-semibold uppercase tracking-widest mb-2">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            From doubt to understanding in three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              num: '01', icon: '✏️', title: 'Type Your Question',
              desc: 'Ask anything in plain English — no need for perfect phrasing or technical jargon.',
              delay: 0,
            },
            {
              num: '02', icon: '📚', title: 'Choose Your Subject',
              desc: 'Select from 9 subjects so the AI gives subject-specific, accurate answers.',
              delay: 150,
            },
            {
              num: '03', icon: '💡', title: 'Get Instant Answer',
              desc: 'Receive structured step-by-step explanations in seconds, ready to learn from.',
              delay: 300,
            },
          ].map(({ num, icon, title, desc, delay }) => (
            <div
              key={num}
              className={`hiw-card relative bg-dark-800 border border-dark-600 rounded-2xl p-7 overflow-hidden group hover:border-accent-purple/40 hover:-translate-y-1 transition-all duration-300 ${hiwVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              {/* Big background number */}
              <span className="absolute -top-2 -right-2 text-8xl font-black text-dark-600 select-none pointer-events-none group-hover:text-dark-500 transition-colors leading-none">
                {num}
              </span>
              <div className="relative z-10">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECT SHOWCASE ─────────────────────────────────────── */}
      <section ref={showcaseRef} className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-accent-light text-sm font-semibold uppercase tracking-widest mb-2">Explore Topics</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">What Can You Ask?</h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            Click any subject to jump straight to the form and start asking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECT_SHOWCASE.map(({ value, emoji, color, border, accent, examples }, i) => (
            <div
              key={value}
              className={`hiw-card group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-5 cursor-pointer hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 ${showcaseVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 60}ms` }}
              onClick={() => scrollToForm(value)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{emoji}</span>
                <h3 className="text-white font-bold">{value}</h3>
              </div>
              <ul className="space-y-1.5 mb-4">
                {examples.map((ex) => (
                  <li key={ex} className="text-slate-400 text-xs flex items-start gap-1.5">
                    <span className={`${accent} shrink-0 mt-0.5`}>›</span>
                    {ex}
                  </li>
                ))}
              </ul>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${accent}`}>
                  Try it →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section ref={testimonialRef} className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-accent-light text-sm font-semibold uppercase tracking-widest mb-2">Student Voices</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">What Students Say</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ text, author, initial, color, stars }, i) => (
            <div
              key={author}
              className={`hiw-card bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-dark-500 transition-all duration-300 ${testimonialVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: stars }).map((_, si) => (
                  <span key={si} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-5">"{text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {initial}
                </div>
                <span className="text-slate-400 text-sm font-medium">— {author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUIZ CTA BANNER ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-accent-purple/20 via-dark-700 to-dark-800 border border-accent-purple/30 rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Decorative background glow */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-accent-purple/10 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent-light mb-2">
              🧠 NEW FEATURE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
              Test Yourself with AI-Generated Quizzes
            </h2>
            <p className="text-slate-400 text-sm max-w-md">
              Choose a subject, pick difficulty, and instantly get a custom MCQ quiz.
              Track your score, review wrong answers, and master any topic.
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {['5 or 10 questions', 'Easy / Medium / Hard', 'Instant explanations'].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-xs text-slate-400 bg-dark-600/60 px-2.5 py-1 rounded-full border border-dark-500">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/quiz"
            className="relative z-10 shrink-0 px-6 py-3 rounded-xl bg-accent-purple hover:bg-accent-violet text-white font-bold text-sm transition-colors shadow-lg shadow-accent-purple/30 whitespace-nowrap"
          >
            Try a Quiz →
          </Link>
        </div>
      </section>

      <Footer />

      {/* ── Subject Info Modal ──────────────────────────────────────── */}
      {subjectModalId && (() => {
        const info = SUBJECT_CONTENT[subjectModalId];
        if (!info) return null;
        const diff = DIFFICULTY_META[info.difficulty];

        const applyModalPrefill = (q: string, subj: string) => {
          setSubjectModalId(null);
          selectSubject(subj);
          setQuestion(q);
          setError(null);
          setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            textareaRef.current?.focus();
          }, 100);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/65 backdrop-blur-sm"
              onClick={() => setSubjectModalId(null)}
            />
            {/* Panel */}
            <div className="relative z-10 bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in-up">

              {/* Header */}
              <div className={`bg-gradient-to-br ${info.color} border-b border-dark-600 rounded-t-2xl px-6 py-5 flex items-center gap-4`}>
                <span className="text-4xl">{info.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{info.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${diff.bg} ${diff.color}`}>
                      {info.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{info.description}</p>
                </div>
                <button
                  onClick={() => setSubjectModalId(null)}
                  className="shrink-0 w-7 h-7 rounded-lg bg-dark-700/60 hover:bg-dark-600 text-slate-400 hover:text-white transition-colors flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">

                {/* Topics */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">
                    Topics Covered <span className="text-slate-500 font-normal">(click to ask)</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {info.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => applyModalPrefill(`Explain ${topic} in detail with examples`, info.name)}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-all hover:scale-105 ${info.border} ${info.accent} bg-dark-700 hover:bg-dark-600`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular questions */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">
                    Popular Questions <span className="text-slate-500 font-normal">(click to fill form)</span>
                  </h3>
                  <div className="space-y-2">
                    {info.popularQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => applyModalPrefill(q, info.name)}
                        className="w-full text-left flex items-start gap-2.5 p-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-accent-purple/30 transition-all group"
                      >
                        <span className={`shrink-0 font-bold text-xs mt-0.5 ${info.accent}`}>{i + 1}.</span>
                        <span className="text-slate-300 text-xs group-hover:text-white transition-colors leading-relaxed">{q}</span>
                        <span className="shrink-0 text-slate-600 group-hover:text-accent-light transition-colors text-xs ml-auto pl-2">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Study Tips</h3>
                  <ol className="space-y-2">
                    {info.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-accent-purple/30 border border-accent-purple/40 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-slate-400 text-xs leading-relaxed">{tip}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-dark-600 flex items-center justify-between gap-3">
                <button
                  onClick={() => { setSubjectModalId(null); navigate(`/subject/${info.name}`); }}
                  className="text-accent-light text-xs hover:underline"
                >
                  View full page →
                </button>
                <button
                  data-ripple
                  onClick={() => { setSubjectModalId(null); selectSubject(info.name); scrollToForm(); }}
                  className="px-4 py-2 rounded-xl bg-accent-purple hover:bg-accent-violet text-white text-sm font-semibold transition-colors"
                >
                  ✦ Start Asking
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
