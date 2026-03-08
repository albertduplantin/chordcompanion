/**
 * ControlPanel.jsx
 * Chord input, BPM, play/stop, metronome toggle, impro mode switch,
 * and library toggle button.
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Square, Music2, ChevronRight, Library } from 'lucide-react';
import { parseProgression } from '../engine/ChordEngine';

export default function ControlPanel({
  onProgressionChange,
  onPlay,
  onStop,
  onMetronomeToggle,
  onImProModeToggle,
  onOpenLibrary,
  libraryOpen,
  progressionInput,   // controlled from App when library loads a preset
  isPlaying,
  metronomeOn,
  imProMode,
  bpm,
  onBpmChange,
  beatIndex,
}) {
  const [inputValue, setInputValue] = useState(progressionInput ?? 'Cmaj7 Am7 Dm7 G7');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Sync when parent pushes a new value (library selection)
  useEffect(() => {
    if (progressionInput !== undefined && progressionInput !== inputValue) {
      setInputValue(progressionInput);
      setError('');
    }
  }, [progressionInput]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleInput(val) {
    setInputValue(val);
    const chords = parseProgression(val);
    if (chords.length > 0) {
      setError('');
      onProgressionChange(chords, val);
    } else if (val.trim()) {
      setError('Accords non reconnus — ex: Cmaj7 Am7 Dm7 G7');
    }
  }

  const beats = [0, 1, 2, 3];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Input + Library button ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-jazz-muted uppercase tracking-widest font-semibold">
            Progression d'accords
          </label>
          <button
            onClick={onOpenLibrary}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border
                        transition-colors font-medium
                        ${libraryOpen
                          ? 'bg-jazz-accent border-jazz-accent text-black'
                          : 'bg-jazz-card border-jazz-border text-jazz-muted hover:text-jazz-accent hover:border-jazz-accent'}`}
          >
            <Library size={12} />
            Bibliothèque
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => handleInput(e.target.value)}
          placeholder="ex: Cmaj7 Am7 Dm7 G7"
          className="w-full bg-jazz-card border border-jazz-border rounded-lg px-4 py-2.5
                     text-white placeholder-jazz-muted text-sm
                     focus:outline-none focus:border-jazz-accent transition-colors"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* ── Transport controls ── */}
      <div className="flex items-center gap-2 flex-wrap">
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
