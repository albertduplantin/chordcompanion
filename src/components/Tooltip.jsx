/**
 * Tooltip.jsx
 * Beginner-friendly music term tooltips.
 * Usage: <Tooltip term="Fondamentale">Fondamentale</Tooltip>
 */

// ─── Dictionnaire pédagogique ─────────────────────────────────────────────────

export const MUSIC_TERMS = {
  Fondamentale:
    "La note qui donne son nom à l'accord. Dans Am7, c'est le La (A). " +
    "La basse la joue en général. C'est le « sol » sur lequel repose tout l'accord — " +
    "comme les fondations d'une maison.",

  Tierce:
    "La 2ᵉ note d'un accord (3 degrés au-dessus de la fondamentale). " +
    "Elle définit l'ambiance : tierce majeure (+4 demi-tons) = accord joyeux/lumineux, " +
    "tierce mineure (+3 demi-tons) = accord mélancolique/sombre. " +
    "C'est la note qui donne son « caractère » à l'accord.",

  Quinte:
    "La 3ᵉ note d'un accord (5 degrés au-dessus de la fondamentale). " +
    "Note très stable et neutre — elle « solidifie » l'accord sans trop le colorer. " +
    "Dans un voicing de jazz, on l'omet souvent pour jouer des accords plus denses et modernes.",

  Septième:
    "La 4ᵉ note d'un accord (7 degrés au-dessus de la fondamentale). " +
    "C'est la signature sonore du jazz ! " +
    "Majeure (11 demi-tons) → son doux et ouvert (Cmaj7). " +
    "Mineure (10 demi-tons) → tension et couleur (G7, Am7). " +
    "Les jazzmen finissent leurs phrases sur la tierce ou la septième pour sonner « pro ».",

  Voicing:
    "La façon de disposer les notes d'un accord sur le clavier. " +
    "Un Cmaj7 peut se jouer avec C en bas, ou avec E en bas (premier renversement), etc. " +
    "Le voicing change la couleur sans changer l'accord. " +
    "L'application calcule automatiquement le voicing le plus proche du précédent.",

  "Conduite des voix":
    "L'art de passer d'un accord au suivant en faisant le minimum de mouvement avec les doigts. " +
    "Au lieu de sauter partout sur le clavier, on cherche le « chemin le plus court ». " +
    "Ex : dans un II-V-I en Do, la tierce de Dm7 (F) descend d'un demi-ton pour devenir la 7ᵉ de G7 (F). " +
    "C'est ce qui rend le jeu fluide et professionnel.",

  "II-V-I":
    "La formule harmonique fondamentale du jazz, présente dans 90% des standards. " +
    "II = accord mineur (tension légère, élan), " +
    "V = accord dominant 7 (tension forte, attraction), " +
    "I = accord de résolution (repos, arrivée). " +
    "En Do : Dm7 → G7 → Cmaj7. Une fois que vous l'entendez, vous la reconnaissez partout.",

  "Mode Impro":
    "En mode improvisation, les notes de la gamme correspondante s'affichent sur le clavier. " +
    "Ces notes sonnent harmonieusement avec la progression — vous pouvez improviser librement en les jouant. " +
    "Un point ambre sur la touche indique qu'elle est dans la gamme. " +
    "Commencez par jouer uniquement ces notes : c'est le secret de l'improvisation débutant.",

  "Dominante secondaire":
    "Un accord dominant 7 inséré juste avant un accord cible pour créer une attraction magnétique. " +
    "En jazz, on peut rendre n'importe quel accord « inévitable » en ajoutant son accord dominant juste avant. " +
    "Ex : D7 → G7 : le D7 « veut » résoudre vers G.",

  "Substitution tritonique":
    "Remplacement d'un accord dominant par un autre situé à exactement 6 demi-tons (un triton). " +
    "Ces deux accords partagent leurs notes-guides (la tierce de l'un = la septième de l'autre). " +
    "La basse descend alors chromatiquement — son jazz moderne très sophistiqué.",

  "Backdoor dominant":
    "Un accord dominant qui arrive « par derrière » — un ton entier en dessous de la cible. " +
    "Mouvement ascendant doux et bluesy, à l'inverse du V7 classique qui descend par quinte. " +
    "Signature de la soul, du funk et du jazz modal (Miles Davis, Herbie Hancock).",

  "Préparation II-V":
    "Le ii7 est le premier accord du célèbre enchaînement II-V-I. " +
    "Il prépare doucement la tension avant que le V7 la porte à son maximum. " +
    "Insérer un ii7 avant un V7 est le moyen le plus rapide de sonner jazz.",

  "Dominante augmentée":
    "Accord dominant avec une quinte augmentée (#5 = un demi-ton de plus que normal). " +
    "Ce #5 instable « veut » descendre vers la fondamentale de l'accord cible. " +
    "Crée une tension maximale — son typique du bebop (Charlie Parker, Dizzy Gillespie).",
};

// ─── Composant Tooltip ────────────────────────────────────────────────────────

export default function Tooltip({ term, children, side = 'top' }) {
  const definition = MUSIC_TERMS[term];
  if (!definition) return <>{children}</>;

  const posClass = side === 'bottom'
    ? 'top-full left-0 mt-2'
    : 'bottom-full left-0 mb-2';

  return (
    <span className="relative group inline-flex items-center gap-0.5 cursor-help">
      <span>{children}</span>
      {/* Small "?" badge */}
      <span
        className="ml-0.5 w-3.5 h-3.5 rounded-full bg-jazz-border text-jazz-muted
                   text-[8px] font-bold flex items-center justify-center flex-shrink-0
                   group-hover:bg-jazz-accent group-hover:text-black transition-colors"
      >
        ?
      </span>

      {/* Tooltip bubble */}
      <div
        className={`absolute ${posClass} z-[200] w-72 px-3.5 py-3
                    bg-[#16161f] border border-jazz-accent/40 rounded-xl shadow-2xl
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity duration-150`}
      >
        <p className="font-bold text-jazz-accent text-xs mb-1.5 tracking-wide">{term}</p>
        <p className="text-xs text-gray-300 leading-relaxed">{definition}</p>
      </div>
    </span>
  );
}
