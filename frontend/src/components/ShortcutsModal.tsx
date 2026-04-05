import { useEffect } from 'react';

interface Props {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], desc: 'Submit question', where: 'Home page' },
  { keys: ['Ctrl', 'K'],     desc: 'Focus question input', where: 'Home page' },
  { keys: ['Ctrl', '/'],     desc: 'Open this shortcuts panel', where: 'Anywhere' },
  { keys: ['Escape'],        desc: 'Close any open modal', where: 'Anywhere' },
  { keys: ['Enter'],         desc: 'Submit follow-up question', where: 'Response card' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close shortcuts modal"
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-white font-bold text-lg mb-1">Keyboard Shortcuts</h2>
        <p className="text-slate-500 text-xs mb-5">Use these shortcuts to navigate faster</p>

        <div className="space-y-2">
          {SHORTCUTS.map(({ keys, desc, where }) => (
            <div
              key={desc}
              className="flex items-center justify-between bg-dark-700 rounded-xl px-4 py-3"
            >
              <div>
                <p className="text-slate-200 text-sm">{desc}</p>
                <p className="text-slate-600 text-xs mt-0.5">{where}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-dark-600 border border-dark-500 rounded text-xs text-slate-300 font-mono">
                      {k}
                    </kbd>
                    {i < keys.length - 1 && <span className="text-slate-600 text-xs">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
