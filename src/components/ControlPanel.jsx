/**
 * ControlPanel.jsx
 * Chord input, BPM, play/stop, metronome toggle, impro mode switch.
 */

import { useState, useRef } from 'react';
import { Play, Square, Music2, Metronome, ChevronRight, RefreshCw } from 'lucide-react';
import { parseProgression } from '../engine/ChordEngine';

const PRESETS = [
  { label: 'II-V-I Jazz', value: 'Dm7 G7 Cmaj7' },
  { label: 'I-VI-II-V', value: 'Cmaj7 Am7 Dm7 G7' },
  { label: 'Autumn Leaves', value: 'Cm7 F7 Bbmaj7 Ebmaj7 Am7b5 D7 Gm7' },
  { label: 'Blues en C', value: 'C7 F7 C7 C7 F7 F7 C7 C7 G7 F7 C7 G7' },
];

export default function ControlPanel({
  onProgressionChange,
  onPlay,
  onStop,
  onMetronomeToggle,
  onImProModeToggle,
  isPlaying,
  metronomeOn,
  imProMode,
  bpm,
  onBpmChange,
  beatIndex,
}) {
  const [inputValue, setInputValue] = useState('Cmaj7 Am7 Dm7 G7');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  function handleInput(val) {
    setInputValue(val);
    const chords = parseProgression(val);
    if (chords.length > 0) {
      setError('');
      onProgressionChange(chords);
    } else if (val.trim()) {
      setError('Accords non reconnus — ex: Cmaj7 Am7 Dm7 G7');
    }
  }

  function handlePreset(val) {
    setInputValue(val);
    handleInput(val);
  }

  // Beat indicator dots
  const beats = [0, 1, 2, 3];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Input chord progression ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-jazz-muted uppercase tracking-widest font-semibold">
          Progression d'accords
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => handleInput(e.target.value)}
            placeholder="ex: Cmaj7 Am7 Dm7 G7"
            className="flex-1 bg-jazz-card border border-jazz-border rounded-lg px-4 py-2.5
                       text-white placeholder-jazz-muted text-sm
                       focus:outline-none focus:border-jazz-accent transition-colors"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mt-1">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => handlePreset(p.value)}
              className="text-xs px-3 py-1 rounded-full bg-jazz-card border border-jazz-border
                         text-jazz-muted hover:text-jazz-accent hover:border-jazz-accent
                         transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Transport controls ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Play / Stop */}
        <button
          onClick={isPlaying ? onStop : onPlay}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm
                      transition-all duration-150
                      ${isPlaying
                        ? 'bg-red-700 hover:bg-red-600 text-white'
                        : 'bg-jazz-accent hover:brightness-110 text-black'}`}
        >
          {isPlaying
            ? <><Square size={14} /> Stop</>
            : <><Play size={14} /> Play</>}
        </button>

        {/* Metronome */}
        <button
          onClick={onMetronomeToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-all
                      ${metronomeOn
                        ? 'bg-jazz-surface border-jazz-accent text-jazz-accent'
                        : 'bg-jazz-card border-jazz-border text-jazz-muted hover:text-white'}`}
        >
          <Music2 size={14} />
          Métronome
        </button>

        {/* Impro Mode */}
        <button
          onClick={onImProModeToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-all
                      ${imProMode
                        ? 'bg-jazz-surface border-purple-500 text-purple-400'
                        : 'bg-jazz-card border-jazz-border text-jazz-muted hover:text-white'}`}
        >
          <ChevronRight size={14} />
          Mode Impro
        </button>

        {/* BPM */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-jazz-muted">BPM</label>
          <input
            type="number"
            min={40}
            max={240}
            value={bpm}
            onChange={e => onBpmChange(Number(e.target.value))}
            className="w-16 bg-jazz-card border border-jazz-border rounded-lg px-2 py-2
                       text-white text-sm text-center focus:outline-none focus:border-jazz-accent"
          />
        </div>
      </div>

      {/* ── Beat indicator ── */}
      {metronomeOn && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-jazz-muted">Beat:</span>
          {beats.map(b => (
            <div
              key={b}
              className={`w-3 h-3 rounded-full transition-all duration-75
                          ${beatIndex === b
                            ? b === 0 ? 'bg-jazz-accent scale-125' : 'bg-white scale-110'
                            : 'bg-jazz-border'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
