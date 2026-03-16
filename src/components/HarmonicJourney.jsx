/**
 * HarmonicJourney.jsx
 * Visualise les routes harmoniques possibles entre deux accords.
 *
 * Chaque route = une ligne de pills "subway-map" avec des flèches entre elles.
 * Clic/tap sur un accord intermédiaire → popover théorique + lien YouTube.
 * Bouton "Charger" → injecte la route dans la progression principale.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ExternalLink, Zap, RotateCcw, Info } from 'lucide-react';
import { generateRoutes } from '../engine/RouteEngine';
import { playChord } from '../engine/AudioEngine';
import { buildVoicedChord } from '../engine/ChordEngine';

// ─── Constants ───────────────────────────────────────────────────────────────

const STEP_OPTIONS = [1, 2, 3, 4];

// ─── Popover for a single chord node ────────────────────────────────────────

function ChordPopover({ transition, targetChord, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72
                 bg-jazz-card border border-jazz-border rounded-xl shadow-2xl p-4
                 text-left"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span
            className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle"
            style={{ background: transition.color }}
          />
          <span className="font-bold text-white">{transition.chord}</span>
          <span className="ml-2 text-xs text-jazz-muted">{transition.label}</span>
        </div>
        <button onClick={onClose} className="text-jazz-muted hover:text-white flex-shrink-0">
          <X size={14} />
        </button>
      </div>

      {/* Arrow */}
      <p className="text-xs text-jazz-muted mb-2 flex items-center gap-1">
        <span className="font-semibold text-white">{transition.chord}</span>
        <span>→</span>
        <span className="font-semibold text-white">{targetChord}</span>
      </p>

      {/* Explanation */}
      <p className="text-xs text-jazz-muted leading-relaxed mb-3">
        {transition.explanation}
      </p>

      {/* YouTube */}
      <a
        href={transition.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg
                   bg-red-950/60 border border-red-800/60 text-red-300
                   hover:bg-red-900/60 hover:text-white transition-colors w-full"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current flex-shrink-0">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        En savoir plus sur YouTube
        <ExternalLink size={11} className="ml-auto" />
      </a>
    </div>
  );
}

// ─── A single chord pill in a route ─────────────────────────────────────────

