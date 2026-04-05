export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-light flex items-center justify-center text-white font-bold text-base select-none">
        SG
      </div>
      <svg className="animate-spin h-5 w-5 text-accent-purple" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );
}
