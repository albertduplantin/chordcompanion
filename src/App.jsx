import { useState, useCallback, useEffect } from 'react';
import './App.css';

import ControlPanel from './components/ControlPanel';
import PianoKeyboard from './components/PianoKeyboard';
import PassingChords from './components/PassingChords';
import Tooltip from './components/Tooltip';
import { NOTE_COLORS } from './components/PianoKeyboard';

import {
  parseProgression,
  closestVoicing,
  detectKey,
  getScaleNotes,
  getChordMeta,
} from './engine/ChordEngine';

import {
  playProgression,
  playChord,
  startMetronome,
  stopMetronome,
  stopAll,
  setBpm,
  initSampler,
  isSamplerLoaded,
} from './engine/AudioEngine';

// ─── Default progression ──────────────────────────────────────────────────────
const DEFAULT_PROGRESSION = parseProgression('Cmaj7 Am7 Dm7 G7');

function buildVoicings(chords) {
  const voiced = [];
  let prev = [];
  for (const ch of chords) {
    const v = closestVoicing(ch, prev);
    voiced.push(v);
    prev = v;
  }
  return voiced;
}

export default function App() {
  const [progression, setProgression] = useState(DEFAULT_PROGRESSION);
  const [voicings, setVoicings] = useState(() => buildVoicings(DEFAULT_PROGRESSION));
  const [activeChordIdx, setActiveChordIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [imProMode, setImProMode] = useState(false);
  const [bpm, setBpmState] = useState(80);
  const [beatIndex, setBeatIndex] = useState(-1);
  const [samplerReady, setSamplerReady] = useState(false);

  // Preload the Salamander Grand Piano samples on mount
  useEffect(() => {
    initSampler(() => setSamplerReady(true));
  }, []);

  const activeChord = progression[activeChordIdx] ?? progression[0];
  const key = detectKey(progression);
  const scaleNotes = key ? getScaleNotes(key, 'major') : [];
  const chordMeta = activeChord ? getChordMeta(activeChord) : null;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleProgressionChange(chords) {
    setProgression(chords);
    setVoicings(buildVoicings(chords));
    setActiveChordIdx(0);
  }

  function handleDeleteChord(idx) {
    if (progression.length <= 1) return;
    const newProg = progression.filter((_, i) => i !== idx);
    handleProgressionChange(newProg);
  }

  function handleInsertPassingChord(afterIndex, symbol) {
    const newProg = [
      ...progression.slice(0, afterIndex + 1),
      symbol,
      ...progression.slice(afterIndex + 1),
    ];
    handleProgressionChange(newProg);
  }

  async function handlePlay() {
    if (progression.length === 0) return;
    setIsPlaying(true);
    setActiveChordIdx(0);
    await playProgression(voicings, bpm, (idx) => {
      setActiveChordIdx(idx);
    });
    setIsPlaying(false);
  }

  function handleStop() {
    stopAll();
    setIsPlaying(false);
    setBeatIndex(-1);
  }

  async function handleMetronomeToggle() {
    if (metronomeOn) {
      stopMetronome();
      setMetronomeOn(false);
      setBeatIndex(-1);
    } else {
      setMetronomeOn(true);
      await startMetronome(bpm, (beat) => setBeatIndex(beat));
    }
  }

  function handleBpmChange(val) {
    setBpmState(val);
    setBpm(val);
  }

  async function handleChordClick(idx) {
    setActiveChordIdx(idx);
    if (voicings[idx]) await playChord(voicings[idx], '2n');
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-jazz-bg text-white flex flex-col">

      {/* ── Header ── */}
      <header className="border-b border-jazz-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-jazz-accent flex items-center justify-center text-black font-bold text-sm">
          ♩
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-none">Piano Vibe</h1>
          <p className="text-xs text-jazz-muted">Chord Companion</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {!samplerReady && (
            <div className="flex items-center gap-2 text-xs text-jazz-muted">
              <span className="w-2 h-2 rounded-full bg-jazz-accent animate-pulse" />
              Chargement du piano…
            </div>
          )}
          {key && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-jazz-muted">Tonalité :</span>
              <span className="text-jazz-accent font-bold">{key} Majeur</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">

        {/* Control Panel */}
        <section className="bg-jazz-surface border border-jazz-border rounded-2xl p-5">
          <ControlPanel
            onProgressionChange={handleProgressionChange}
            onPlay={handlePlay}
            onStop={handleStop}
            onMetronomeToggle={handleMetronomeToggle}
            onImProModeToggle={() => setImProMode(v => !v)}
            isPlaying={isPlaying}
            metronomeOn={metronomeOn}
            imProMode={imProMode}
            bpm={bpm}
            onBpmChange={handleBpmChange}
            beatIndex={beatIndex}
          />
        </section>

        {/* Chord progression strip */}
        <section className="bg-jazz-surface border border-jazz-border rounded-2xl p-5">
          <p className="text-xs text-jazz-muted uppercase tracking-widest font-semibold mb-4">
            Progression — cliquer un accord pour l'entendre
          </p>

          <div className="flex items-center flex-wrap gap-1">
            {progression.map((chord, idx) => {
              const voiced = voicings[idx] ?? [];
              const isActive = idx === activeChordIdx;
              const meta = getChordMeta(chord);

              return (
                <div key={`${chord}-${idx}`} className="flex items-center gap-1">
                  {/* Chord card */}
                  <div className="relative group">
                    <button
                      onClick={() => handleChordClick(idx)}
                      className={`relative flex flex-col items-center px-4 py-3 rounded-xl border
                                  transition-all duration-150 min-w-[72px]
                                  ${isActive
                                    ? 'bg-jazz-accent border-jazz-accent text-black shadow-lg shadow-amber-900/40'
                                    : 'bg-jazz-card border-jazz-border text-white hover:border-jazz-accent'}`}
                    >
                      <span className={`font-bold text-base leading-none ${isActive ? 'text-black' : 'text-white'}`}>
                        {chord}
                      </span>

                      {/* Voice leading mini dots */}
                      <div className="flex gap-0.5 mt-2">
                        {voiced.map((n, ni) => {
                          const colors = { root: '#ff5566', third: '#4a9eff', seventh: '#4aff8a', other: '#c9a84c' };
                          const roles = ['root', 'other', 'third', 'other', 'seventh', 'other', 'other'];
                          const color = colors[roles[ni] ?? 'other'];
                          return (
                            <div
                              key={ni}
                              title={`${n.pc}${n.octave}`}
                              className="w-2 h-2 rounded-full"
                              style={{ background: isActive ? 'rgba(0,0,0,0.4)' : color }}
                            />
                          );
                        })}
                      </div>

                      {/* Note names (voicing) */}
                      <div className="text-xs mt-1 opacity-70 tracking-tight">
                        {voiced.map(n => n.pc).join(' ')}
                      </div>
                    </button>

                    {/* Delete button — visible on hover, hidden if only 1 chord */}
                    {progression.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChord(idx); }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full
                                   bg-red-700 hover:bg-red-500 text-white
                                   flex items-center justify-center text-xs font-bold
                                   opacity-0 group-hover:opacity-100 transition-opacity
                                   shadow-lg z-10"
                        title="Supprimer cet accord"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Passing chord button (after each chord except last) */}
                  {idx < progression.length - 1 && (
                    <PassingChords
                      targetChord={progression[idx + 1]}
                      onInsert={(sym) => handleInsertPassingChord(idx, sym)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Piano keyboard */}
        <section className="bg-jazz-surface border border-jazz-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-jazz-muted uppercase tracking-widest font-semibold">
                Clavier — accord actif
              </p>
              {chordMeta && (
                <p className="text-xl font-bold text-jazz-accent mt-0.5">
                  {activeChord}
                  <span className="ml-3 text-sm font-normal text-jazz-muted">{chordMeta.name}</span>
                </p>
              )}
            </div>

            {imProMode && (
              <div className="text-xs text-purple-400 border border-purple-700 bg-purple-900/30
                              rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <Tooltip term="Mode Impro" side="bottom">
                  <span>Mode Impro — Gamme {key} Majeur</span>
                </Tooltip>
              </div>
            )}
          </div>

          <PianoKeyboard
            chordSymbol={activeChord}
            scaleNotes={scaleNotes}
            imProMode={imProMode}
          />

          {/* Guide tones info */}
          {chordMeta && (
            <div className="flex gap-5 mt-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: NOTE_COLORS.root.fill }} />
                <Tooltip term="Fondamentale">
                  <span className="text-jazz-muted">Fondamentale</span>
                </Tooltip>
                <span className="font-bold text-white ml-1">{chordMeta.root}</span>
              </div>
              {chordMeta.third && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: NOTE_COLORS.third.fill }} />
                  <Tooltip term="Tierce">
                    <span className="text-jazz-muted">Tierce</span>
                  </Tooltip>
                  <span className="font-bold text-white ml-1">{chordMeta.third}</span>
                </div>
              )}
              {chordMeta.seventh && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: NOTE_COLORS.seventh.fill }} />
                  <Tooltip term="Septième">
                    <span className="text-jazz-muted">Septième</span>
                  </Tooltip>
                  <span className="font-bold text-white ml-1">{chordMeta.seventh}</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Tips panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              color: 'border-blue-800 bg-blue-950/30',
              title: 'Conduite des voix',
              tooltip: 'Conduite des voix',
              text: 'Les voicings s\'enchaînent pour minimiser le mouvement des doigts. Survolez les accords pour voir le renversement calculé automatiquement.',
            },
            {
              color: 'border-amber-800 bg-amber-950/30',
              title: 'Notes guides',
              tooltip: null,
              text: 'Fondamentale (rouge) · Tierce (bleu) · Septième (jade) · Quinte (ambre). Finissez vos phrases impro sur la tierce ou septième pour sonner jazz.',
            },
            {
              color: 'border-purple-800 bg-purple-950/30',
              title: 'Accords de passage',
              tooltip: null,
              text: 'Cliquez « + » entre deux accords pour 6 suggestions : dominante secondaire, substitution tritonique, diminué, backdoor, II-V, augmenté.',
            },
          ].map(tip => (
            <div key={tip.title} className={`rounded-xl border p-4 ${tip.color}`}>
              <p className="font-semibold text-sm mb-1">
                {tip.tooltip
                  ? <Tooltip term={tip.tooltip}>{tip.title}</Tooltip>
                  : tip.title}
              </p>
              <p className="text-xs text-jazz-muted leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </section>

      </main>

      <footer className="border-t border-jazz-border px-6 py-3 text-center text-xs text-jazz-muted">
        Piano Vibe Chord Companion — React + Tailwind + Tone.js + Tonal.js
      </footer>
    </div>
  );
}
