/**
 * RouteEngine.js
 * Generates harmonic routes between two chords.
 *
 * Strategy: work BACKWARDS from the target chord.
 * For N intermediate steps, each step applies an "approach type"
 * to produce the chord that logically precedes the current target.
 *
 * Result: fromChord → [N intermediate chords] → toChord
 */

import { Chord, Note } from 'tonal';

// ─── Approach types (what can lead INTO a target chord) ──────────────────────

export const APPROACH_TYPES = [
  {
    id: 'V7',
    label: 'Dominante V7',
    color: '#5B8FD4',        // steel blue
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '5P')) + '7';
    },
    explanation(chord, target) {
      return (
        `${chord} est la dominante de ${target}. ` +
        `Sa tierce monte d'un demi-ton vers la fondamentale de ${target} (note sensible), ` +
        `et sa septième descend d'un demi-ton vers sa tierce. ` +
        `C'est la résolution la plus forte de la musique tonale — un "aimant" irrésistible.`
      );
    },
    youtubeQuery: 'dominante septième résolution jazz théorie',
  },
  {
    id: 'SubV7',
    label: 'Subst. tritonique',
    color: '#9B6BD4',        // purple
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      const v7Root = Note.transpose(tonic, '5P');
      const subRoot = Note.transpose(Note.simplify(v7Root), '4A');
      return Note.simplify(subRoot) + '7';
    },
    explanation(chord, target) {
      return (
        `${chord} est la substitution tritonique de la dominante de ${target}. ` +
        `Il partage les mêmes notes-guides (tierce ↔ septième échangées) avec la dominante classique, ` +
        `mais la basse descend par demi-ton vers ${target} — ` +
        `un mouvement chromatique ultra-sophistiqué typique du jazz moderne (Bill Evans, Herbie Hancock).`
      );
    },
    youtubeQuery: 'substitution tritonique jazz explication',
  },
  {
    id: 'iim7',
    label: 'IIm7 (prép. ii-V)',
    color: '#45A882',        // jade green
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '2M')) + 'm7';
    },
    explanation(chord, target) {
      return (
        `${chord} est le IIm7 de ${target} — la première moitié de la formule ii-V-I. ` +
        `Il prépare la tension harmonique : la basse monte d'une quarte (ou descend d'une quinte), ` +
        `l'oreille anticipe la résolution. ` +
        `Ce mouvement ii → V → I est le moteur du jazz : on le trouve dans 90 % des standards.`
      );
    },
    youtubeQuery: 'ii V I jazz progression explication débutant',
  },
  {
    id: 'dim7',
    label: 'Diminué chromatique',
    color: '#C49040',        // amber
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '-2m')) + 'dim7';
    },
    explanation(chord, target) {
      return (
        `${chord} est un accord diminué situé un demi-ton sous ${target}. ` +
        `L'accord diminué est symétrique (4 notes espacées de 3 demi-tons). ` +
        `Placé sous la cible, chacune de ses notes monte d'un demi-ton pour rejoindre une note de ${target}. ` +
        `C'est 4 lignes chromatiques simultanées — une résolution cristalline, très utilisée en blues et gospel.`
      );
    },
    youtubeQuery: 'accord diminué passing chord blues jazz',
  },
  {
    id: 'bVII7',
    label: 'Backdoor bVII7',
    color: '#4ABAAA',        // teal
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '-2M')) + '7';
    },
    explanation(chord, target) {
      return (
        `${chord} est la "porte de derrière" (backdoor) vers ${target}. ` +
        `Emprunté au mode mixolydien/dorien, il arrive un ton entier sous la cible. ` +
        `Sans note sensible, la résolution est plus douce et posée qu'une dominante classique. ` +
        `C'est le son soul/funk par excellence — Stevie Wonder, Ray Charles, les ballades de Miles Davis.`
      );
    },
    youtubeQuery: 'backdoor dominant jazz soul chord',
  },
  {
    id: 'IV',
    label: 'Sous-dominante IV',
    color: '#D96060',        // coral
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '-5P')) + 'maj7';
    },
    explanation(chord, target) {
      return (
        `${chord} est la sous-dominante de ${target} (un mouvement de quinte descendante). ` +
        `La cadence plagale (IV → I) est une des plus anciennes de la musique occidentale — ` +
        `elle sonne "religieux", apaisé, conclusif. ` +
        `En jazz, on l'utilise pour des résolutions douces, souvent en fin de phrase ou de morceau.`
      );
    },
    youtubeQuery: 'cadence plagale sous-dominante théorie musicale',
  },
  {
    id: 'bIImaj7',
    label: 'bII napolitain',
    color: '#E08040',        // orange
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '-7m')) + 'maj7';
    },
    explanation(chord, target) {
      return (
        `${chord} est l'accord napolitain (bII) de ${target}. ` +
        `Venu de la musique classique (école napolitaine, XVIIe s.), il est bâti sur le IIe degré abaissé. ` +
        `Il crée une couleur modale sombre, légèrement "exotique". ` +
        `En jazz moderne on l'entend chez Coltrane et dans la musique brésilienne (bossanova).`
      );
    },
    youtubeQuery: 'accord napolitain bII musique jazz classique',
  },
  {
    id: 'V7alt',
    label: 'Dominante altérée V7alt',
    color: '#C060A0',        // pink
    generate(target) {
      const tonic = Chord.get(target).tonic;
      if (!tonic) return null;
      return Note.simplify(Note.transpose(tonic, '5P')) + '7#5';
    },
    explanation(chord, target) {
      return (
        `${chord} est la dominante altérée de ${target}. ` +
        `La quinte augmentée (#5) ajoute une tension supplémentaire : ` +
        `elle "veut" descendre d'un demi-ton vers la fondamentale de ${target}. ` +
        `C'est le son du bebop et du jazz moderne — on improvise dessus avec la gamme altérée ` +
        `(7e mode de la mélodie mineure).`
      );
    },
    youtubeQuery: 'dominante altérée jazz gamme altérée',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function youtubeUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/** Enrich an approach type with a concrete chord and target */
export function enrichApproach(type, chord, target) {
  return {
    ...type,
    chord,
    explanation: type.explanation(chord, target),
    youtubeUrl: youtubeUrl(type.youtubeQuery),
  };
}

/** Check a chord symbol is valid */
function isValid(sym) {
  if (!sym) return false;
  const c = Chord.get(sym);
  return !c.empty;
}

// ─── Route generation ─────────────────────────────────────────────────────────

/**
 * Score a route (higher = better):
 *  - Penalise duplicate chords
 *  - Reward strong final approach (V7 or SubV7 directly before target)
 *  - Reward ii-V pair at the end
 */
function scoreRoute(route) {
  const intermediate = route.chords.slice(1, -1);
  let score = 100;

  // Penalise duplicates
  const seen = new Set();
  for (const ch of route.chords) {
    if (seen.has(ch)) { score -= 30; }
    seen.add(ch);
  }

  // Reward V7 or SubV7 as the last intermediate chord
  const lastTransition = route.transitions[route.transitions.length - 1];
  if (lastTransition?.id === 'V7')    score += 20;
  if (lastTransition?.id === 'SubV7') score += 15;
  if (lastTransition?.id === 'iim7')  score += 5;

  // Reward ii-V pair at end (penultimate = iim7, last = V7)
  if (route.transitions.length >= 2) {
    const t1 = route.transitions[route.transitions.length - 2];
    const t2 = route.transitions[route.transitions.length - 1];
    if (t1?.id === 'iim7' && t2?.id === 'V7') score += 20;
  }

  return score;
}

/**
 * Generate harmonic routes from fromChord to toChord
 * with exactly numIntermediate intermediate chords.
 *
 * @param {string} fromChord   - departure chord symbol
 * @param {string} toChord     - destination chord symbol
 * @param {number} numIntermediate - number of chords to insert (1–4)
 * @param {number} maxRoutes   - max routes to return (default 8)
 * @returns {{ chords: string[], transitions: object[], score: number }[]}
 */
export function generateRoutes(fromChord, toChord, numIntermediate, maxRoutes = 8) {
  if (numIntermediate < 1) return [];

  const routes = [];

  // DFS: build intermediate chords backwards from toChord
  // stack entry: { currentTarget, stepsLeft, path, transitions }
  const stack = [{
    currentTarget: toChord,
    stepsLeft: numIntermediate,
    path: [],          // intermediate chords accumulated (in reverse order)
    transitions: [],   // approach types used (in reverse order)
  }];

  while (stack.length > 0) {
    const { currentTarget, stepsLeft, path, transitions } = stack.pop();

    if (stepsLeft === 0) {
      // path is in reverse — build the full chord sequence
      const intermediates = [...path].reverse();
      const chordSeq = [fromChord, ...intermediates, toChord];
      const transSeq = [...transitions].reverse();

      routes.push({
        chords: chordSeq,
        transitions: transSeq,
        score: 0, // filled below
      });
      continue;
    }

    for (const approachType of APPROACH_TYPES) {
      const approachChord = approachType.generate(currentTarget);
      if (!approachChord || !isValid(approachChord)) continue;

      // Avoid obvious dead ends: don't repeat the departure or destination
      // in intermediate positions (unless it's the last step)
      if (approachChord === toChord) continue;
      // Allow fromChord to appear but penalise it in scoring

      stack.push({
        currentTarget: approachChord,
        stepsLeft: stepsLeft - 1,
        path: [...path, approachChord],
        transitions: [...transitions, enrichApproach(approachType, approachChord, currentTarget)],
      });
    }
  }

  // Score and deduplicate
  const seen = new Set();
  const unique = [];
  for (const r of routes) {
    const key = r.chords.join('|');
    if (!seen.has(key)) {
      seen.add(key);
      r.score = scoreRoute(r);
      unique.push(r);
    }
  }

  return unique
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRoutes);
}
