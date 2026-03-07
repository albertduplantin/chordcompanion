/**
 * PassingChords.jsx
 * The "+" button between chords — suggests reharmonization options with pedagogy.
 */

import { useState } from 'react';
import { Plus, X, BookOpen } from 'lucide-react';
import { getPassingChords } from '../engine/ChordEngine';

// Color palette per type
const COLOR_MAP = {
  blue:   { bg: '#1e3a5f', border: '#3b7dd8', text: '#93c5fd', dot: '#4a9eff',  badge: '#1d4ed8' },
  purple: { bg: '#2d1b5e', border: '#7c3aed', text: '#c4b5fd', dot: '#a78bfa',  badge: '#6d28d9' },
  orange: { bg: '#3d2000', border: '#c2670f', text: '#fdba74', dot: '#fb923c',  badge: '#c2410c' },
  teal:   { bg: '#0d3330', border: '#0f766e', text: '#5eead4', dot: '#2dd4bf',  badge: '#0f766e' },
  green:  { bg: '#0f2d1a', border: '#15803d', text: '#86efac', dot: '#4ade80',  badge: '#15803d' },
  red:    { bg: '#3d0f0f', border: '#b91c1c', text: '#fca5a5', dot: '#f87171',  badge: '#b91c1c' },
};

const CATEGORY_ICONS = {
  'Fonctionnel': '⚡',
  'Substitution': '🔄',
  'Chromatique': '🎼',
  'Modal': '🌙',
  'Altéré': '🔥',
};

export default function PassingChords({ targetChord, onInsert }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const suggestions = getPassingChords(targetChord);

  function handleInsert(sym) {
    onInsert?.(sym);
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div className="relative flex flex-col items-center justify-center self-stretch">
      {/* ── "+" trigger button ── */}
      <button
        onClick={() => { setOpen(v => !v); setExpanded(null); }}
        className="w-6 h-6 rounded-full flex items-center justify-center
                   bg-jazz-border hover:bg-jazz-accent hover:text-black
                   text-jazz-muted border border-jazz-border
                   transition-all duration-150 z-10"
        title="Accords de passage"
      >
        {open ? <X size={11} /> : <Plus size={11} />}
      </button>

      {/* ── Popover ── */}
      {open && (
        <>
          {/* Click-outside overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => { setOpen(false); setExpanded(null); }}
          />

          <div
            className="absolute z-50 top-8 left-1/2 -translate-x-1/2
                       bg-[#18181f] border border-jazz-border rounded-2xl shadow-2xl
                       p-4 flex flex-col gap-2"
            style={{ width: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-jazz-muted uppercase tracking-widest font-semibold">
                Avant <span className="text-jazz-accent">{targetChord}</span>
              </span>
              <span className="text-xs text-jazz-muted">6 options</span>
            </div>

            {suggestions.map((s, i) => {
              const c = COLOR_MAP[s.color] ?? COLOR_MAP.blue;
              const isExpanded = expanded === s.label;

              return (
                <div
                  key={s.label}
                  className="rounded-xl overflow-hidden border transition-all duration-150"
                  style={{ borderColor: c.border }}
                >
                  {/* Main row */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    style={{ background: c.bg }}
                  >
                    {/* Number */}
                    <span className="text-xs font-mono opacity-40 w-3 flex-shrink-0">{i + 1}</span>

                    {/* Category icon */}
                    <span className="text-sm flex-shrink-0" title={s.category}>
                      {CATEGORY_ICONS[s.category] ?? '•'}
                    </span>

                    {/* Chord symbol */}
                    <span
                      className="font-bold text-sm flex-shrink-0 min-w-[52px]"
                      style={{ color: c.text }}
                    >
                      {s.symbol}
                    </span>

                    {/* Tagline */}
                    <span className="text-xs text-gray-400 flex-1 truncate">{s.tagline}</span>

                    {/* Label badge */}
                    <span
                      className="text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: c.badge, color: '#fff', opacity: 0.85 }}
                    >
                      {s.label}
                    </span>

                    {/* Explain toggle */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : s.label)}
                      className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                      title="Explication"
                    >
                      <BookOpen size={12} color={c.text} />
                    </button>

                    {/* Insert button */}
                    <button
                      onClick={() => handleInsert(s.symbol)}
                      className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded
                                 hover:brightness-125 transition-all"
                      style={{ background: c.badge, color: '#fff' }}
                      title="Insérer"
                    >
                      +
                    </button>
                  </div>

                  {/* Expandable explanation */}
                  {isExpanded && (
                    <div
                      className="px-3 pb-3 pt-2 text-xs leading-relaxed border-t"
                      style={{ background: `${c.bg}cc`, borderColor: c.border, color: '#d1d5db' }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: c.badge + '80', color: c.text }}
                        >
                          {s.category}
                        </span>
                      </div>
                      {s.description}
                    </div>
                  )}
                </div>
              );
            })}

            <p className="text-center text-xs text-jazz-muted mt-1 opacity-60">
              📖 Cliquez sur le livre pour l'explication théorique
            </p>
          </div>
        </>
      )}
    </div>
  );
}
