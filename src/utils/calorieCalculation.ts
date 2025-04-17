
/**
 * Calcule les calories brûlées lors d'un exercice physique.
 * 
 * @param weightKg Poids de l'utilisateur en kg
 * @param durationMinutes Durée de l'exercice en minutes
 * @param intensity Intensité de l'exercice ('low', 'moderate', 'high')
 * @param gender Genre de l'utilisateur ('male' ou 'female')
 * @returns Nombre de calories brûlées
 */
export const calculateExerciseCalories = (
  weightKg: number,
  durationMinutes: number,
  intensity: 'low' | 'moderate' | 'high',
  gender: 'male' | 'female'
): number => {
  // Valeurs MET (Metabolic Equivalent of Task) en fonction de l'intensité
  // Pour l'entraînement de musculation et autres exercices de force
  const metValues = {
    low: 3.5,      // Exercice léger (musculation légère)
    moderate: 5.0, // Exercice modéré (musculation moyenne)
    high: 7.0      // Exercice intense (musculation intensive)
  };
  
  const met = metValues[intensity];
  
  // Facteur genre (les femmes ont généralement une masse musculaire plus faible)
  const genderFactor = gender === 'female' ? 0.9 : 1.0;
  
  // Facteur EPOC (Excess Post-exercise Oxygen Consumption)
  // Représente la consommation d'oxygène accrue après l'entraînement
  const epocFactor = {
    low: 1.08,     // +8% pour basse intensité
    moderate: 1.15, // +15% pour intensité modérée 
    high: 1.25     // +25% pour haute intensité
  }[intensity];
  
  // Si durée est 0, retourner 0 pour éviter les calculs inutiles
  if (durationMinutes <= 0) return 0;
  
  // Formule standard pour calculer les calories brûlées durant l'exercice
  // Calories = MET × Poids (kg) × Durée (heures) × 3.5 × Facteur genre × Facteur EPOC
  const calories = met * weightKg * (durationMinutes / 60) * 3.5 * genderFactor * epocFactor;
  
  return Math.floor(calories);
};

/**
 * Calcule les calories brûlées spécifiquement lors d'un exercice de musculation
 * en fonction du poids soulevé et des répétitions.
 * 
 * @param exerciseWeight Poids total soulevé (kg)
 * @param sets Nombre de séries
 * @param reps Nombre de répétitions par série
 * @param intensity Intensité de l'exercice ('low', 'moderate', 'high')
 * @returns Nombre de calories brûlées
 */
export const calculateStrengthTrainingCalories = (
  exerciseWeight: number,
  sets: number,
  reps: number,
  intensity: 'low' | 'moderate' | 'high' = 'moderate'
): number => {
  // Facteurs selon l'intensité
  const intensityFactors = {
    low: 0.025,
    moderate: 0.035,
    high: 0.045
  };
  
  // Calories calculées = poids soulevé * nombre de répétitions * facteur d'intensité
  // Avec un facteur multiplicatif pour le nombre de séries (diminution de l'efficacité avec la fatigue)
  const setsFactor = 1 + (Math.log(sets) / Math.log(2) * 0.2); // Facteur logarithmique pour les séries
  
  const calories = exerciseWeight * reps * intensityFactors[intensity] * setsFactor;
  
  return Math.floor(calories);
};

/**
 * Calcule la dépense calorique totale quotidienne
 * 
 * @param bmr Métabolisme de base (calories)
 * @param activityLevel Niveau d'activité quotidienne
 * @param exerciseCalories Calories brûlées par l'exercice
 * @returns Dépense calorique totale
 */
export const calculateTotalDailyCalories = (
  bmr: number,
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active',
  exerciseCalories: number = 0
): number => {
  // Multiplicateurs NEAT (Non-Exercise Activity Thermogenesis)
  const activityMultipliers = {
    sedentary: 1.2,         // Peu ou pas d'exercice
    lightly_active: 1.375,  // Exercice léger 1-3 jours/semaine
    moderately_active: 1.55, // Exercice modéré 3-5 jours/semaine
    very_active: 1.725,     // Exercice intensif 6-7 jours/semaine
    extra_active: 1.9       // Exercice très intensif + travail physique
  };
  
  const multiplier = activityMultipliers[activityLevel];
  
  // TDEE = BMR * Multiplicateur d'activité + Calories d'exercice
  return Math.floor((bmr * multiplier) + exerciseCalories);
};
