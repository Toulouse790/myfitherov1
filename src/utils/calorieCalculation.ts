
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
  const metValues = {
    low: 3.0,      // Exercice léger
    moderate: 5.0, // Exercice modéré
    high: 6.0      // Exercice intense
  };
  
  const met = metValues[intensity];
  
  // Facteur genre (les femmes ont généralement une masse musculaire plus faible)
  const genderFactor = gender === 'female' ? 0.9 : 1.0;
  
  // Facteur EPOC (Excess Post-exercise Oxygen Consumption)
  // Représente la consommation d'oxygène accrue après l'entraînement
  const epocFactor = {
    low: 1.06,     // +6% pour basse intensité
    moderate: 1.10, // +10% pour intensité modérée 
    high: 1.15     // +15% pour haute intensité
  }[intensity];
  
  // Si durée est 0, retourner 0 pour éviter les calculs inutiles
  if (durationMinutes <= 0) return 0;
  
  // Formule standard pour calculer les calories brûlées durant l'exercice
  // Calories = MET × Poids (kg) × Durée (heures) × 3.5 × Facteur genre × Facteur EPOC
  const calories = met * weightKg * (durationMinutes / 60) * 3.5 * genderFactor * epocFactor;
  
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
