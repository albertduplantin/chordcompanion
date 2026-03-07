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
// type 'chord' → full color fill   |   type 'scale' → dot marker only (key stays ivory/black)

function getKeyColor(pc, chordSymbol, scaleNotes, imProMode) {
  if (chordSymbol) {
    const role = getNoteRole(pc, chordSymbol);
    if (role === 'root')    return { type: 'chord', fill: '#ff5566', glow: true,  textDark: true };
    if (role === 'third')   return { type: 'chord', fill: '#4a9eff', glow: true,  textDark: true };
    if (role === 'seventh') return { type: 'chord', fill: '#4aff8a', glow: true,  textDark: true };
    if (role === 'other')   return { type: 'chord', fill: '#c9a84c', glow: false, textDark: true };
  }
  if (imProMode && scaleNotes.includes(pc)) {
    return { type: 'scale', fill: '#c9a84c', glow: false, textDark: false };
  }
  return null;
}

// ─── Single White Key ─────────────────────────────────────────────────────────

function WhiteKey({ pc, x, chordSymbol, scaleNotes, imProMode, onClick }) {
  const color = getKeyColor(pc, chordSymbol, scaleNotes, imProMode);
  const isChord = color?.type === 'chord';
  const isScale = color?.type === 'scale';

  return (
    <g onClick={() => onClick?.(pc)} style={{ cursor: 'pointer' }}>
      {/* Base ivory key — always white/ivory */}
      <rect
        x={x} y={0} width={KEY_W - 1} height={KEY_H} rx={3}
        fill={isChord ? color.fill : 'url(#whiteKeyGrad)'}
        stroke="#444" strokeWidth={1}
        style={isChord && color.glow ? { filter: `drop-shadow(0 0 8px ${color.fill})` } : {}}
      />
      {/* Bottom rounded cap */}
      <rect
        x={x + 1} y={KEY_H - 10} width={KEY_W - 3} height={10} rx={3}
        fill={isChord ? color.fill : '#e0ddd4'}
        style={{ pointerEvents: 'none' }}
      />
      {/* Scale dot (impro mode) — small amber circle, key stays white */}
      {isScale && (
        <circle
          cx={x + (KEY_W - 1) / 2} cy={KEY_H - 16} r={4}
          fill="#c9a84c" opacity={0.85}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {/* Note label */}
      {(isChord || pc === 'C') && (
        <text
          x={x + (KEY_W - 1) / 2} y={KEY_H - 3}
          textAnchor="middle" fontSize={7}
          fontWeight={isChord ? 'bold' : 'normal'}
          fill={isChord && color.textDark ? '#0d0d0f' : '#999'}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {pc}
        </text>
      )}
    </g>
  );
}

// ─── Single Black Key ─────────────────────────────────────────────────────────

function BlackKey({ pc, x, chordSymbol, scaleNotes, imProMode, onClick }) {
  const color = getKeyColor(pc, chordSymbol, scaleNotes, imProMode);
  const isChord = color?.type === 'chord';
  const isScale = color?.type === 'scale';

  return (
    <g onClick={() => onClick?.(pc)} style={{ cursor: 'pointer' }}>
      {/* Shadow depth */}
      <rect x={x + 1} y={1} width={BLACK_W} height={BLACK_H} rx={2}
        fill="rgba(0,0,0,0.55)" style={{ pointerEvents: 'none' }} />
      {/* Key body — always dark unless chord note */}
      <rect
        x={x} y={0} width={BLACK_W} height={BLACK_H} rx={2}
        fill={isChord ? color.fill : 'url(#blackKeyGrad)'}
        stroke="#000" strokeWidth={1}
        style={isChord && color.glow ? { filter: `drop-shadow(0 0 8px ${color.fill})` } : {}}
      />
      {/* Subtle highlight strip on plain black keys */}
      {!isChord && (
        <rect x={x + 3} y={2} width={BLACK_W - 6} height={14} rx={1}
          fill="rgba(255,255,255,0.06)" style={{ pointerEvents: 'none' }} />
      )}
      {/* Scale dot (impro mode) */}
      {isScale && (
        <circle cx={x + BLACK_W / 2} cy={BLACK_H - 9} r={3.5}
          fill="#c9a84c" opacity={0.9} style={{ pointerEvents: 'none' }} />
      )}
      {/* Label on chord notes */}
      {isChord && (
        <text x={x + BLACK_W / 2} y={BLACK_H - 5} textAnchor="middle"
          fontSize={6} fontWeight="bold"
          fill={color.textDark ? '#0d0d0f' : '#fff'}
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
        <defs>
          {/* White key gradient: ivory top, slightly warmer bottom */}
          <linearGradient id="whiteKeyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f9f9f6" />
            <stop offset="85%"  stopColor="#f0ede4" />
            <stop offset="100%" stopColor="#e8e4d8" />
          </linearGradient>
          {/* Black key gradient: deep black with subtle sheen */}
          <linearGradient id="blackKeyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a2a2a" />
            <stop offset="20%"  stopColor="#111111" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width={svgWidth} height={svgHeight} fill="#0d0d0f" rx={8} />
        {/* Piano body/fallboard top edge */}
        <rect x={0} y={9} width={svgWidth} height={4} fill="#1a1a1f" />

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
