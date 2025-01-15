export const defaultSuggestions = [
  {
    id: 1,
    title: "Séance favorite",
    description: "Reprendre une séance sauvegardée",
    icon_name: "Bookmark",
    type: "favorites",
    duration: null, // Durée estimée en minutes
    difficulty: null, // La difficulté dépendra de la séance sauvegardée
    lastUsed: null // Date de dernière utilisation
  },
  {
    id: 2,
    title: "Séance du jour",
    description: "Séance adaptée à vos objectifs",
    icon_name: "Target",
    type: "daily",
    duration: 45, // Durée moyenne en minutes
    difficulty: "adaptive", // S'adapte au niveau de l'utilisateur
    refreshDaily: true // Indique que la séance change chaque jour
  },
  {
    id: 3,
    title: "Séance rapide",
    description: "20-30 minutes d'entraînement",
    icon_name: "Zap",
    type: "quick",
    duration: 25,
    difficulty: "moderate",
    equipment: "minimal" // Indique le matériel nécessaire
  },
  {
    id: 4,
    title: "Full body",
    description: "Entraînement complet du corps",
    icon_name: "Dumbbell",
    type: "full_body",
    duration: 60,
    difficulty: "challenging",
    muscleGroups: ["legs", "push", "pull", "core"] // Groupes musculaires ciblés
  },
  {
    id: 5, // Suggestion d'ajout
    title: "Programme en cours",
    description: "Continuer votre programme actuel",
    icon_name: "Calendar",
    type: "program",
    duration: null,
    difficulty: null,
    programProgress: null // Pourcentage de progression dans le programme
  }
];