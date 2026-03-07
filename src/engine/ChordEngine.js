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
 * Returns passing chord suggestions for a target chord.
 * Each entry includes: label, category, symbol, tagline, description, color.
 * @param {string} targetChord - the chord we're resolving TO
 * @returns {{ label, category, symbol, tagline, description, color }[]}
 */
export function getPassingChords(targetChord) {
  const target = Chord.get(targetChord);
  if (!target || target.empty) return [];

  const root = target.tonic; // e.g. 'G'
  if (!root) return [];

  const suggestions = [];

  // ① Dominante secondaire — V7/X
  // Accord de dominante construit une quinte JUSTE au-dessus de la cible.
  // Contient la sensible (7e majeure) de la cible → attraction magnétique.
  const v7Root = Note.simplify(Note.transpose(root, '5P'));
  suggestions.push({
    label: 'V/V',
    category: 'Fonctionnel',
    symbol: `${v7Root}7`,
    tagline: 'Dominante secondaire',
    description: `Accord 7 construit une quinte au-dessus de ${root}. Sa tierce est la sensible de ${root} : elle "tire" l'oreille vers la résolution. Technique fondamentale du jazz.`,
    color: 'blue',
  });

  // ② Substitution tritonique — SubV7
  // Remplace le V7 par un accord à distance de triton (6 demi-tons).
  // Magie : les notes guides (3e et 7e) sont les mêmes, juste inversées.
  const subRoot = Note.simplify(Note.transpose(v7Root, '4A')); // triton du V7
  suggestions.push({
    label: 'SubV7',
    category: 'Substitution',
    symbol: `${subRoot}7`,
    tagline: 'Substitution tritonique',
    description: `Remplace le ${v7Root}7 par son équivalent à distance de triton. Partage exactement les mêmes notes-guides (3e↔7e inversées). Ligne de basse chromatique descendante. Son jazz moderne et "mystérieux".`,
    color: 'purple',
  });

  // ③ Diminué chromatique — dim7
  // Accord de 7e diminuée un demi-ton sous la cible.
  // Symétrie parfaite : peut résoudre vers n'importe quelle note.
  const dimRoot = Note.simplify(Note.transpose(root, '-2m'));
  suggestions.push({
    label: 'dim7',
    category: 'Chromatique',
    symbol: `${dimRoot}dim7`,
    tagline: 'Diminué chromatique',
    description: `7e diminuée un demi-ton sous ${root}. Chacune de ses 4 notes monte d'un demi-ton pour rejoindre l'accord cible. Tension maximale, résolution claire. Très utilisé en blues et gospel.`,
    color: 'orange',
  });

  // ④ Dominante "Backdoor" — bVII7
  // Accord de dominante un ton entier en dessous de la cible.
  // Emprunté au mode Mixolydien/Dorien : résolution par mouvement ascendant doux.
  const bvii7Root = Note.simplify(Note.transpose(root, '-2M'));
  suggestions.push({
    label: 'bVII7',
    category: 'Modal',
    symbol: `${bvii7Root}7`,
    tagline: 'Backdoor dominant',
    description: `Dominant 7 un ton entier sous ${root}, emprunté au mode Dorien. Résolution "par derrière" (backdoor) : mouvement ascendant doux et bluesy. Signature sonore de la soul, du funk et du jazz modal.`,
    color: 'teal',
  });

  // ⑤ Préparation II — ii7
  // Le ii7 de la cible prépare un mini II-V-I.
  // Formule magique du jazz : ii7 → V7 → I.
  const ii7Root = Note.simplify(Note.transpose(root, '2M'));
  suggestions.push({
    label: 'ii7',
    category: 'Fonctionnel',
    symbol: `${ii7Root}m7`,
    tagline: 'Préparation II-V',
    description: `Le ii7 de ${root} pour créer un mini II-V avant la résolution. Enchaîner ${ii7Root}m7 → ${v7Root}7 → ${root} est la formule fondamentale du jazz. Prépare et intensifie la tension.`,
    color: 'green',
  });

  // ⑥ Dominante augmentée — V+7
  // Comme le V7 mais avec une quinte augmentée (#5).
  // Le #5 crée une ligne chromatique descendante vers la fondamentale cible.
  suggestions.push({
    label: 'V+7',
    category: 'Altéré',
    symbol: `${v7Root}7#5`,
    tagline: 'Dominante augmentée',
    description: `Comme le ${v7Root}7 mais avec une quinte augmentée (#5). Le #5 descend chromatiquement pour rejoindre la fondamentale de ${root}. Tension supplémentaire avant la résolution — son très jazz.`,
    color: 'red',
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
