/**
 * PassingChords.jsx
 * The "+" button between chords that suggests reharmonization options.
 */

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getPassingChords } from '../engine/ChordEngine';

const TYPE_COLORS = {
  'V/V':   { bg: 'bg-blue-900/40', border: 'border-blue-700', text: 'text-blue-300', dot: '#4a9eff' },
  'SubV7': { bg: 'bg-purple-900/40', border: 'border-purple-700', text: 'text-purple-300', dot: '#c084fc' },
  'dim7':  { bg: 'bg-orange-900/40', border: 'border-orange-700', text: 'text-orange-300', dot: '#fb923c' },
};

export default function PassingChords({ targetChord, onInsert }) {
  const [open, setOpen] = useState(false);
  const suggestions = getPassingChords(targetChord);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* The "+" button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-6 h-6 rounded-full flex items-center justify-center
                   bg-jazz-border hover:bg-jazz-accent hover:text-black
                   text-jazz-muted border border-jazz-border
                   transition-all duration-150 text-xs"
        title="Accords de passage"
      >
        {open ? <X size={12} /> : <Plus size={12} />}
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute z-50 top-8 left-1/2 -translate-x-1/2
                     bg-jazz-card border border-jazz-border rounded-xl shadow-2xl
                     p-3 w-52 flex flex-col gap-2"
        >
          <p className="text-xs text-jazz-muted mb-1 font-semibold tracking-wide uppercase">
            Vers {targetChord}
          </p>

          {suggestions.map(s => {
            const colors = TYPE_COLORS[s.label] ?? TYPE_COLORS['dim7'];
            return (
              <button
                key={s.label}
                onClick={() => { onInsert?.(s.symbol); setOpen(false); }}
                className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg
                            ${colors.bg} border ${colors.border}
                            hover:brightness-125 transition-all text-left`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: colors.dot }}
                  />
                  <span className={`font-bold text-sm ${colors.text}`}>{s.symbol}</span>
                  <span className="ml-auto text-xs text-jazz-muted font-mono">{s.label}</span>
                </div>
                <span className="text-xs text-gray-500 ml-4">{s.description}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
