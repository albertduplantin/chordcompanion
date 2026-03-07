/**
 * AudioEngine.js
 * Tone.js — Salamander Grand Piano sampler + metronome
 */

import * as Tone from 'tone';

// Salamander Grand Piano samples (hosted by Tone.js team)
const SALAMANDER_BASE = 'https://tonejs.github.io/audio/salamander/';
const SALAMANDER_URLS = {
  A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
  A1: 'A1.mp3', C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
  A2: 'A2.mp3', C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
  A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
  A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
  A5: 'A5.mp3', C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
  A6: 'A6.mp3', C7: 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
  A7: 'A7.mp3', C8: 'C8.mp3',
};

let sampler = null;
let samplerLoadPromise = null;
let samplerLoaded = false;
let metronomeLoop = null;
let isPlaying = false;

// ─── Load Salamander Grand Piano ─────────────────────────────────────────────

export function initSampler(onLoad) {
  if (samplerLoadPromise) return samplerLoadPromise;

  samplerLoadPromise = new Promise((resolve) => {
    const reverb = new Tone.Reverb({ decay: 1.8, wet: 0.18 }).toDestination();

    sampler = new Tone.Sampler({
      urls: SALAMANDER_URLS,
      baseUrl: SALAMANDER_BASE,
      release: 1.2,
      onload: () => {
        samplerLoaded = true;
        sampler.connect(reverb);
        if (onLoad) onLoad();
        resolve(sampler);
      },
    });
  });

  return samplerLoadPromise;
}

export function isSamplerLoaded() { return samplerLoaded; }

async function getSampler() {
  if (!samplerLoadPromise) initSampler();
  await samplerLoadPromise;
  return sampler;
}

// ─── Play a voiced chord (array of { pc, octave, midi }) ─────────────────────

export async function playChord(voicedNotes, duration = '2n') {
  await Tone.start();
  const s = await getSampler();
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

  const s = await getSampler();
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
  if (sampler && samplerLoaded) sampler.releaseAll();
}

export function setBpm(bpm) {
  Tone.getTransport().bpm.value = bpm;
}
