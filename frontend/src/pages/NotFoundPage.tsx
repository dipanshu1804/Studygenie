import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4 text-center">
      {/* Floating 404 */}
      <div className="float-404 text-8xl sm:text-9xl font-bold bg-gradient-to-r from-accent-purple to-accent-light bg-clip-text text-transparent mb-6 select-none leading-none">
        404
      </div>

      {/* Decorative SVG orbit */}
      <svg
        width="120" height="40" viewBox="0 0 120 40"
        className="mb-6 opacity-20"
        aria-hidden="true"
      >
        <ellipse cx="60" cy="20" rx="58" ry="16" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx="118" cy="20" r="4" fill="#a78bfa" />
      </svg>

      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-violet text-white font-medium text-sm transition-colors shadow-lg shadow-accent-purple/30"
      >
        Go back home
      </button>
    </div>
  );
}
