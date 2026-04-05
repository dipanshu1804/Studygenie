import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { getSubjectMeta } from '../utils/subjects'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

interface ResponseCardProps {
  id?: string | null
  question: string
  subject: string
  response: string
  createdAt?: string
  rating?: number | null
  isBookmarked?: boolean
  onDelete?: (id: string) => void
  onBookmarkToggle?: (id: string, val: boolean) => void
  onRated?: (id: string, rating: number) => void
  showActions?: boolean
}

export default function ResponseCard({
  id, question, subject, response, createdAt,
  rating: initialRating, isBookmarked: initialBookmarked,
  onDelete, onBookmarkToggle, onRated, showActions = true
}: ResponseCardProps) {
  const { isAuthenticated } = useAuth()
  const [bookmarked, setBookmarked] = useState(initialBookmarked ?? false)
  const [rating, setRating] = useState(initialRating ?? 0)
  const [expanded, setExpanded] = useState(true)
  const subjectMeta = getSubjectMeta(subject)

  const handleBookmark = async () => {
    if (!id || !isAuthenticated) return
    try {
      const { data } = await api.patch(`/query/${id}/bookmark`)
      setBookmarked(data.isBookmarked)
      onBookmarkToggle?.(id, data.isBookmarked)
      toast.success(data.isBookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const handleRate = async (stars: number) => {
    if (!id || !isAuthenticated) return
    try {
      await api.patch(`/query/${id}/rate`, { rating: stars })
      setRating(stars)
      onRated?.(id, stars)
      toast.success('Rating saved!')
    } catch {
      toast.error('Failed to save rating')
    }
  }

  const handleDelete = async () => {
    if (!id || !onDelete) return
    if (!confirm('Delete this query from your history?')) return
    try {
      await api.delete(`/query/${id}`)
      onDelete(id)
      toast.success('Query deleted')
    } catch {
      toast.error('Failed to delete query')
    }
  }

  const formatDate = (d?: string) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="card overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-600 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`tag border text-xs ${subjectMeta.color}`}>
              <span className="mr-1">{subjectMeta.icon}</span>
              {subject}
            </span>
            {createdAt && (
              <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
            )}
          </div>
          <p className="text-white font-medium text-sm leading-relaxed line-clamp-2">{question}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isAuthenticated && id && (
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-amber-400 bg-amber-400/10' : 'text-gray-500 hover:text-gray-300 hover:bg-ink-700'}`}
              title="Bookmark"
            >
              <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-ink-700 transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {onDelete && id && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-gray-500 hover:text-coral-400 hover:bg-coral-400/10 transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Response body */}
      {expanded && (
        <div className="px-5 py-4">
          <div className="response-content text-sm leading-relaxed">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>

          {/* Rating */}
          {showActions && isAuthenticated && id && (
            <div className="mt-4 pt-4 border-t border-ink-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Rate this answer:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className={`text-lg transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-gray-600 hover:text-amber-400/60'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
