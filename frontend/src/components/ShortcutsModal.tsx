import { useEffect } from 'react';

interface Props {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], description: 'Submit question',           where: 'Home page'     },
  { keys: ['Ctrl', 'K'],     description: 'Focus question input',      where: 'Home page'     },
  { keys: ['Ctrl', '/'],     description: 'Open shortcuts modal',      where: 'Anywhere'      },
  { keys: ['Esc'],           description: 'Close any modal',           where: 'Anywhere'      },
  { keys: ['Enter'],         description: 'Submit follow-up question', where: 'Response card' },
];

export default function ShortcutsModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Centered modal container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-md pointer-events-auto bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl overflow-hidden animate-fade-up">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-600">
            <div className="flex items-center gap-2">
              <span className="text-lg">⌨️</span>
              <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close shortcuts modal"
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Shortcuts list */}
          <div className="px-6 py-4 space-y-2">
            {SHORTCUTS.map(({ keys, description, where }) => (
              <div
                key={description}
                className="flex items-center justify-between bg-ink-700 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-slate-200 text-sm">{description}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{where}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {keys.map((key, i) => (
                    <span key={key} className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-ink-600 border border-ink-500 rounded-lg text-xs text-slate-300 font-mono">
                        {key}
                      </kbd>
                      {i < keys.length - 1 && (
                        <span className="text-slate-600 text-xs">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-ink-900 border-t border-ink-600">
            <p className="text-xs text-slate-500 text-center">
              Press{' '}
              <kbd className="px-1.5 py-0.5 bg-ink-700 rounded text-slate-400 font-mono text-xs">
                Esc
              </kbd>{' '}
              to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
