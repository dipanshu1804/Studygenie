import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { SUBJECTS } from '../utils/subjects'
import ResponseCard from '../components/ResponseCard'
import api from '../utils/api'

interface QueryResult {
  id: string | null
  question: string
  subject: string
  response: string
  createdAt: string
}

interface HomePageProps {
  onAuthClick: (mode: 'login' | 'register') => void
}

export default function HomePage({ onAuthClick }: HomePageProps) {
  const { isAuthenticated, user } = useAuth()
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('General')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return toast.error('Please enter your question')

    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/query/ask', { question: question.trim(), subject })
      setResult(data)
      if (!isAuthenticated) {
        toast('Sign in to save your question history!', { icon: '💡' })
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to get answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setResult(null)
    setQuestion('')
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-sage-500/8 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8 relative">
          {/* Greeting */}
          {isAuthenticated ? (
            <p className="text-center text-sm text-sage-400 font-medium mb-3 animate-fade-in">
              Welcome back, {user?.name} 👋
            </p>
          ) : (
            <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-3 animate-fade-in">
              AI-Powered Academic Assistance
            </p>
          )}

          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-center leading-tight mb-4 animate-fade-up">
            Got a doubt?{' '}
            <span className="text-sage-400 italic">Ask away.</span>
          </h1>
          <p className="text-center text-gray-400 text-base mb-10 max-w-md mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Get instant, step-by-step explanations across Mathematics, Programming, Science, and more — available 24/7.
          </p>

          {/* Query form */}
          <form onSubmit={handleSubmit} className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="card p-4 glow-sage">
              {/* Subject selector */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSubject(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      subject === s.value
                        ? s.color + ' border-current'
                        : 'text-gray-500 bg-ink-700 border-ink-600 hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-1">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your academic question here… e.g. 'Explain the concept of recursion in programming' or 'Solve: 2x + 5 = 13'"
                rows={4}
                className="w-full bg-ink-900 border border-ink-600 focus:border-sage-500 focus:ring-1 focus:ring-sage-500/20 text-gray-200 placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200 mb-3 font-body"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e as any)
                }}
              />

              {/* Submit row */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-600">
                  Press <kbd className="px-1.5 py-0.5 bg-ink-700 rounded text-gray-500 font-mono text-xs">Ctrl+Enter</kbd> to submit
                </p>
                <div className="flex gap-2">
                  {result && (
                    <button type="button" onClick={handleClear} className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-ink-700 hover:bg-ink-600 rounded-xl transition-colors">
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="px-6 py-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-sage-500/20 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Thinking…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Ask Genie
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="card p-5 space-y-3">
            <div className="flex gap-2 items-center">
              <div className="w-24 h-5 shimmer rounded-full" />
              <div className="w-32 h-4 shimmer rounded-full" />
            </div>
            <div className="w-full h-4 shimmer rounded" />
            <div className="w-5/6 h-4 shimmer rounded" />
            <div className="w-4/6 h-4 shimmer rounded" />
            <div className="w-full h-4 shimmer rounded" />
            <div className="w-3/4 h-4 shimmer rounded" />
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            <span className="text-xs text-gray-500">AI Response</span>
          </div>
          <ResponseCard
            id={result.id}
            question={result.question}
            subject={result.subject}
            response={result.response}
            createdAt={result.createdAt}
            showActions={true}
          />
        </div>
      )}

      {/* Features section (shown when no result) */}
      {!result && !loading && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { icon: '⚡', title: 'Instant Answers', desc: 'Get step-by-step explanations in seconds, 24/7' },
              { icon: '📚', title: 'Multi-Subject', desc: 'Maths, Science, Programming, History and more' },
              { icon: '🕐', title: 'Save History', desc: 'Sign in to revisit past questions and answers' },
            ].map((f) => (
              <div key={f.title} className="bg-ink-800/50 border border-ink-700 rounded-2xl p-5 hover:border-ink-500 transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-medium text-white text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="mt-6 flex items-center justify-between px-5 py-4 bg-sage-500/10 border border-sage-500/20 rounded-2xl">
              <div>
                <p className="text-sm font-medium text-white">Save your question history</p>
                <p className="text-xs text-gray-400 mt-0.5">Create a free account to track all your doubts and answers</p>
              </div>
              <button
                onClick={() => onAuthClick('register')}
                className="shrink-0 px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-xl transition-all duration-200"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
