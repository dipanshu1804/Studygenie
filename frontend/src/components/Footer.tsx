import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-dark-600 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-slate-500">
            StudyGenie © 2024 —{' '}
            <span className="text-accent-light">AI Academic Assistant</span>
          </p>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-slate-500 hover:text-accent-light transition-colors">
              Home
            </Link>
            <Link to="/quiz" className="text-slate-500 hover:text-accent-light transition-colors">
              Quiz
            </Link>
            <Link to="/dashboard" className="text-slate-500 hover:text-accent-light transition-colors">
              Dashboard
            </Link>
          </nav>
          <p className="text-slate-500">
            Built with <span className="text-red-400">❤️</span> for students
          </p>
        </div>
      </div>
    </footer>
  );
}
