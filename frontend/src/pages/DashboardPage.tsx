import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResponseCard from '../components/ResponseCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { SUBJECTS } from '../utils/subjects';

const RECENT_SEARCHES_KEY = 'sg_recent_searches';
const MAX_RECENT = 5;

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecentSearch(term: string) {
  if (!term.trim() || term.trim().length < 2) return;
  const existing = loadRecentSearches().filter((s) => s !== term.trim());
  const updated = [term.trim(), ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

interface QueryItem {
  _id: string;
  question: string;
  subject: string;
  response: string;
  rating: number | null;
  isBookmarked: boolean;
  createdAt: string;
}

// Color per subject for bar chart and heatmap
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#818cf8',
  Programming: '#34d399',
  Science:     '#60a5fa',
  Physics:     '#a78bfa',
  Chemistry:   '#f472b6',
  Biology:     '#4ade80',
  History:     '#fb923c',
  English:     '#facc15',
  General:     '#94a3b8',
};

const HEATMAP_COLORS = [
  'bg-dark-600',           // 0 questions
  'bg-green-900',          // 1 question
  'bg-green-600',          // 2 questions
  'bg-green-400',          // 3+ questions
];

function heatColor(count: number): string {
  if (count === 0) return HEATMAP_COLORS[0];
  if (count === 1) return HEATMAP_COLORS[1];
  if (count === 2) return HEATMAP_COLORS[2];
  return HEATMAP_COLORS[3];
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function last28Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-dark-800 border border-dark-600 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-5 w-20 bg-dark-600 rounded-full" />
        <div className="h-4 w-48 bg-dark-600 rounded-full" />
      </div>
      <div className="h-3 w-full bg-dark-700 rounded-full" />
      <div className="h-3 w-4/5 bg-dark-700 rounded-full" />
      <div className="h-3 w-2/3 bg-dark-700 rounded-full" />
    </div>
  );
}

// ── Analytics Panel ────────────────────────────────────────────────────────────

