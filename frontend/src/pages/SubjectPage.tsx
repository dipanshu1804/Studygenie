import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { subjectContent } from '../data/subjectContent';

export default function SubjectPage() {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const subject = subjectContent[subjectName as keyof typeof subjectContent];

  if (!subject) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-bold">Subject not found</p>
        <Link to="/" className="text-accent-light hover:underline text-sm">← Back to Home</Link>
      </div>
    );
  }

  const handleTopicClick = (topic: string) => {
    navigate('/', { state: { question: `Explain ${topic} in detail with examples`, subject: subject.name } });
  };

  const handleQuestionClick = (question: string) => {
    navigate('/', { state: { question, subject: subject.name } });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-dark-600 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-6 transition-colors"
          >
            ← Back to Home
          </button>
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl ${subject.bgColor} border ${subject.borderColor} flex items-center justify-center text-3xl shrink-0`}>
              {subject.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{subject.name}</h1>
                <span className={`tag border text-xs ${subject.color} ${subject.bgColor} ${subject.borderColor}`}>
                  {subject.difficulty}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-2xl text-sm">
                {subject.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 flex-1">

        {/* Topics Grid */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Key Topics Covered</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {subject.topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className={`text-left px-4 py-3 rounded-xl border ${subject.bgColor} ${subject.borderColor} hover:opacity-80 transition-all duration-200 group`}
              >
                <span className={`text-sm font-medium ${subject.color}`}>{topic}</span>
                <span className="block text-xs text-slate-500 mt-0.5 group-hover:text-slate-400">
                  Click to ask AI →
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Questions */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Popular Questions</h2>
          <div className="space-y-3">
            {subject.popularQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleQuestionClick(q)}
                className="w-full text-left px-5 py-4 card hover:border-sage-500/40 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {q}
                  </span>
                  <span className={`shrink-0 text-lg ${subject.color}`}>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Study Tips */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Study Tips</h2>
          <div className="space-y-3">
            {subject.studyTips.map((tip, i) => (
              <div key={tip} className="flex items-start gap-4 px-5 py-4 card">
                <div className={`w-7 h-7 rounded-full ${subject.bgColor} border ${subject.borderColor} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className={`text-sm font-bold ${subject.color}`}>{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Exam Topics */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Relevant Exams</h2>
          <div className="flex flex-wrap gap-2">
            {subject.examTopics.map((exam) => (
              <span
                key={exam}
                className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-xs text-slate-300"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 pt-4 pb-10">
          <button
            onClick={() => navigate('/', { state: { subject: subject.name } })}
            className="btn-primary"
          >
            <span>⚡</span>
            Start Asking {subject.name} Questions
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-ghost"
          >
            Browse All Subjects
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
