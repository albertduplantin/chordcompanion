/**
 * progressions.js
 * Bibliothèque de progressions d'accords commentées pour débutants.
 * Chaque progression comporte une description de style et un lien YouTube vers une référence.
 */

export const PROGRESSION_LIBRARY = [
  // ── Jazz ──────────────────────────────────────────────────────────────────
  {
    id: 'ii-v-i',
    name: 'II–V–I Jazz',
    chords: 'Dm7 G7 Cmaj7',
    category: 'Jazz',
    style: 'Standard · Bebop',
    description:
      'La brique fondamentale du jazz. La tension du G7 (dominante) se résout naturellement sur Cmaj7 (tonique). On la retrouve dans quasiment tous les standards de jazz.',
    example: 'Autumn Leaves — Bill Evans',
    youtubeUrl: 'https://www.youtube.com/results?search_query=autumn+leaves+bill+evans+trio+piano',
  },
  {
    id: 'turnaround',
    name: 'Turnaround I–VI–II–V',
    chords: 'Cmaj7 Am7 Dm7 G7',
    category: 'Jazz',
    style: 'Standard · Swing',
    description:
      'Le "turnaround" par excellence. Cette progression en boucle donne l\'impression d\'un cercle harmonique sans fin. Base de centaines de standards (Rhythm Changes, Take the A Train…).',
    example: 'I Got Rhythm — Charlie Parker',
    youtubeUrl: 'https://www.youtube.com/results?search_query=i+got+rhythm+charlie+parker+jazz',
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    chords: 'Cm7 F7 Bbmaj7 Ebmaj7 Am7b5 D7 Gm7',
    category: 'Jazz',
    style: 'Standard · Jazz lent',
    description:
      'L\'un des standards les plus joués au monde. La progression passe par deux tonalités (Sib majeur et Sol mineur) avec un II–V–I dans chaque. Idéale pour apprendre à naviguer les tonalités.',
    example: 'Autumn Leaves — Miles Davis (1958)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=autumn+leaves+miles+davis+1958',
  },
  {
    id: 'blues-jazz',
    name: 'Blues Jazz (12 mesures)',
    chords: 'C7 F7 C7 C7 F7 F7 C7 C7 G7 F7 C7 G7',
    category: 'Jazz',
    style: 'Blues · Jazz',
    description:
      'Le blues en 12 mesures version jazz. Les accords de 7e dominante donnent cette couleur blues typique. La structure AAB (4+4+4 mesures) est le schéma de base du blues.',
    example: 'Freddie Freeloader — Miles Davis',
    youtubeUrl: 'https://www.youtube.com/results?search_query=freddie+freeloader+miles+davis+kind+of+blue',
  },
  {
    id: 'so-what',
    name: 'So What (Modal)',
    chords: 'Dm7 Dm7 Dm7 Dm7 Ebm7 Ebm7 Dm7 Dm7',
    category: 'Jazz',
    style: 'Jazz modal · Moderne',
    description:
      'Exemple emblématique du jazz modal. Au lieu de progresser par le cycle des quintes, on reste longtemps sur le même accord. Miles Davis a révolutionné le jazz avec cette approche en 1959.',
    example: 'So What — Miles Davis (Kind of Blue, 1959)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=so+what+miles+davis+kind+of+blue',
  },
  {
    id: 'coltrane',
    name: 'Coltrane Changes',
    chords: 'Cmaj7 Ab7 Dbmaj7 A7 Emaj7 C7 Cmaj7',
    category: 'Jazz',
    style: 'Jazz moderne · Avancé',
    description:
      'Inventé par John Coltrane, ce cycle divise l\'octave en trois parties égales (tierces majeures). Chaque accord est à distance de tierce majeure du suivant. Très sophistiqué et caractéristique de Giant Steps.',
    example: 'Giant Steps — John Coltrane (1960)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=giant+steps+john+coltrane+piano',
  },

  // ── Bossa Nova ────────────────────────────────────────────────────────────
  {
    id: 'ipanema',
    name: 'Garota de Ipanema',
    chords: 'Fmaj7 G7 Gm7 Gb7',
    category: 'Bossa Nova',
    style: 'Bossa Nova · Brésil',
    description:
      'L\'une des chansons les plus enregistrées de l\'histoire. La substitution de triton (Gb7 au lieu de C7) donne ce mouvement chromatique si caractéristique de la bossa nova brésilienne.',
    example: 'The Girl from Ipanema — Astrud Gilberto & João Gilberto',
    youtubeUrl: 'https://www.youtube.com/results?search_query=girl+from+ipanema+astrud+gilberto+original',
  },
  {
    id: 'blue-bossa',
    name: 'Blue Bossa',
    chords: 'Cm7 Fm7 Dm7b5 G7 Cm7',
    category: 'Bossa Nova',
    style: 'Bossa Nova · Standard',
    description:
      'Un standard composé par Kenny Dorham. La progression reste en Do mineur mais utilise des accords empruntés qui donnent une couleur latine et mélancolique typique de la bossa nova.',
    example: 'Blue Bossa — Joe Henderson Quartet',
    youtubeUrl: 'https://www.youtube.com/results?search_query=blue+bossa+joe+henderson+quartet',
  },

  // ── Blues ─────────────────────────────────────────────────────────────────
  {
    id: 'blues-12',
    name: 'Blues classique (12 mesures)',
    chords: 'C7 C7 C7 C7 F7 F7 C7 C7 G7 F7 C7 C7',
    category: 'Blues',
    style: 'Blues · Rock · Soul',
    description:
      'La forme blues traditionnelle en 12 mesures. Trois accords de dominante (I7, IV7, V7) structurent la progression. Apprise par tous les guitaristes et pianistes, c\'est la base de tout le rock\'n\'roll.',
    example: 'Johnny B. Goode — Chuck Berry',
    youtubeUrl: 'https://www.youtube.com/results?search_query=johnny+b+goode+chuck+berry+original',
  },
  {
    id: 'blues-mineur',
    name: 'Blues mineur',
    chords: 'Cm7 Fm7 Cm7 Cm7 Fm7 Fm7 Cm7 Cm7 Dm7b5 G7 Cm7 G7',
    category: 'Blues',
    style: 'Blues · Funk · Soul',
    description:
      'Version mineure du blues en 12 mesures. Plus sombre et intense, elle est la base de beaucoup de funk et soul. Le Dm7b5-G7 en mesures 9-10 donne une couleur jazz plus sophistiquée.',
    example: 'Mercy Mercy Mercy — Joe Zawinul',
    youtubeUrl: 'https://www.youtube.com/results?search_query=mercy+mercy+mercy+cannonball+adderley+live',
  },

  // ── Pop ───────────────────────────────────────────────────────────────────
  {
    id: 'axis',
    name: 'Axis I–V–vi–IV',
    chords: 'Cmaj7 G7 Am7 Fmaj7',
    category: 'Pop',
    style: 'Pop · Rock · Variété',
    description:
      'La progression la plus utilisée dans la pop moderne. On la retrouve dans des centaines de tubes : "Let It Be" (Beatles), "No Woman No Cry" (Bob Marley), "With or Without You" (U2)…',
    example: 'Let It Be — The Beatles',
    youtubeUrl: 'https://www.youtube.com/results?search_query=let+it+be+beatles+original+recording',
  },
  {
    id: 'andalou',
    name: 'Cadence Andalouse',
    chords: 'Am G F E7',
    category: 'Pop',
    style: 'Flamenco · Latin · Pop',
    description:
      'Descendante chromatique typique de la musique andalouse et flamenco. On la retrouve dans "Hit the Road Jack" (Ray Charles), "Stairway to Heaven" (Led Zeppelin), et de nombreux titres latins.',
    example: 'Hit the Road Jack — Ray Charles',
    youtubeUrl: 'https://www.youtube.com/results?search_query=hit+the+road+jack+ray+charles+original',
  },
];

export const CATEGORIES = ['Tous', 'Jazz', 'Bossa Nova', 'Blues', 'Pop'];
