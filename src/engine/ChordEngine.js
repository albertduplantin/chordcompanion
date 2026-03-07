/**
 * ChordEngine.js
 * Music theory logic using Tonal.js
 * Handles: chord parsing, voicing, voice leading, passing chords
 */

import { Chord, Note, Interval, Scale, Key } from 'tonal';

// ─── Note → MIDI number ─────────────────────────────────────────────────────

export function noteToMidi(noteName) {
  return Note.midi(noteName);
}

export function midiToNote(midi) {
  return Note.fromMidi(midi);
}

// ─── All 12 chromatic pitch classes (for distance calc) ─────────────────────

const CHROMA_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteChroma(note) {
  return Note.chroma(note) ?? 0;
}

// ─── Parse a chord symbol into its notes ────────────────────────────────────

export function getChordNotes(chordSymbol) {
  const chord = Chord.get(chordSymbol);
  if (!chord || chord.empty) return [];
  return chord.notes; // pitch classes e.g. ['C', 'E', 'G', 'B']
}

// ─── Chord metadata (root, quality, guide tones) ────────────────────────────

export function getChordMeta(chordSymbol) {
  const chord = Chord.get(chordSymbol);
  if (!chord || chord.empty) return null;

  const root = chord.tonic;
  const notes = chord.notes;

  // Guide tones: 3rd (index 1) and 7th (index 3 for 7th chords)
  const third = notes[1] || null;
  const seventh = notes.length >= 4 ? notes[3] : null;

  return { root, notes, third, seventh, symbol: chordSymbol, name: chord.name };
}

// ─── Build a voiced chord: notes with octave numbers ────────────────────────
// We spread the chord across octaves 3–5, starting near a reference MIDI note.

export function buildVoicedChord(chordSymbol, referenceNote = 'C4') {
  const chord = Chord.get(chordSymbol);
  if (!chord || chord.empty) return [];

  const refMidi = Note.midi(referenceNote) ?? 60;
  const pitchClasses = chord.notes; // e.g. ['C', 'E', 'G', 'B']

  if (pitchClasses.length === 0) return [];

  // Find the best starting octave so the root is close to the reference
  const rootChroma = Note.chroma(pitchClasses[0]) ?? 0;
  const refChroma = Note.chroma(referenceNote) ?? 0;
  const refOctave = Note.octave(referenceNote) ?? 4;

  // Rough starting octave for root
  let rootOctave = refOctave;
  const rootMidiAtOctave = Note.midi(`${pitchClasses[0]}${rootOctave}`) ?? 60;
  if (rootMidiAtOctave < refMidi - 6) rootOctave += 1;
  if (rootMidiAtOctave > refMidi + 6) rootOctave -= 1;

  // Build ascending from the root
  const voiced = [];
  let lastMidi = Note.midi(`${pitchClasses[0]}${rootOctave}`) ?? 48;
  voiced.push({ pc: pitchClasses[0], octave: rootOctave, midi: lastMidi });

  for (let i = 1; i < pitchClasses.length; i++) {
    const pc = pitchClasses[i];
    let octave = rootOctave;
    let midi = Note.midi(`${pc}${octave}`) ?? 0;

    // Make sure each note is above the previous
    while (midi <= lastMidi) {
      octave += 1;
      midi = Note.midi(`${pc}${octave}`) ?? 0;
    }

    voiced.push({ pc, octave, midi });
    lastMidi = midi;
  }

  return voiced;
}

// ─── Voice Leading: find closest voicing to previous chord ──────────────────
// Returns voiced notes shifted so the total distance from prev voicing is min.

