/**
 * PianoKeyboard.jsx
 * Interactive 3-octave SVG piano keyboard.
 * Colors: root=red, third=blue, seventh=green, scale=white/translucent, active=gold
 */

import { Note } from 'tonal';
import { getNoteRole } from '../engine/ChordEngine';

// ─── Key layout for one octave ────────────────────────────────────────────────

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = {
  'C#': 1, 'D#': 2, 'F#': 4, 'G#': 5, 'A#': 6,
};
const BLACK_POS = { 'C#': 0.6, 'D#': 1.6, 'F#': 3.6, 'G#': 4.6, 'A#': 5.6 };

const KEY_W = 28;
const KEY_H = 120;
const BLACK_W = 18;
const BLACK_H = 76;
const OCTAVES = [3, 4, 5];

// ─── Color mapping ────────────────────────────────────────────────────────────

function getKeyColor(pc, chordSymbol, scaleNotes, imProMode) {
  if (chordSymbol) {
    const role = getNoteRole(pc, chordSymbol);
    if (role === 'root')    return { fill: '#ff5566', glow: true };
    if (role === 'third')   return { fill: '#4a9eff', glow: true };
    if (role === 'seventh') return { fill: '#4aff8a', glow: true };
    if (role === 'other')   return { fill: '#c9a84c', glow: false };
  }
  if (imProMode && scaleNotes.includes(pc)) {
    return { fill: 'rgba(201,168,76,0.35)', glow: false };
  }
  return null;
}

// ─── Single White Key ─────────────────────────────────────────────────────────

function WhiteKey({ pc, x, chordSymbol, scaleNotes, imProMode, onClick }) {
  const color = getKeyColor(pc, chordSymbol, scaleNotes, imProMode);
  const isSharp = false;

  return (
    <g onClick={() => onClick?.(pc)} style={{ cursor: 'pointer' }}>
      <rect
        x={x}
        y={0}
        width={KEY_W - 1}
        height={KEY_H}
        rx={3}
        fill={color ? color.fill : '#f0ece0'}
        stroke="#1a1a1f"
        strokeWidth={1}
        style={color?.glow ? {
          filter: `drop-shadow(0 0 6px ${color.fill})`,
        } : {}}
      />
      {/* Note label */}
      <text
        x={x + (KEY_W - 1) / 2}
        y={KEY_H - 8}
        textAnchor="middle"
        fontSize={8}
        fill={color ? '#0d0d0f' : '#6b7280'}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {pc}
      </text>
    </g>
  );
}

// ─── Single Black Key ─────────────────────────────────────────────────────────

function BlackKey({ pc, x, chordSymbol, scaleNotes, imProMode, onClick }) {
  const color = getKeyColor(pc, chordSymbol, scaleNotes, imProMode);

  return (
    <g onClick={() => onClick?.(pc)} style={{ cursor: 'pointer', zIndex: 10 }}>
      <rect
        x={x}
        y={0}
        width={BLACK_W}
        height={BLACK_H}
        rx={2}
        fill={color ? color.fill : '#1a1a1f'}
        stroke="#0d0d0f"
        strokeWidth={1}
        style={color?.glow ? {
          filter: `drop-shadow(0 0 6px ${color.fill})`,
        } : {}}
      />
      {color && (
        <text
          x={x + BLACK_W / 2}
          y={BLACK_H - 6}
          textAnchor="middle"
          fontSize={7}
          fill="#0d0d0f"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {pc}
        </text>
      )}
    </g>
  );
}

// ─── Full Keyboard ────────────────────────────────────────────────────────────

export default function PianoKeyboard({ chordSymbol, scaleNotes = [], imProMode = false, onNoteClick }) {
  const totalWhiteKeys = OCTAVES.length * 7;
  const svgWidth = totalWhiteKeys * KEY_W;
  const svgHeight = KEY_H + 20;

  const whiteKeyElements = [];
  const blackKeyElements = [];

  OCTAVES.forEach((octave, octIdx) => {
    const baseX = octIdx * 7 * KEY_W;

    // White keys
    WHITE_KEYS.forEach((noteName, i) => {
      const x = baseX + i * KEY_W;
      const pc = noteName; // pitch class
      whiteKeyElements.push(
        <WhiteKey
          key={`w-${octave}-${noteName}`}
          pc={pc}
          x={x}
          chordSymbol={chordSymbol}
          scaleNotes={scaleNotes}
          imProMode={imProMode}
          onClick={onNoteClick}
        />
      );
    });

    // Black keys
    Object.entries(BLACK_POS).forEach(([noteName, posIdx]) => {
      const x = baseX + posIdx * KEY_W + (KEY_W - BLACK_W) / 2;
      const pc = noteName;
      blackKeyElements.push(
        <BlackKey
          key={`b-${octave}-${noteName}`}
          pc={pc}
          x={x}
          chordSymbol={chordSymbol}
          scaleNotes={scaleNotes}
          imProMode={imProMode}
          onClick={onNoteClick}
        />
      );
    });
  });

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Background */}
        <rect width={svgWidth} height={svgHeight} fill="#0d0d0f" rx={8} />

        {/* White keys (rendered first, below black) */}
        <g transform="translate(0, 10)">
          {whiteKeyElements}
        </g>

        {/* Black keys (rendered on top) */}
        <g transform="translate(0, 10)">
          {blackKeyElements}
        </g>

        {/* Octave labels */}
        {OCTAVES.map((oct, i) => (
          <text
            key={`oct-${oct}`}
            x={i * 7 * KEY_W + 4}
            y={8}
            fontSize={9}
            fill="#6b7280"
            style={{ userSelect: 'none' }}
          >
            C{oct}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#ff5566' }} />
          Fondamentale
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#4a9eff' }} />
          Tierce
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#4aff8a' }} />
          Septième
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#c9a84c' }} />
          Autre
        </span>
      </div>
    </div>
  );
}
