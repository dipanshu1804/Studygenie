import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SUBJECTS } from '../utils/subjects';
import api from '../utils/api';

// ── Types ────────────────────────────────────────────────────────
type Step       = 'setup' | 'loading' | 'quiz' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  question:    string;
  options:     string[];
  correct:     number;
  explanation: string;
}

// ── Helpers ──────────────────────────────────────────────────────
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const formatTime = (s: number) => {
  const m   = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const DIFF_META: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy:   { label: 'Easy',   color: 'text-green-400',  bg: 'bg-green-500/15 border-green-500/30' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  hard:   { label: 'Hard',   color: 'text-red-400',    bg: 'bg-red-500/15 border-red-500/30' },
};

const LOADING_PHRASES = [
  'Crafting your questions…',
  'Tuning difficulty…',
  'Adding tricky distractors…',
  'Almost ready…',
];

// ── Component ────────────────────────────────────────────────────
export default function QuizPage() {
  const navigate = useNavigate();

  // Setup
  const [step,       setStep]       = useState<Step>('setup');
  const [subject,    setSubject]    = useState('General');
  const [topic,      setTopic]      = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count,      setCount]      = useState(5);

  // Quiz
  const [questions,        setQuestions]        = useState<QuizQuestion[]>([]);
  const [current,          setCurrent]          = useState(0);
  const [answers,          setAnswers]          = useState<(number | null)[]>([]);
  const [selected,         setSelected]         = useState<number | null>(null);
  const [showExplanation,  setShowExplanation]  = useState(false);
  const [elapsed,          setElapsed]          = useState(0);

  // Results
  const [showReview, setShowReview] = useState(false);

  // Loading phrase cycling
  const [loadingPhrase, setLoadingPhrase] = useState(0);
  const loadingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'quiz') return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [step]);

  // ── Loading phrases ───────────────────────────────────────────
  useEffect(() => {
    if (step === 'loading') {
      loadingRef.current = setInterval(
        () => setLoadingPhrase((i) => (i + 1) % LOADING_PHRASES.length),
        1500,
      );
    } else {
      if (loadingRef.current) clearInterval(loadingRef.current);
      setLoadingPhrase(0);
    }
    return () => { if (loadingRef.current) clearInterval(loadingRef.current); };
  }, [step]);

  // ── Derived ───────────────────────────────────────────────────
  const q            = questions[current];
  const score        = answers.filter((a, i) => a !== null && a === questions[i]?.correct).length;
  const pct          = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const pctColor     = pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';
  const progressPct  = questions.length ? ((current + 1) / questions.length) * 100 : 0;

  // ── Handlers ──────────────────────────────────────────────────
  const handleGenerate = async () => {
    setStep('loading');
    try {
      const res = await api.post('/quiz/generate', { subject, topic: topic.trim(), difficulty, count });
      setQuestions(res.data.questions);
      setAnswers(new Array(res.data.questions.length).fill(null));
      setCurrent(0);
      setSelected(null);
      setShowExplanation(false);
      setElapsed(0);
      setShowReview(false);
      setStep('quiz');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to generate quiz. Please try again.';
      toast.error(msg);
      setStep('setup');
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setStep('results');
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const handleTryAgain = () => {
    handleGenerate();
  };

  const handleNewQuiz = () => {
    setStep('setup');
    setQuestions([]);
    setAnswers([]);
    setSelected(null);
    setShowExplanation(false);
    setShowReview(false);
    setElapsed(0);
  };

  // ── Option button style ────────────────────────────────────────
  const getOptionStyle = (idx: number) => {
    const base = 'w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150';
    if (selected === null) {
      return `${base} bg-dark-700 border-dark-500 text-slate-300 hover:bg-dark-600 hover:border-accent-purple/40 hover:text-white cursor-pointer`;
    }
    if (idx === q.correct) {
      return `${base} bg-green-500/15 border-green-500/50 text-green-300`;
    }
    if (idx === selected && selected !== q.correct) {
      return `${base} bg-red-500/15 border-red-500/50 text-red-300`;
    }
    return `${base} bg-dark-700/50 border-dark-600 text-slate-500 cursor-default`;
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-28 pb-16">

        {/* ── SETUP SCREEN ─────────────────────────────────── */}
        {step === 'setup' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-light text-xs font-medium mb-4">
                🧠 AI-Powered Quiz Generator
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Test Your Knowledge
              </h1>
              <p className="text-slate-500 text-sm">
                Configure your quiz and let AI generate custom questions for you
              </p>
            </div>

            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-6">

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-500 focus:border-accent-purple rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.emoji} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Topic <span className="text-slate-600 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={`e.g. "Recursion", "World War II", "Quadratic Equations"…`}
                  className="w-full bg-dark-700 border border-dark-500 focus:border-accent-purple rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none transition-colors"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
                    const m = DIFF_META[d];
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          difficulty === d ? `${m.bg} ${m.color}` : 'bg-dark-700 border-dark-500 text-slate-400 hover:text-white hover:bg-dark-600'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Count */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Number of Questions</label>
                <div className="flex gap-2">
                  {[5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        count === n
                          ? 'bg-accent-purple/20 border-accent-purple/50 text-accent-light'
                          : 'bg-dark-700 border-dark-500 text-slate-400 hover:text-white hover:bg-dark-600'
                      }`}
                    >
                      {n} Questions
                    </button>
                  ))}
                </div>
              </div>

              <button
                data-ripple
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-violet hover:from-accent-violet hover:to-accent-light text-white font-bold text-base transition-all shadow-lg shadow-accent-purple/25"
              >
                ✦ Generate Quiz
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING SCREEN ───────────────────────────────── */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="relative w-20 h-20">
              <svg className="animate-spin w-20 h-20 text-accent-purple" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15" />
                <path d="M40 4a36 36 0 0 1 36 36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl">🧠</span>
            </div>
            <div className="text-center">
              <p key={loadingPhrase} className="text-white font-semibold text-lg animate-fade-in-up">
                {LOADING_PHRASES[loadingPhrase]}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Generating {count} {DIFF_META[difficulty].label.toLowerCase()} questions on {subject}
              </p>
            </div>
          </div>
        )}

        {/* ── QUIZ SCREEN ──────────────────────────────────── */}
        {step === 'quiz' && q && (
          <div className="animate-fade-in-up">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-slate-400 font-medium">
                Question <span className="text-white font-bold">{current + 1}</span> of {questions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${DIFF_META[difficulty].bg} ${DIFF_META[difficulty].color}`}>
                  {DIFF_META[difficulty].label}
                </span>
                <span className="text-slate-400 font-mono tabular-nums">
                  ⏱ {formatTime(elapsed)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-dark-600 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-accent-light rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Question card */}
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-4">
              <div className="flex items-start gap-3 mb-6">
                <span className="shrink-0 w-8 h-8 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-light font-bold text-sm">
                  Q
                </span>
                <p className="text-white text-base leading-relaxed font-medium pt-1">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className={getOptionStyle(idx)}
                  >
                    <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                      selected === null
                        ? 'border-dark-400 text-slate-500'
                        : idx === q.correct
                          ? 'border-green-500 bg-green-500 text-white'
                          : idx === selected
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-dark-400 text-slate-600'
                    }`}>
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {selected !== null && idx === q.correct && (
                      <span className="text-green-400 shrink-0">✓</span>
                    )}
                    {selected !== null && idx === selected && selected !== q.correct && (
                      <span className="text-red-400 shrink-0">✗</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && q.explanation && (
                <div className="mt-5 p-4 rounded-xl bg-dark-700 border border-dark-500 animate-fade-in-up">
                  <p className="text-xs font-semibold text-accent-light mb-1.5">💡 Explanation</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>

            {/* Next button */}
            {selected !== null && (
              <div className="flex justify-end animate-fade-in-up">
                <button
                  data-ripple
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-violet text-white font-semibold text-sm transition-colors shadow-md shadow-accent-purple/20"
                >
                  {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS SCREEN ───────────────────────────────── */}
        {step === 'results' && (
          <div className="animate-fade-in-up">

            {/* Score hero */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">
                {pct >= 70 ? '🏆' : pct >= 50 ? '📚' : '💪'}
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Quiz Complete!</h1>
              <p className="text-slate-500 text-sm mb-6">
                {subject}{topic ? ` · ${topic}` : ''} · {DIFF_META[difficulty].label} · {formatTime(elapsed)}
              </p>

              {/* Score display */}
              <div className="inline-flex flex-col items-center bg-dark-800 border border-dark-600 rounded-2xl px-10 py-8 mb-6">
                <span className={`text-7xl font-black tabular-nums ${pctColor}`}>
                  {score}<span className="text-4xl text-slate-500">/{questions.length}</span>
                </span>
                <span className={`text-2xl font-bold mt-2 ${pctColor}`}>{pct}%</span>
                <span className="text-slate-500 text-sm mt-1">
                  {pct >= 70 ? 'Excellent work!' : pct >= 50 ? 'Good effort!' : 'Keep practising!'}
                </span>
              </div>

              {/* Stat pills */}
              <div className="flex justify-center gap-4 text-sm mb-8">
                <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                  ✓ {score} Correct
                </div>
                <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  ✗ {questions.length - score} Wrong
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  data-ripple
                  onClick={() => setShowReview((v) => !v)}
                  className="px-5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
                >
                  {showReview ? 'Hide Review' : '📋 Review Answers'}
                </button>
                <button
                  data-ripple
                  onClick={handleTryAgain}
                  className="px-5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
                >
                  🔄 Try Again
                </button>
                <button
                  data-ripple
                  onClick={handleNewQuiz}
                  className="px-5 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-violet text-white text-sm font-semibold transition-colors shadow-md shadow-accent-purple/20"
                >
                  ✦ New Quiz
                </button>
              </div>
            </div>

            {/* Review section */}
            {showReview && (
              <div className="space-y-4 animate-fade-in-up">
                <h2 className="text-white font-bold text-lg border-b border-dark-600 pb-3">
                  Answer Review
                </h2>
                {questions.map((question, qi) => {
                  const userAns  = answers[qi];
                  const isRight  = userAns === question.correct;
                  return (
                    <div
                      key={qi}
                      className={`bg-dark-800 border rounded-xl p-5 ${
                        isRight ? 'border-green-500/25' : 'border-red-500/25'
                      }`}
                    >
                      {/* Question header */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isRight ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isRight ? '✓' : '✗'}
                        </span>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed">
                          <span className="text-slate-500 mr-1.5">Q{qi + 1}.</span>
                          {question.question}
                        </p>
                      </div>
                      {/* Options summary */}
                      <div className="ml-9 space-y-1.5 mb-3">
                        {question.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                              oi === question.correct
                                ? 'bg-green-500/10 text-green-300'
                                : oi === userAns && !isRight
                                  ? 'bg-red-500/10 text-red-300'
                                  : 'text-slate-500'
                            }`}
                          >
                            <span className="font-bold w-4 shrink-0">{OPTION_LABELS[oi]}.</span>
                            <span>{opt}</span>
                            {oi === question.correct && <span className="ml-auto">✓ Correct</span>}
                            {oi === userAns && !isRight && <span className="ml-auto">Your answer</span>}
                          </div>
                        ))}
                      </div>
                      {/* Explanation */}
                      {question.explanation && (
                        <div className="ml-9 text-xs text-slate-400 bg-dark-700/60 rounded-lg px-3 py-2 border border-dark-500">
                          <span className="text-accent-light font-semibold">💡 </span>
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-center pt-2">
                  <button
                    data-ripple
                    onClick={handleNewQuiz}
                    className="px-6 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-violet text-white text-sm font-semibold transition-colors"
                  >
                    ✦ Start New Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
