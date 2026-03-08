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

  // ── Pop 70s ───────────────────────────────────────────────────────────────
  {
    id: '70s-hotel-california',
    name: 'Hotel California',
    chords: 'Bm F#7 A E G D Em F#7',
    category: 'Pop 70s',
    style: 'Rock · Pop californienne',
    description:
      'La progression d\'accords de la chanson emblématique des Eagles (1977). Elle alterne entre mineur et majeur sur un cycle descendant, donnant ce sentiment de mélancolie rêveuse. Les Eagles alternent guitares acoustique et électrique sur cette base.',
    example: 'Hotel California — Eagles (1977)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=hotel+california+eagles+1977+original',
  },
  {
    id: '70s-dont-stop-me',
    name: 'I–IV–V Pop-Rock 70s',
    chords: 'C F G F',
    category: 'Pop 70s',
    style: 'Rock · Pop · Glam',
    description:
      'La progression I–IV–V est le moteur de tout le rock des années 70. Simple, efficace, elle permet de jouer des centaines de tubes. On la retrouve chez Queen, David Bowie, Elton John — souvent agrémentée de accords de passage pour la rendre plus riche.',
    example: 'Don\'t Stop Me Now — Queen (1978)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=dont+stop+me+now+queen+1978',
  },
  {
    id: '70s-elton-piano-man',
    name: 'Descente de basse (Piano Man)',
    chords: 'C Cmaj7 C7 F Am D7 G G7',
    category: 'Pop 70s',
    style: 'Pop · Piano · Ballade',
    description:
      'Une descente chromatique à la basse (Do–Si–Sib–La) maintient le même accord en changeant uniquement la basse. C\'est la technique pianistique signature d\'Elton John et Billy Joel dans leurs ballades des années 70.',
    example: 'Piano Man — Billy Joel (1973)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=piano+man+billy+joel+1973+original',
  },
  {
    id: '70s-soul-imi-vi-iv',
    name: 'Soul 70s i–VII–VI–VII',
    chords: 'Am G F G',
    category: 'Pop 70s',
    style: 'Soul · Funk · Disco',
    description:
      'La progression mineure i–VII–VI–VII est omniprésente dans la soul et le funk des années 70. Elle donne une couleur modale douce (mode éolien) sans résolution trop marquée, parfaite pour groover en boucle.',
    example: 'Superstition — Stevie Wonder (1972)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=superstition+stevie+wonder+1972+original',
  },
  {
    id: '70s-abba',
    name: 'I–V–vi–iii–IV (ABBA)',
    chords: 'C G Am Em F',
    category: 'Pop 70s',
    style: 'Pop · Variété · Europop',
    description:
      'L\'accord iii (Em ici) est la signature harmonique d\'ABBA et de la pop européenne des années 70. Il crée une couleur lumineuse et mélancolique à la fois, entre majeur et mineur. Très utilisé dans les ballades de l\'époque.',
    example: 'The Winner Takes It All — ABBA (1980)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=winner+takes+it+all+abba+original',
  },
  {
    id: '70s-disco',
    name: 'Disco i–iv–i–V',
    chords: 'Am Dm Am E7',
    category: 'Pop 70s',
    style: 'Disco · Funk · Dance',
    description:
      'La progression mineure classique du disco. Le bassiste joue sur le temps, le guitariste en rythme syncopé ("chic strum"). Cette formule, popularisée par Chic et Donna Summer, est la base de toute la dance music jusqu\'à aujourd\'hui.',
    example: 'Le Freak — Chic (1978)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=le+freak+chic+1978+original',
  },
  {
    id: '70s-soft-rock',
    name: 'Soft Rock I–IV–I–V',
    chords: 'Dmaj7 Gmaj7 Dmaj7 A7',
    category: 'Pop 70s',
    style: 'Soft Rock · AOR · Ballad',
    description:
      'L\'ajout de la septième majeure (maj7) transforme les accords simples en quelque chose de plus sophistiqué et chaleureux, typique du "soft rock" américain des années 70. Carpenters, Chicago, America utilisaient abondamment cette couleur.',
    example: 'We\'ve Only Just Begun — The Carpenters (1970)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=weve+only+just+begun+carpenters+1970',
  },
  {
    id: '70s-prog',
    name: 'Prog Rock (modale)',
    chords: 'Dm C Bb C Dm',
    category: 'Pop 70s',
    style: 'Rock progressif · Psychédélique',
    description:
      'Le mode dorien (mineur avec la sixte majeure) est la couleur harmonique du rock progressif des années 70. La basse de Dm oscille avec C et Bb pour créer une atmosphère à la fois sombre et épique, signature de Pink Floyd ou Yes.',
    example: 'Comfortably Numb — Pink Floyd (1979)',
    youtubeUrl: 'https://www.youtube.com/results?search_query=comfortably+numb+pink+floyd+1979+original',
  },
];

export const CATEGORIES = ['Tous', 'Jazz', 'Bossa Nova', 'Blues', 'Pop', 'Pop 70s'];
