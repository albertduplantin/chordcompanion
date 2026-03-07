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
  if (!meta) return null;
  const ch = Note.chroma(pc);
  if (ch === Note.chroma(meta.root)) return 'root';
  if (meta.third   && ch === Note.chroma(meta.third))   return 'third';
  if (meta.seventh && ch === Note.chroma(meta.seventh)) return 'seventh';
  // 'other' only for notes actually IN the chord (e.g. the 5th)
  if (meta.notes.some(n => Note.chroma(n) === ch)) return 'other';
  return null; // note is not part of this chord → no color
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
  const v7Root = Note.simplify(Note.transpose(root, '5P'));
  suggestions.push({
    label: 'V/V',
    category: 'Fonctionnel',
    symbol: `${v7Root}7`,
    tagline: 'Dominante secondaire',
    description:
      `💡 Principe : En musique, chaque accord "veut" aller vers un autre. ` +
      `${v7Root}7 "veut" aller vers ${root} parce que sa tierce (${Note.simplify(Note.transpose(v7Root, '3M'))}) ` +
      `est la note sensible de ${root} — elle est à un demi-ton et monte naturellement. ` +
      `C'est comme tendre un élastique : plus vous le tendez (V7), plus la détente (${root}) est satisfaisante. ` +
      `\n\n🎹 Comment jouer : placez ${v7Root}7 juste avant ${root}. Écoutez comment il "attire" l'oreille. ` +
      `C'est la technique n°1 du jazz : transformer n'importe quel accord en point d'arrivée de sa propre dominante.`,
    color: 'blue',
  });

  // ② Substitution tritonique — SubV7
  const subRoot = Note.simplify(Note.transpose(v7Root, '4A'));
  suggestions.push({
    label: 'SubV7',
    category: 'Substitution',
    symbol: `${subRoot}7`,
    tagline: 'Substitution tritonique',
    description:
      `💡 Principe : ${subRoot}7 est à exactement 6 demi-tons (un "triton") de ${v7Root}7. ` +
      `La magie : ces deux accords partagent les mêmes notes-guides — la tierce de l'un devient la septième de l'autre ! ` +
      `Résultat : ils créent la même tension, mais ${subRoot}7 → ${root} descend chromatiquement (un demi-ton), ` +
      `ce qui sonne infiniment plus sophistiqué que le V7 classique. ` +
      `\n\n🎹 Comment jouer : remplacez ${v7Root}7 par ${subRoot}7. La basse descend d'un demi-ton vers ${root}. ` +
      `C'est le son "jazz moderne" que vous entendez chez Bill Evans ou Herbie Hancock.`,
    color: 'purple',
  });

  // ③ Diminué chromatique — dim7
  const dimRoot = Note.simplify(Note.transpose(root, '-2m'));
  suggestions.push({
    label: 'dim7',
    category: 'Chromatique',
    symbol: `${dimRoot}dim7`,
    tagline: 'Diminué chromatique',
    description:
      `💡 Principe : L'accord diminué est symétrique — ses 4 notes sont séparées par exactement 3 demi-tons chacune. ` +
      `Placé un demi-ton sous ${root}, chacune de ses notes monte d'un demi-ton pour rejoindre une note de ${root}. ` +
      `C'est comme 4 flèches pointant toutes vers la cible en même temps. Tension extrême, résolution cristalline. ` +
      `\n\n🎹 Comment jouer : ${dimRoot}dim7 → ${root}. ` +
      `Essayez de monter chromatiquement F → F#dim7 → G : c'est le passage classique du blues et du gospel. ` +
      `Jouez-le vite (croche) pour un effet dramatique.`,
    color: 'orange',
  });

  // ④ Dominante "Backdoor" — bVII7
  const bvii7Root = Note.simplify(Note.transpose(root, '-2M'));
  suggestions.push({
    label: 'bVII7',
    category: 'Modal',
    symbol: `${bvii7Root}7`,
    tagline: 'Backdoor dominant',
    description:
      `💡 Principe : Normalement on arrive sur ${root} "par en haut" (avec ${v7Root}7). ` +
      `Le "backdoor" arrive "par derrière" — un ton entier en dessous, avec ${bvii7Root}7. ` +
      `Cet accord est emprunté au mode Mixolydien/Dorien : il n'a pas de sensible, donc la résolution est plus douce, ` +
      `plus "posée", avec un mouvement ascendant de seconde majeure. ` +
      `\n\n🎹 Comment jouer : ${bvii7Root}7 → ${root}. ` +
      `C'est le son de la soul et du funk — pensez Ray Charles, Stevie Wonder, ou les ballades de Miles Davis. ` +
      `Parfait pour finir un morceau avec élégance sans brutalité.`,
    color: 'teal',
  });

  // ⑤ Préparation II — ii7
  const ii7Root = Note.simplify(Note.transpose(root, '2M'));
  suggestions.push({
    label: 'ii7',
    category: 'Fonctionnel',
    symbol: `${ii7Root}m7`,
    tagline: 'Préparation II-V',
    description:
      `💡 Principe : La formule II-V-I (${ii7Root}m7 → ${v7Root}7 → ${root}) est ` +
      `le moteur harmonique du jazz — on la retrouve dans 90% des standards. ` +
      `Le ii7 prépare la tension (comme prendre de l'élan), le V7 crée la tension maximale, ` +
      `et le I la résout. C'est un arc narratif complet : départ → tension → repos. ` +
      `\n\n🎹 Comment jouer : insérez ${ii7Root}m7, puis jouez ${v7Root}7 juste avant ${root}. ` +
      `Une fois que vous entendez cette formule, vous la reconnaîtrez partout — et vous pourrez ` +
      `improviser dessus avec la gamme de ${root} majeur ou le mode Dorien sur ${ii7Root}m7.`,
    color: 'green',
  });

  // ⑥ Dominante augmentée — V+7
  suggestions.push({
    label: 'V+7',
    category: 'Altéré',
    symbol: `${v7Root}7#5`,
    tagline: 'Dominante augmentée',
    description:
      `💡 Principe : Comme ${v7Root}7 (dominante classique), mais avec une quinte augmentée ` +
      `(#5 = un demi-ton au-dessus de la quinte normale). ` +
      `Ce #5 est instable et "veut" descendre d'un demi-ton pour rejoindre la fondamentale de ${root}. ` +
      `Vous obtenez une ligne chromatique supplémentaire qui rend la résolution encore plus inévitable. ` +
      `\n\n🎹 Comment jouer : utilisez ${v7Root}7#5 à la place de ${v7Root}7 pour plus de tension. ` +
      `C'est un accord "altéré" typique du bebop et du jazz moderne. ` +
      `Sur ce voicing, essayez d'improviser avec la gamme altérée de ${v7Root} (7e mode de mélodie mineure).`,
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
