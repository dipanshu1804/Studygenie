import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SUBJECT_CONTENT, DIFFICULTY_META } from '../data/subjectContent';

export default function SubjectPage() {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();

  const info = subjectName ? SUBJECT_CONTENT[subjectName] : null;

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!info) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-bold">Subject not found</p>
        <Link to="/" className="text-accent-light hover:underline text-sm">← Back to Home</Link>
      </div>
    );
  }

  const diff = DIFFICULTY_META[info.difficulty];

  const handleTopic = (topic: string) => {
    navigate('/', {
      state: { prefill: { question: `Explain ${topic} in detail with examples`, subject: info.name } },
    });
  };

  const handleQuestion = (q: string) => {
    navigate('/', {
      state: { prefill: { question: q, subject: info.name } },
    });
  };

  const handleStart = () => {
    navigate('/', {
      state: { prefill: { question: '', subject: info.name } },
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-28 pb-12">

        {/* Back breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-accent-light text-sm mb-8 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Home
        </Link>

        {/* ── Subject header ────────────────────────────────── */}
        <div className={`bg-gradient-to-br ${info.color} border ${info.border} rounded-2xl p-8 mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Big icon */}
            <div className="w-20 h-20 rounded-2xl bg-dark-800/60 flex items-center justify-center text-5xl shrink-0 border border-white/5">
              {info.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">{info.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diff.bg} ${diff.color}`}>
                  {info.difficulty}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{info.description}</p>
            </div>
          </div>
          {/* Start Asking CTA */}
          <button
            data-ripple
            onClick={handleStart}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-violet text-white text-sm font-semibold transition-colors shadow-lg shadow-accent-purple/25"
          >
            ✦ Start Asking →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Topics (left 2 cols) ─────────────────────── */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className={info.accent}>◈</span> Topics Covered
              </h2>
              <p className="text-slate-500 text-xs mb-4">Click any topic to instantly ask about it</p>
              <div className="flex flex-wrap gap-2">
                {info.topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopic(topic)}
                    className={`px-3.5 py-1.5 rounded-full text-sm border transition-all hover:-translate-y-0.5 hover:shadow-md ${info.border} ${info.accent} bg-dark-700 hover:bg-dark-600`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular questions */}
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className={info.accent}>◈</span> Popular Questions
              </h2>
              <p className="text-slate-500 text-xs mb-4">Click to jump straight to an answer</p>
              <div className="space-y-3">
                {info.popularQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestion(q)}
                    className="w-full text-left group flex items-start gap-3 p-3.5 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-accent-purple/30 transition-all"
                  >
                    <span className={`shrink-0 font-bold text-sm mt-0.5 ${info.accent}`}>{i + 1}.</span>
                    <span className="text-slate-300 text-sm group-hover:text-white transition-colors leading-relaxed">
                      {q}
                    </span>
                    <span className="shrink-0 text-slate-600 group-hover:text-accent-light transition-colors text-sm ml-auto pl-2">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Study Tips (right col) ─────────────────── */}
          <section className="space-y-4">
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className={info.accent}>◈</span> Study Tips
              </h2>
              <ol className="space-y-4">
                {info.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-accent-purple/30 border border-accent-purple/40 mt-0.5`}>
                      {i + 1}
                    </span>
                    <p className="text-slate-400 text-sm leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Quick stats card */}
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
              <h2 className="text-white font-bold text-sm mb-4">At a Glance</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Topics</span>
                  <span className="text-white font-medium">{info.topics.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Difficulty</span>
                  <span className={`font-semibold ${diff.color}`}>{info.difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Example Q&As</span>
                  <span className="text-white font-medium">{info.popularQuestions.length}</span>
                </div>
              </div>
              <button
                data-ripple
                onClick={handleStart}
                className="mt-5 w-full py-2.5 rounded-xl bg-accent-purple hover:bg-accent-violet text-white text-sm font-semibold transition-colors"
              >
                Ask a Question →
              </button>
            </div>

            {/* Other subjects */}
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
              <h2 className="text-white font-bold text-sm mb-3">Other Subjects</h2>
              <div className="space-y-1">
                {Object.values(SUBJECT_CONTENT)
                  .filter((s) => s.name !== info.name)
                  .slice(0, 5)
                  .map((s) => (
                    <Link
                      key={s.name}
                      to={`/subject/${s.name}`}
                      className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-dark-700 transition-colors group"
                    >
                      <span className="text-base">{s.emoji}</span>
                      <span className="text-slate-400 text-sm group-hover:text-white transition-colors">{s.name}</span>
                      <span className={`ml-auto text-xs ${DIFFICULTY_META[s.difficulty].color}`}>{s.difficulty}</span>
                    </Link>
                  ))}
                <Link to="/" className="flex items-center gap-2 pt-2 text-xs text-accent-light hover:underline">
                  ← View all subjects
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