export function closestVoicing(chordSymbol, prevVoicing = []) {
  const chord = Chord.get(chordSymbol);
  if (!chord || chord.empty) return [];

  const pitchClasses = chord.notes;
  if (pitchClasses.length === 0) return [];

  if (prevVoicing.length === 0) {
    // No reference: build default around C4
    return buildVoicedChord(chordSymbol, 'C4');
  }

  // Anchor: use the average MIDI of previous voicing as center
  const avgMidi = prevVoicing.reduce((s, n) => s + n.midi, 0) / prevVoicing.length;

  // For each pitch class, find the nearest instance to its "ideal" position
  // Strategy: build chord ascending from the note nearest to prevVoicing[0]
  const refMidi = prevVoicing[0]?.midi ?? 60;
  const rootPc = pitchClasses[0];

  // Find closest octave for root
  let bestRootMidi = null;
  let bestDiff = Infinity;
  for (let oct = 2; oct <= 6; oct++) {
    const m = Note.midi(`${rootPc}${oct}`);
    if (m != null) {
      const diff = Math.abs(m - refMidi);
      if (diff < bestDiff) { bestDiff = diff; bestRootMidi = m; }
    }
  }

  // Build chord ascending from bestRootMidi
  const voiced = [];
  const rootNote = Note.fromMidi(bestRootMidi);
  const rootOctave = Note.octave(rootNote);

  let lastMidi = bestRootMidi;
  voiced.push({ pc: rootPc, octave: rootOctave, midi: bestRootMidi });

  for (let i = 1; i < pitchClasses.length; i++) {
    const pc = pitchClasses[i];
    let octave = rootOctave;
    let midi = Note.midi(`${pc}${octave}`) ?? 0;
    while (midi <= lastMidi) { octave += 1; midi = Note.midi(`${pc}${octave}`) ?? 0; }
    voiced.push({ pc, octave, midi });
    lastMidi = midi;
  }

  return voiced;
}

// ─── Role of each note in the chord (root / third / seventh / other) ─────────

export function getNoteRole(pc, chordSymbol) {
  const meta = getChordMeta(chordSymbol);
  if (!meta) return 'other';
  if (Note.chroma(pc) === Note.chroma(meta.root)) return 'root';
  if (meta.third && Note.chroma(pc) === Note.chroma(meta.third)) return 'third';
  if (meta.seventh && Note.chroma(pc) === Note.chroma(meta.seventh)) return 'seventh';
  return 'other';
}

// ─── Detect key / tonal center from a chord list ────────────────────────────

export function detectKey(chordSymbols) {
  // Simple heuristic: first chord is the tonic
  if (!chordSymbols || chordSymbols.length === 0) return null;
  const first = Chord.get(chordSymbols[0]);
  if (!first || first.empty) return null;
  return first.tonic; // e.g. 'C'
}

// ─── Scale notes for impro mode ──────────────────────────────────────────────

export function getScaleNotes(tonic, scaleName = 'major') {
  const scale = Scale.get(`${tonic} ${scaleName}`);
  return scale.notes ?? [];
}

// ─── Passing chord suggestions ───────────────────────────────────────────────

/**
 * Returns passing chord options between chordA and chordB.
 * @param {string} targetChord - the chord we're resolving TO
 * @returns {{ label, symbol, description }[]}
 */
export function getPassingChords(targetChord) {
  const target = Chord.get(targetChord);
  if (!target || target.empty) return [];

  const root = target.tonic; // e.g. 'G'
  if (!root) return [];

  const rootMidi = Note.midi(`${root}4`) ?? 60;
  const suggestions = [];

  // 1. Secondary dominant: V7 of target  (a perfect 5th above target root)
  const secDomRoot = Note.transpose(root, '5P'); // e.g. D for G target
  const secDomSymbol = `${secDomRoot}7`;
  suggestions.push({
    label: 'V/V',
    symbol: secDomSymbol,
    description: `Dominante secondaire — résout vers ${root}`,
  });

  // 2. Tritone substitution: dom7 a tritone away (b2 of target)
  const tritoneRoot = Note.transpose(root, '2m'); // half step above = b9 of target root
  // Actually tritone sub is b5 interval = augmented 4th above = tritone away
  const tritoneSub = Note.transpose(root, '4A'); // e.g. Db for G
  const tritoneSymbol = `${Note.simplify(tritoneSub)}7`;
  suggestions.push({
    label: 'SubV7',
    symbol: tritoneSymbol,
    description: `Substitution tritonique — résout vers ${root}`,
  });

  // 3. Diminished passing chord: half step below target root
  const dimRoot = Note.transpose(root, '-2m'); // chromatic below
  const dimSymbol = `${Note.simplify(dimRoot)}dim7`;
  suggestions.push({
    label: 'dim7',
    symbol: dimSymbol,
    description: `Accord diminué chromatique → ${root}`,
  });

  return suggestions;
}

// ─── Parse user input into chord list ────────────────────────────────────────

export function parseProgression(input) {
  if (!input || input.trim() === '') return [];
  // Split on spaces/commas/pipes, filter empty
  return input
    .trim()
    .split(/[\s,|]+/)
    .filter(Boolean)
    .map(s => s.replace(/[^A-Za-z0-9#b/]/g, ''))
    .filter(s => {
      const c = Chord.get(s);
      return !c.empty;
    });
}
