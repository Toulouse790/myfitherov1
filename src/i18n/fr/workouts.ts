
export const workouts = {
  // Actions principales
  startWorkout: "Commencer l'entraînement",
  completeWorkout: "Terminer la séance",
  nextExercise: "Exercice suivant",
  finishWorkout: "Terminer l'entraînement",
  stopWorkout: "Arrêter l'entraînement",
  regenerate: "Régénérer",
  validateSet: "Valider la série",
  
  // Messages de confirmation
  setCompleted: "Séance terminée !",
  allSetsCompleted: "Félicitations ! Votre séance a été enregistrée.",
  confirmation: "Êtes-vous sûr de vouloir terminer cet entraînement ?",
  sessionCompleted: "Séance terminée",
  allExercisesCompleted: "Tous les exercices ont été complétés",
  exerciseCompleted: "Exercice terminé",
  
  // Messages de repos
  readyForNextSet: "Prêt pour la prochaine série",
  restFinished: "Repos terminé",
  restBeforeNextExercise: "Reposez-vous avant le prochain exercice",
  restBeforeNextSet: "Reposez-vous avant la prochaine série",
  rest: "Repos",
  
  // Informations d'exercice
  duration: "Durée",
  durationMinutes: "{duration} min",
  exercises: "exercices",
  progress: "Progression",
  currentExercise: "Exercice en cours",
  exerciseList: "Liste des exercices",
  pending: "À faire",
  completed: "Terminé",
  minutes: "minutes",
  totalDuration: "Durée totale",
  workoutSession: "Séance d'entraînement",
  allMuscleGroups: "Tous les groupes musculaires",
  library: "Bibliothèque",
  history: "Historique",
  
  // États d'action
  start: "Commencer",
  continueSession: "Continuer la séance",
  startSession: "Commencer",
  startSessionLoading: "Chargement...",
  
  // Génération d'entraînement
  generateWorkoutTitle: "Générer un entraînement",
  generateWorkoutDescription: "Nous allons générer un entraînement personnalisé selon vos préférences",
  generateSession: "Générer une séance",
  generationLoading: "Génération en cours...",
  generator: "Générateur d'entraînement intelligent",
  generatorDescription: "Créez un entraînement personnalisé et scientifiquement optimisé",
  generating: "Génération en cours...",
  intensity: "Intensité",
  
  // Messages d'erreur
  errors: {
    sessionCreate: "Erreur lors de la création de la séance",
    sessionCreateDescription: "Impossible de créer une séance d'entraînement",
    sessionFinalize: "Erreur lors de la finalisation de la séance",
    sessionFinalizeDescription: "Impossible de finaliser la séance d'entraînement",
    saveWeightFailed: "Impossible d'enregistrer les poids",
    sessionUpdate: "Erreur lors de la mise à jour de la séance",
    sessionUpdateDescription: "Impossible de mettre à jour la séance",
    activeSessionCheck: "Erreur lors de la vérification des sessions actives"
  },
  
  // États et messages divers
  noExercisesFound: "Aucun exercice trouvé",
  selectExercisesForSession: "Veuillez sélectionner des exercices pour cette séance",
  unableToLoadSessionDetails: "Impossible de charger les détails de la séance",
  preparingNextExercise: "Préparation du prochain exercice",
  validateSetLabel: "Valider la série",
  restingLabel: "Repos en cours",
  newPersonalRecord: "Nouveau record personnel: {weight}kg",
  setValidated: "Série validée: {weight}kg",
  
  // Titres et descriptions
  title: "Entraînements",
  trackProgressDescription: "Suivez votre progression et atteignez vos objectifs",
  favorite: "Favori",
  createNewSession: "Créez une nouvelle séance d'entraînement",
  newWorkout: "Nouvel entraînement",
  sportSpecific: "Spécifique au sport",
  sportSpecificDescription: "Programmes adaptés à votre sport",
  latestPerformances: "Dernières performances",
  viewProgress: "Voir la progression",
  sportPrograms: "Programmes sportifs",
  teamSports: "Sports d'équipe",
  
  // Autres
  kcal: "kcal",
  trainingOf: "Entraînement du",
  startWorkoutError: "Impossible de démarrer l'entraînement",
  emptyWorkoutError: "Entraînement vide",
  noExercisesInTemplate: "Aucun exercice dans ce modèle",
  backToWorkouts: "Retour aux entraînements",
  sessionEmpty: "Cette séance ne contient aucun exercice",
  startSessionErrorDescription: "Impossible de démarrer la séance d'entraînement",
  todayDate: "Aujourd'hui",
  exerciseLibrary: "Bibliothèque d'exercices",
  
  // Bibliothèque d'entraînements
  libraryDescription: "Parcourez nos programmes d'entraînement",
  searchPlaceholder: "Rechercher un entraînement",
  filters: "Filtres",
  toggleFilters: "Afficher/Masquer les filtres",
  createWorkout: "Créer un entraînement",
  muscleGroups: "Groupes musculaires",
  noWorkoutsForMuscleGroup: "Aucun entraînement trouvé pour ce groupe musculaire",
  noWorkoutsFound: "Aucun entraînement trouvé",
  createFirstWorkout: "Créer votre premier entraînement",
  
  // Niveaux de difficulté
  difficulty: {
    easy: "Facile",
    beginner: "Débutant",
    moderate: "Modéré",
    intermediate: "Intermédiaire",
    challenging: "Difficile",
    advanced: "Avancé",
    intense: "Intense",
    adaptive: "Adaptatif"
  },
  
  // Erreurs de génération
  generationError: "Erreur lors de la génération",
  generationErrorDescription: "Impossible de générer les recommandations d'entraînement",
  
  // Recommandations personnalisées
  personalizedRecommendations: "Recommandations personnalisées",
  basedOnYourProfile: "Basé sur votre profil et votre historique",
  matchesYourLevel: "Correspond à votre niveau",
  perfectForYourGoals: "Parfait pour vos objectifs",
  restDayRecommended: "Jour de repos recommandé",
  trainedRecently: "Groupe musculaire récemment entraîné",
  tryNewWorkout: "Essayez un nouvel entraînement",
  recommendedForRecovery: "Recommandé pour votre récupération",
  
  // Nouvelles traductions pour l'interface utilisateur
  personalisedSession: "Votre séance personnalisée",
  sets: "séries",
  reps: "répétitions",
  weight: "Poids",
  weightUnit: "(kg)",
  numberOfSets: "Nombre de séries",
  completeExercise: "Terminer l'exercice",
  completedSets: "Séries complétées",
  set: "Série",
  caloriesBurned: "calories brûlées",
  skipRest: "Passer le repos",
  restTime: "Temps de repos",
  calories: "kcal"
};