function ChordPill({ chord, transition, nextChord, isEndpoint }) {
  const [open, setOpen]       = useState(false);
  const [playing, setPlaying] = useState(false);
  const clickTimer            = useRef(null);

  // Play the chord (single click / tap)
  async function handlePlay() {
    if (playing) return;
    setPlaying(true);
    try {
      const voicing = buildVoicedChord(chord, 'C4');
      await playChord(voicing, '2n');
    } catch (_) { /* sampler may not be ready */ }
    setPlaying(false);
  }

  // Distinguish single click (play) from double click (open popover)
  function handleClick() {
    if (clickTimer.current) {
      // Double click
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setOpen(v => !v);
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        handlePlay();
      }, 220);
    }
  }

  // Endpoint (first/last chord): just play on click, no popover
  if (isEndpoint) {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handlePlay}
          className={`px-3 py-2 rounded-xl border-2 border-jazz-accent bg-jazz-card
                      text-jazz-accent font-bold text-sm min-w-[56px] text-center
                      transition-all active:scale-95
                      ${playing ? 'brightness-150 scale-105' : 'hover:brightness-110'}`}
          title="Cliquer pour jouer"
        >
          {chord}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-1">
      {/* Pill: single click = play, double click = open explanation */}
      <button
        onClick={handleClick}
        className={`px-3 py-2 rounded-xl border text-sm font-semibold min-w-[56px] text-center
                    transition-all active:scale-95
                    ${playing ? 'brightness-150 scale-105' : 'hover:brightness-110'}`}
        style={{
          borderColor: transition?.color ?? '#2e2e3a',
          background: `${transition?.color ?? '#2e2e3a'}${playing ? '55' : '22'}`,
          color: transition?.color ?? '#fff',
        }}
        title="Clic = jouer · Double-clic = explication"
      >
        {chord}
      </button>

      {/* Approach label + info button (tap-friendly on mobile) */}
      {transition && (
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-0.5 text-[9px] text-jazz-muted hover:text-white
                     leading-none text-center max-w-[72px] transition-colors"
          title="Voir l'explication théorique"
        >
          <Info size={9} className="flex-shrink-0" />
          <span className="truncate">{transition.label}</span>
        </button>
      )}

      {open && transition && (
        <ChordPopover
          transition={transition}
          targetChord={nextChord}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Arrow between pills ─────────────────────────────────────────────────────

function Arrow({ color }) {
  return (
    <div className="flex items-center pb-4 flex-shrink-0">
      <svg width="28" height="16" viewBox="0 0 28 16">
        <line x1="0" y1="8" x2="20" y2="8" stroke={color ?? '#2e2e3a'} strokeWidth="1.5" />
        <polygon points="20,4 28,8 20,12" fill={color ?? '#2e2e3a'} />
      </svg>
    </div>
  );
}

// ─── A single route row ──────────────────────────────────────────────────────

function RouteRow({ route, index, onLoad }) {
  const { chords, transitions } = route;

  return (
    <div className="bg-jazz-card border border-jazz-border rounded-xl p-3 flex flex-col gap-3">
      {/* Route header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-jazz-muted font-medium">Route {index + 1}</span>
        <button
          onClick={() => onLoad(chords)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                     bg-jazz-accent hover:brightness-110 text-black font-semibold
                     transition-all active:scale-95"
        >
          <Zap size={11} />
          Charger
        </button>
      </div>

      {/* Scrollable chord chain */}
      <div className="flex items-start gap-1 overflow-x-auto pb-1
                      [-webkit-overflow-scrolling:touch] scrollbar-none">
        {chords.map((chord, ci) => {
          const isFirst = ci === 0;
          const isLast  = ci === chords.length - 1;
          // The transition that leads INTO this chord = transitions[ci - 1]
          const transition = (!isFirst && !isLast) ? transitions[ci - 1] : null;
          const nextChord  = chords[ci + 1] ?? null;

          return (
            <div key={`${chord}-${ci}`} className="flex items-start gap-1 flex-shrink-0">
              <ChordPill
                chord={chord}
                transition={transition}
                nextChord={nextChord}
                isEndpoint={isFirst || isLast}
              />
              {!isLast && (
                <Arrow color={transitions[ci]?.color} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function HarmonicJourney({ fromChord, toChord, onLoadRoute, onClose }) {
  const [steps, setSteps] = useState(2);
  const [routes, setRoutes] = useState([]);
  const [generated, setGenerated] = useState(false);

  function handleGenerate() {
    const result = generateRoutes(fromChord, toChord, steps, 8);
    setRoutes(result);
    setGenerated(true);
  }

  function handleLoad(chords) {
    onLoadRoute(chords);
    onClose();
  }

  return (
    <div className="bg-jazz-surface border border-jazz-border rounded-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-jazz-border bg-jazz-card/50">
        <div>
          <p className="font-semibold text-white text-sm leading-none">Voyage harmonique</p>
          <p className="text-xs text-jazz-muted mt-0.5">
            Trouver des routes entre{' '}
            <span className="text-jazz-accent font-bold">{fromChord}</span>
            {' → '}
            <span className="text-jazz-accent font-bold">{toChord}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center
                     text-jazz-muted hover:text-white hover:bg-jazz-border transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

          {/* Step count */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-jazz-muted uppercase tracking-widest font-semibold">
              Accords intermédiaires
            </p>
            <div className="flex gap-2">
              {STEP_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => { setSteps(n); setGenerated(false); }}
                  className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all
                              ${steps === n
                                ? 'bg-jazz-accent border-jazz-accent text-black'
                                : 'bg-jazz-card border-jazz-border text-jazz-muted hover:text-white'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-jazz-accent hover:brightness-110 text-black font-bold text-sm
                       transition-all active:scale-95 sm:ml-auto"
          >
            <RotateCcw size={14} />
            Générer les routes
          </button>
        </div>

        {/* ── Hint ── */}
        {!generated && (
          <p className="text-xs text-jazz-muted text-center py-4 border border-dashed border-jazz-border rounded-xl">
            Choisissez le nombre d'accords intermédiaires, puis cliquez sur « Générer les routes ».
            <br />
            <span className="text-white">Cliquez sur un accord coloré</span> pour voir l'explication théorique.
          </p>
        )}

        {/* ── Results ── */}
        {generated && routes.length === 0 && (
          <p className="text-xs text-jazz-muted text-center py-4">
            Aucune route trouvée pour cette combinaison.
          </p>
        )}

        {generated && routes.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-jazz-muted">
              <span className="text-white font-semibold">{routes.length} routes</span> trouvées
              {' '}· cliquez un accord coloré pour l'explication ·
              <span className="text-jazz-accent"> Charger</span> pour l'utiliser
            </p>
            {routes.map((route, i) => (
              <RouteRow
                key={route.chords.join('-')}
                route={route}
                index={i}
                onLoad={handleLoad}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