function AnalyticsPanel({ queries }: { queries: QueryItem[] }) {
  const totalCount = queries.length;

  // Subject breakdown
  const subjectStats = useMemo(() => {
    const map: Record<string, { count: number; totalRating: number; ratedCount: number }> = {};
    queries.forEach((q) => {
      if (!map[q.subject]) map[q.subject] = { count: 0, totalRating: 0, ratedCount: 0 };
      map[q.subject].count++;
      if (q.rating !== null) {
        map[q.subject].totalRating += q.rating;
        map[q.subject].ratedCount++;
      }
    });
    return Object.entries(map)
      .map(([subject, data]) => ({
        subject,
        count: data.count,
        avgRating: data.ratedCount > 0 ? data.totalRating / data.ratedCount : null,
        color: SUBJECT_COLORS[subject] ?? '#94a3b8',
        emoji: SUBJECTS.find((s) => s.value === subject)?.emoji ?? '📚',
      }))
      .sort((a, b) => b.count - a.count);
  }, [queries]);

  // Activity heatmap
  const days = useMemo(() => last28Days(), []);
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    queries.forEach((q) => {
      const key = toDateKey(new Date(q.createdAt));
      map[key] = (map[key] ?? 0) + 1;
    });
    return map;
  }, [queries]);

  // Top subjects
  const mostAsked = subjectStats[0] ?? null;
  const highestRated = useMemo(() => {
    return [...subjectStats]
      .filter((s) => s.avgRating !== null)
      .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))[0] ?? null;
  }, [subjectStats]);

  if (totalCount === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-white font-semibold text-lg">No data yet</p>
        <p className="text-slate-500 text-sm mt-1">Ask some questions to see your analytics</p>
      </div>
    );
  }

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">

      {/* A — Subject Breakdown */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Subject Breakdown</h3>
        <div className="space-y-3">
          {subjectStats.map(({ subject, count, color, emoji }) => {
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <div key={subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-xs flex items-center gap-1.5">
                    {emoji} {subject}
                  </span>
                  <span className="text-slate-500 text-xs">{count} question{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="h-2 w-full bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* B — Activity Heatmap */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Activity — Last 28 Days</h3>

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs text-slate-600">{d}</div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = toDateKey(day);
            const count = activityMap[key] ?? 0;
            const label = day.toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short',
            });
            const tooltipText =
              count === 0
                ? `No questions on ${label}`
                : `${count} question${count !== 1 ? 's' : ''} on ${label}`;
            return (
              <div
                key={key}
                title={tooltipText}
                className={`h-7 rounded-md ${heatColor(count)} transition-colors cursor-default`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs text-slate-600">Less</span>
          {HEATMAP_COLORS.map((cls) => (
            <div key={cls} className={`w-4 h-4 rounded-sm ${cls}`} />
          ))}
          <span className="text-xs text-slate-600">More</span>
        </div>
      </div>

      {/* C — Top Subjects */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 space-y-3">
        <h3 className="text-white font-semibold text-sm mb-4">Highlights</h3>

        {mostAsked && (
          <div className="flex items-start gap-3 bg-dark-700 rounded-xl p-4">
            <span className="text-2xl shrink-0">{mostAsked.emoji}</span>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Most asked subject</p>
              <p className="text-white text-sm font-semibold">
                {mostAsked.subject}
                <span className="text-slate-400 font-normal ml-1">
                  ({mostAsked.count} question{mostAsked.count !== 1 ? 's' : ''})
                </span>
              </p>
            </div>
          </div>
        )}

        {highestRated ? (
          <div className="flex items-start gap-3 bg-dark-700 rounded-xl p-4">
            <span className="text-2xl shrink-0">{highestRated.emoji}</span>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Highest rated answers</p>
              <p className="text-white text-sm font-semibold">
                {highestRated.subject}
                <span className="text-slate-400 font-normal ml-1">
                  ({highestRated.avgRating!.toFixed(1)} avg ★)
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-dark-700 rounded-xl p-4">
            <span className="text-2xl">⭐</span>
            <p className="text-slate-500 text-sm">Rate some answers to see your top subject</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'analytics'>('history');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchHistory = () => {
    setLoading(true);
    setFetchError(false);
    api.get('/query/history?limit=50')
      .then((res) => setQueries(res.data.queries))
      .catch(() => {
        toast.error('Failed to load history');
        setFetchError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  // Load recent searches on mount
  useEffect(() => { setRecentSearches(loadRecentSearches()); }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = (id: string) => {
    setQueries((prev) => prev.filter((q) => q._id !== id));
  };

  const totalCount = queries.length;
  const bookmarkedCount = queries.filter((q) => q.isBookmarked).length;
  const ratedCount = queries.filter((q) => q.rating !== null).length;

  const usedSubjects = useMemo(() => {
    const used = Array.from(new Set(queries.map((q) => q.subject)));
    return used.map((val) => {
      const match = SUBJECTS.find((s) => s.value === val);
      return { value: val, emoji: match?.emoji ?? '📚' };
    });
  }, [queries]);

  const commitSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term);
    setRecentSearches(loadRecentSearches());
    setShowSuggestions(false);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  const applySuggestion = (term: string) => {
    setSearchInput(term);
    setSearch(term);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setSubjectFilter('All');
    setBookmarkedOnly(false);
  };

  const hasActiveFilters = searchInput !== '' || subjectFilter !== 'All' || bookmarkedOnly;

  const filtered = useMemo(() => {
    return queries.filter((q) => {
      if (bookmarkedOnly && !q.isBookmarked) return false;
      if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false;
      if (search.trim() && !q.question.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [queries, bookmarkedOnly, subjectFilter, search]);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        {/* Welcome Banner */}
        <div className="animate-fade-in-down mb-6 flex items-center justify-between gap-4 bg-gradient-to-r from-accent-purple/10 to-dark-800 border border-accent-purple/20 rounded-2xl px-5 py-4">
          <div>
            <p className="text-white font-semibold text-base">
              {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              {totalCount === 0
                ? 'Ready to start learning?'
                : `You've asked ${totalCount} question${totalCount !== 1 ? 's' : ''} so far. Keep it up!`}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="shrink-0 px-4 py-2 rounded-xl text-sm bg-accent-purple hover:bg-accent-violet text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple shadow-md shadow-accent-purple/20"
          >
            + Ask New Question
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Dashboard</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8">
          {[
            { label: 'Total Questions', value: totalCount, icon: '📚', sub: null },
            { label: 'Bookmarked', value: bookmarkedCount, icon: '★', sub: null },
            { label: 'Rated', value: ratedCount, icon: '⭐', sub: null },
            { label: 'Study Streak', value: user?.streak ?? 0, icon: '🔥', sub: 'days in a row' },
          ].map(({ label, value, icon, sub }) => (
            <div key={label} className="bg-dark-800 border border-dark-600 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl mb-1">{icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-white">{loading ? '—' : value}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</div>
              {sub && !loading && (
                <div className="text-xs text-slate-600 mt-0.5">{sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-dark-800 border border-dark-600 rounded-xl p-1 gap-1 mb-6">
          {(['history', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple ${
                activeTab === tab
                  ? 'bg-accent-purple text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'history' ? '📋 History' : '📊 Analytics'}
            </button>
          ))}
        </div>

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          loading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <AnalyticsPanel queries={queries} />
          )
        )}

        {/* ── History Tab ── */}
        {activeTab === 'history' && (
          <>
            {/* Search Bar with suggestions */}
            <div className="relative mb-4" ref={searchContainerRef}>
              <span className="absolute left-3 top-3.5 text-slate-500 text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                placeholder="Search your questions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitSearch(searchInput); }}
                aria-label="Search questions"
                className="w-full bg-dark-800 border border-dark-600 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-purple transition-colors"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); setSearch(''); }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-lg leading-none"
                >
                  ×
                </button>
              )}
              {/* Suggestions Dropdown */}
              {showSuggestions && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-500 rounded-xl shadow-xl z-10 overflow-hidden">
                  <div className="flex items-center justify-between px-3 pt-2 pb-1">
                    <span className="text-xs text-slate-500">Recent searches</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches
                    .filter((s) => !searchInput.trim() || s.toLowerCase().includes(searchInput.toLowerCase()))
                    .map((term) => (
                      <button
                        key={term}
                        onClick={() => applySuggestion(term)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-dark-600 text-left transition-colors"
                      >
                        <span className="text-slate-500 text-xs">🕐</span>
                        <span className="text-slate-300 text-sm">{term}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Subject Filter Buttons + Bookmarked Toggle */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                onClick={() => setSubjectFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors border focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple ${
                  subjectFilter === 'All'
                    ? 'bg-accent-purple border-accent-purple text-white'
                    : 'bg-dark-800 border-dark-600 text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {usedSubjects.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSubjectFilter(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors border focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-purple ${
                    subjectFilter === s.value
                      ? 'bg-accent-purple border-accent-purple text-white'
                      : 'bg-dark-800 border-dark-600 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.emoji} {s.value}
                </button>
              ))}
              <button
                onClick={() => setBookmarkedOnly((prev) => !prev)}
                aria-pressed={bookmarkedOnly}
                className={`ml-auto px-3 py-1.5 rounded-lg text-sm transition-colors border focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500 ${
                  bookmarkedOnly
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                    : 'bg-dark-800 border-dark-600 text-slate-400 hover:text-white'
                }`}
              >
                ★ Bookmarked only
              </button>
            </div>

            {/* History Content */}
            {loading ? (
              <div className="space-y-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : fetchError ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-white font-semibold text-lg">Failed to load your history</p>
                <p className="text-slate-500 text-sm mt-1 mb-6">Check your connection and try again</p>
                <button
                  onClick={fetchHistory}
                  className="px-6 py-2.5 bg-accent-purple hover:bg-accent-violet text-white rounded-xl text-sm transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-white font-semibold text-lg">No questions yet</p>
                <p className="text-slate-500 text-sm mt-1 mb-6">Start learning by asking your first question</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 bg-accent-purple hover:bg-accent-violet text-white rounded-xl text-sm transition-colors"
                >
                  Ask your first question
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-white font-semibold text-lg">No questions match your filters</p>
                <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your search or filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-dark-700 hover:bg-dark-600 border border-dark-500 text-slate-300 rounded-xl text-sm transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xs text-slate-600">
                  Showing {filtered.length} of {totalCount} question{totalCount !== 1 ? 's' : ''}
                  {totalCount === 50 ? ' (showing most recent 50)' : ''}
                </p>
                {filtered.map((q, i) => (
                  <div
                    key={q._id}
                    className="card-enter"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <p className="text-xs text-slate-600 mb-2">
                      {new Date(q.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                    <ResponseCard
                      queryId={q._id}
                      question={q.question}
                      subject={q.subject}
                      response={q.response}
                      initialBookmarked={q.isBookmarked}
                      initialRating={q.rating}
                      onDelete={handleDelete}
                      showDelete
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
