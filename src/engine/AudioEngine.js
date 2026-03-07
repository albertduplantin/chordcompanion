/**
 * AudioEngine.js
 * Tone.js powered Rhodes-style piano + metronome
 */

import * as Tone from 'tone';

let synth = null;
let metronome = null;
let metronomeLoop = null;
let isPlaying = false;
let onBeatCallback = null;

// ─── Initialize synth (Rhodes-like electric piano) ───────────────────────────

function getSynth() {
  if (synth) return synth;

  synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.01,
    modulationIndex: 14,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.002, decay: 0.3, sustain: 0.1, release: 1.2 },
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.002, decay: 0.01, sustain: 1, release: 0.5 },
    volume: -6,
  });

  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.25 }).toDestination();
  const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(reverb);
  chorus.start();
  synth.connect(chorus);

  return synth;
}

// ─── Play a voiced chord (array of { pc, octave, midi }) ─────────────────────

export async function playChord(voicedNotes, duration = '2n') {
  await Tone.start();
  const s = getSynth();
  const noteNames = voicedNotes.map(n => `${n.pc}${n.octave}`);
  s.triggerAttackRelease(noteNames, duration);
}

// ─── Play a full progression ──────────────────────────────────────────────────

export async function playProgression(chordVoicings, bpm = 80, onChordChange) {
  await Tone.start();
  if (isPlaying) stopAll();

  isPlaying = true;
  Tone.getTransport().bpm.value = bpm;
  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  const s = getSynth();
  // Each chord lasts 2 half-notes (one bar at 4/4)
  const barSeconds = Tone.Time('1m').toSeconds();

  chordVoicings.forEach((voiced, idx) => {
    const startTime = idx * barSeconds;
    Tone.getTransport().schedule((time) => {
      const noteNames = voiced.map(n => `${n.pc}${n.octave}`);
      s.triggerAttackRelease(noteNames, '2n', time);
      if (onChordChange) Tone.getDraw().schedule(() => onChordChange(idx), time);
    }, startTime);
  });

  // Mark end of playback
  Tone.getTransport().schedule(() => {
    Tone.getDraw().schedule(() => { isPlaying = false; }, Tone.now());
  }, chordVoicings.length * barSeconds);

  Tone.getTransport().start();
}

// ─── Metronome ────────────────────────────────────────────────────────────────

export async function startMetronome(bpm = 80, onBeat) {
  await Tone.start();
  onBeatCallback = onBeat;
  Tone.getTransport().bpm.value = bpm;

  if (metronomeLoop) { metronomeLoop.stop(); metronomeLoop.dispose(); }

  const clickHi = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
    volume: -10,
  }).toDestination();

  const clickLo = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
    volume: -14,
  }).toDestination();

  let beat = 0;
  metronomeLoop = new Tone.Sequence(
    (time) => {
      const isDownbeat = beat % 4 === 0;
      const click = isDownbeat ? clickHi : clickLo;
      click.triggerAttackRelease(isDownbeat ? 'C5' : 'A4', '32n', time);
      if (onBeat) Tone.getDraw().schedule(() => onBeat(beat % 4), time);
      beat++;
    },
    [0, 1, 2, 3],
    '4n'
  );

  metronomeLoop.start(0);
  Tone.getTransport().start();
}

export function stopMetronome() {
  if (metronomeLoop) { metronomeLoop.stop(); }
  if (!isPlaying) Tone.getTransport().stop();
}

export function stopAll() {
  isPlaying = false;
  if (metronomeLoop) metronomeLoop.stop();
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  if (synth) synth.releaseAll();
}

export function setBpm(bpm) {
  Tone.getTransport().bpm.value = bpm;
}
