
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
    difficulty: "moderate", // S'adapte au niveau de l'utilisateur
    refreshDaily: true // Indique que la séance change chaque jour
  },
  {
    id: 3,
    title: "Séance rapide",
    description: "3 exercices essentiels en 25 minutes",
    icon_name: "Zap",
    type: "quick",
    duration: 25,
    difficulty: "moderate",
    equipment: "minimal", // Indique le matériel nécessaire
    muscleGroups: ["full_body"]
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
    id: 5,
    title: "Haut du corps",
    description: "Focus sur le torse, les bras et les épaules",
    icon_name: "ArrowUp",
    type: "upper_body",
    duration: 50,
    difficulty: "moderate",
    muscleGroups: ["chest", "back", "arms", "shoulders"]
  },
  {
    id: 6,
    title: "Bas du corps",
    description: "Renforcez vos jambes et fessiers",
    icon_name: "ArrowDown",
    type: "lower_body",
    duration: 45,
    difficulty: "challenging",
    muscleGroups: ["quads", "hamstrings", "glutes", "calves"]
  },
  {
    id: 7,
    title: "Circuit HIIT",
    description: "Brûlez plus de calories en moins de temps",
    icon_name: "Flame",
    type: "hiit",
    duration: 30,
    difficulty: "intense",
    restTime: "minimal"
  },
  {
    id: 8, 
    title: "Programme en cours",
    description: "Continuer votre programme actuel",
    icon_name: "Calendar",
    type: "program",
    duration: null,
    difficulty: null,
    programProgress: null // Pourcentage de progression dans le programme
  }
];
