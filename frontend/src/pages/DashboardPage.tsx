import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ResponseCard from '../components/ResponseCard'
import { SUBJECTS } from '../utils/subjects'
import api from '../utils/api'

interface QueryItem {
  _id: string
  question: string
  subject: string
  response: string
  createdAt: string
  rating: number | null
  isBookmarked: boolean
}

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [queries, setQueries] = useState<QueryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showBookmarked, setShowBookmarked] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/')
      toast.error('Please sign in to view your history')
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (isAuthenticated) fetchHistory()
  }, [isAuthenticated])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/query/history')
      setQueries(data.queries)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setQueries((prev) => prev.filter((q) => q._id !== id))
  }

  const handleBookmarkToggle = (id: string, val: boolean) => {
    setQueries((prev) => prev.map((q) => q._id === id ? { ...q, isBookmarked: val } : q))
  }

  const handleRated = (id: string, rating: number) => {
    setQueries((prev) => prev.map((q) => q._id === id ? { ...q, rating } : q))
  }

  const filtered = queries.filter((q) => {
    const matchSubject = filter === 'All' || q.subject === filter
    const matchSearch = !search || q.question.toLowerCase().includes(search.toLowerCase())
    const matchBookmark = !showBookmarked || q.isBookmarked
    return matchSubject && matchSearch && matchBookmark
  })

  const subjectsUsed = ['All', ...Array.from(new Set(queries.map((q) => q.subject)))]

  if (authLoading) return null

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-semibold text-white mb-1">
            Question History
          </h1>
          <p className="text-gray-400 text-sm">
            {queries.length > 0
              ? `${queries.length} question${queries.length !== 1 ? 's' : ''} saved`
              : 'Your saved questions will appear here'}
          </p>
        </div>

        {/* Stats row */}
        {queries.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            {[
              { label: 'Total Questions', value: queries.length },
              { label: 'Bookmarked', value: queries.filter((q) => q.isBookmarked).length },
              { label: 'Rated', value: queries.filter((q) => q.rating).length },
            ].map((s) => (
              <div key={s.label} className="bg-ink-800 border border-ink-600 rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-semibold text-sage-400">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {queries.length > 0 && (
          <div className="mb-5 space-y-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search your questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 text-sm"
              />
            </div>

            {/* Subject filter + bookmark toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {subjectsUsed.map((s) => {
                const meta = SUBJECTS.find((x) => x.value === s)
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      filter === s
                        ? (meta ? meta.color + ' border-current' : 'bg-ink-600 text-white border-ink-500')
                        : 'text-gray-500 bg-ink-700 border-ink-600 hover:text-gray-300'
                    }`}
                  >
                    {meta && <span className="mr-1">{meta.icon}</span>}
                    {s}
                  </button>
                )
              })}
              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ml-auto ${
                  showBookmarked
                    ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                    : 'text-gray-500 bg-ink-700 border-ink-600 hover:text-gray-300'
                }`}
              >
                ★ Bookmarked only
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="w-24 h-5 shimmer rounded-full" />
                <div className="w-full h-4 shimmer rounded" />
                <div className="w-5/6 h-4 shimmer rounded" />
                <div className="w-4/6 h-4 shimmer rounded" />
              </div>
            ))}
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="font-display text-xl text-white mb-2">No questions yet</h3>
            <p className="text-gray-500 text-sm mb-6">Ask your first question and it will be saved here automatically.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              Ask a Question
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-gray-500 text-sm">No questions match your filters.</p>
            <button onClick={() => { setFilter('All'); setSearch(''); setShowBookmarked(false) }} className="mt-3 text-sage-400 hover:text-sage-300 text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((q, i) => (
              <div key={q._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <ResponseCard
                  id={q._id}
                  question={q.question}
                  subject={q.subject}
                  response={q.response}
                  createdAt={q.createdAt}
                  rating={q.rating}
                  isBookmarked={q.isBookmarked}
                  onDelete={handleDelete}
                  onBookmarkToggle={handleBookmarkToggle}
                  onRated={handleRated}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
