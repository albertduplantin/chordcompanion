/**
 * ProgressionLibrary.jsx
 * Modal bibliothèque de progressions d'accords avec catégories,
 * descriptions pédagogiques et liens YouTube.
 */

import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, ChevronRight, Music } from 'lucide-react';
import { PROGRESSION_LIBRARY, CATEGORIES } from '../data/progressions';

const CATEGORY_COLORS = {
  Jazz:       'bg-blue-900/50  border-blue-700  text-blue-300',
  'Bossa Nova': 'bg-green-900/50 border-green-700 text-green-300',
  Blues:      'bg-orange-900/50 border-orange-700 text-orange-300',
  Pop:        'bg-purple-900/50 border-purple-700 text-purple-300',
  'Pop 70s':  'bg-pink-900/50  border-pink-700  text-pink-300',
};

const CATEGORY_DOT = {
  Jazz:       'bg-blue-400',
  'Bossa Nova': 'bg-green-400',
  Blues:      'bg-orange-400',
  Pop:        'bg-purple-400',
  'Pop 70s':  'bg-pink-400',
};

export default function ProgressionLibrary({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [expanded, setExpanded] = useState(null);
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const filtered = activeCategory === 'Tous'
    ? PROGRESSION_LIBRARY
    : PROGRESSION_LIBRARY.filter(p => p.category === activeCategory);

  function handleSelect(prog) {
    onSelect(prog.chords, prog.name);
    onClose();
  }

  return (
    /* ── Overlay ── */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                 bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* ── Panel ── */}
      <div className="w-full max-w-3xl bg-jazz-surface border border-jazz-border rounded-2xl
                      shadow-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-jazz-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-jazz-accent flex items-center justify-center">
              <Music size={14} className="text-black" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-none">
                Bibliothèque de progressions
              </h2>
              <p className="text-xs text-jazz-muted mt-0.5">
                Cliquez une progression pour la charger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center
                       text-jazz-muted hover:text-white hover:bg-jazz-card transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-5 py-3 border-b border-jazz-border flex-shrink-0 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border
                          transition-colors font-medium
                          ${activeCategory === cat
                            ? 'bg-jazz-accent border-jazz-accent text-black'
                            : 'bg-jazz-card border-jazz-border text-jazz-muted hover:text-white hover:border-jazz-accent'}`}
            >
              {cat !== 'Tous' && (
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[cat]}`} />
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Progression list */}
        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
          {filtered.map(prog => {
            const isOpen = expanded === prog.id;
            return (
              <div
                key={prog.id}
                className="bg-jazz-card border border-jazz-border rounded-xl overflow-hidden
                           transition-all"
              >
                {/* Card header row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Category pill */}
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0
                                    ${CATEGORY_COLORS[prog.category]}`}>
                    {prog.category}
                  </span>

                  {/* Name + style */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-none truncate">
                      {prog.name}
                    </p>
                    <p className="text-xs text-jazz-muted mt-0.5 truncate">{prog.style}</p>
                  </div>

                  {/* Chord preview */}
                  <p className="text-xs text-jazz-accent font-mono hidden sm:block flex-shrink-0">
                    {prog.chords}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Toggle description */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : prog.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center
                                 text-jazz-muted hover:text-white hover:bg-jazz-surface transition-colors"
                      title="Description"
                    >
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Load button */}
                    <button
                      onClick={() => handleSelect(prog)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-jazz-accent hover:brightness-110
                                 text-black font-semibold transition-all"
                    >
                      Charger
                    </button>
                  </div>
                </div>

                {/* Expanded description */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-jazz-border/50 pt-3 flex flex-col gap-3">
                    {/* Chords (mobile) */}
                    <p className="text-xs text-jazz-accent font-mono sm:hidden">
                      {prog.chords}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-jazz-muted leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Example + YouTube link */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-xs text-jazz-muted">
                        <span>Exemple :</span>
                        <span className="text-white font-medium">{prog.example}</span>
                      </div>
                      <a
                        href={prog.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                                   bg-red-900/40 border border-red-800 text-red-300
                                   hover:bg-red-800/50 hover:text-white transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3.5 h-3.5 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Écouter sur YouTube
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-jazz-border flex-shrink-0">
          <p className="text-xs text-jazz-muted text-center">
            {filtered.length} progression{filtered.length > 1 ? 's' : ''} — cliquez « Charger » pour l'utiliser · Échap pour fermer
          </p>
        </div>
      </div>
    </div>
  );
}
