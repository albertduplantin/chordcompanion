/**
 * ProgressionLibrary.jsx
 * Bibliothèque inline (sans modal) — compatible mobile.
 * Les progressions s'affichent en liste dans la page, organisées par catégorie.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink, X, Youtube } from 'lucide-react';
import { PROGRESSION_LIBRARY, CATEGORIES } from '../data/progressions';

// Couleur de la bordure gauche et du badge par catégorie
const CATEGORY_STYLE = {
  Jazz:         { border: 'border-l-blue-500',   badge: 'bg-blue-900/60 text-blue-300 border-blue-700' },
  'Bossa Nova': { border: 'border-l-emerald-500', badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700' },
  Blues:        { border: 'border-l-orange-500',  badge: 'bg-orange-900/60 text-orange-300 border-orange-700' },
  Pop:          { border: 'border-l-purple-500',  badge: 'bg-purple-900/60 text-purple-300 border-purple-700' },
  'Pop 70s':    { border: 'border-l-pink-500',    badge: 'bg-pink-900/60 text-pink-300 border-pink-700' },
};

const CATEGORY_TAB = {
  Jazz:         'data-[active=true]:bg-blue-600   data-[active=true]:border-blue-500   data-[active=true]:text-white',
  'Bossa Nova': 'data-[active=true]:bg-emerald-600 data-[active=true]:border-emerald-500 data-[active=true]:text-white',
  Blues:        'data-[active=true]:bg-orange-600  data-[active=true]:border-orange-500  data-[active=true]:text-white',
  Pop:          'data-[active=true]:bg-purple-600  data-[active=true]:border-purple-500  data-[active=true]:text-white',
  'Pop 70s':    'data-[active=true]:bg-pink-600    data-[active=true]:border-pink-500    data-[active=true]:text-white',
  Tous:         'data-[active=true]:bg-jazz-accent  data-[active=true]:border-jazz-accent data-[active=true]:text-black',
};

export default function ProgressionLibrary({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [expanded, setExpanded] = useState(null);
  const [loaded, setLoaded]     = useState(null); // id of last loaded progression
  const tabsRef = useRef(null);

  const filtered = activeCategory === 'Tous'
    ? PROGRESSION_LIBRARY
    : PROGRESSION_LIBRARY.filter(p => p.category === activeCategory);

  function handleLoad(prog) {
    onSelect(prog.chords, prog.name);
    setLoaded(prog.id);
    // Brief visual feedback, then close library
    setTimeout(onClose, 600);
  }

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id);
  }

  return (
    <div className="bg-jazz-surface border border-jazz-border rounded-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-jazz-border bg-jazz-card/50">
        <div>
          <p className="font-semibold text-white text-sm leading-none">Bibliothèque de progressions</p>
          <p className="text-xs text-jazz-muted mt-0.5">Appuyez sur une progression pour la charger</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center
                     text-jazz-muted hover:text-white hover:bg-jazz-border transition-colors"
          aria-label="Fermer la bibliothèque"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Category tabs — horizontally scrollable on mobile ── */}
      <div
        ref={tabsRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-jazz-border
                   scrollbar-none [-webkit-overflow-scrolling:touch] flex-nowrap"
      >
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              data-active={isActive}
              onClick={() => { setActiveCategory(cat); setExpanded(null); }}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium
                          transition-colors whitespace-nowrap
                          border-jazz-border text-jazz-muted bg-jazz-card
                          hover:text-white hover:border-jazz-accent
                          ${CATEGORY_TAB[cat] ?? ''}`}
            >
              {cat}
              {cat !== 'Tous' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {PROGRESSION_LIBRARY.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Progression list ── */}
      <div className="divide-y divide-jazz-border/50 max-h-[60vh] overflow-y-auto
                      [-webkit-overflow-scrolling:touch]">
        {filtered.map(prog => {
          const catStyle  = CATEGORY_STYLE[prog.category] ?? CATEGORY_STYLE.Pop;
          const isOpen    = expanded === prog.id;
          const isLoading = loaded   === prog.id;

          return (
            <div key={prog.id} className={`border-l-4 ${catStyle.border} transition-colors`}>

              {/* ── Main row ── */}
              <div className="flex items-center gap-3 px-4 py-3">

                {/* Category badge — hidden on very small screens */}
                <span className={`hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full border
                                  font-medium whitespace-nowrap flex-shrink-0 ${catStyle.badge}`}>
                  {prog.category}
                </span>

                {/* Name + style — tap zone for loading */}
                <button
                  onClick={() => handleLoad(prog)}
                  className="flex-1 text-left min-w-0 group"
                >
                  <p className={`font-semibold text-sm leading-tight truncate transition-colors
                                 ${isLoading ? 'text-jazz-accent' : 'text-white group-active:text-jazz-accent'}`}>
                    {isLoading ? '✓ Chargé !' : prog.name}
                  </p>
                  <p className="text-xs text-jazz-muted mt-0.5 truncate">{prog.style}</p>
                </button>

                {/* Chord string */}
                <span className="text-[11px] text-jazz-accent font-mono hidden md:block
                                 flex-shrink-0 max-w-[180px] truncate">
                  {prog.chords}
                </span>

                {/* Expand description */}
                <button
                  onClick={() => toggleExpand(prog.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                             text-jazz-muted hover:text-white hover:bg-jazz-card transition-colors"
                  aria-label={isOpen ? 'Masquer la description' : 'Voir la description'}
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              {/* ── Expanded description ── */}
              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3">

                  {/* Chords (always visible on mobile) */}
                  <p className="font-mono text-xs text-jazz-accent bg-jazz-card
                                rounded-lg px-3 py-2 break-all">
                    {prog.chords}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-jazz-muted leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Example + YouTube */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs text-jazz-muted">
                      <span className="text-white font-medium">Exemple : </span>
                      {prog.example}
                    </p>
                    <a
                      href={prog.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl
                                 bg-red-950/60 border border-red-800/60 text-red-300
                                 hover:bg-red-900/60 hover:text-white transition-colors
                                 self-start sm:self-auto whitespace-nowrap"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current flex-shrink-0">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Écouter sur YouTube
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  {/* Load button */}
                  <button
                    onClick={() => handleLoad(prog)}
                    className="w-full py-2.5 rounded-xl bg-jazz-accent hover:brightness-110
                               text-black font-semibold text-sm transition-all active:scale-95"
                  >
                    Charger cette progression
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer count ── */}
      <div className="px-4 py-2 border-t border-jazz-border bg-jazz-card/30">
        <p className="text-xs text-jazz-muted text-center">
          {filtered.length} progression{filtered.length > 1 ? 's' : ''}
          {activeCategory !== 'Tous' ? ` · ${activeCategory}` : ' au total'}
        </p>
      </div>
    </div>
  );
}
