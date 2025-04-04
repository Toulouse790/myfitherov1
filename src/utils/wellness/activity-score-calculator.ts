
/**
 * Interface représentant une session d'entraînement
 */
interface WorkoutSession {
  id?: string;
  user_id?: string;
  created_at?: string;
  total_duration_minutes?: number;
  exercises?: string[];
  perceived_difficulty?: 'easy' | 'moderate' | 'hard';
}

/**
 * Calcule le score d'activité physique en fonction des données d'entraînement récentes
 * 
 * @param workoutData Données d'entraînement des 7 derniers jours
 * @returns Score d'activité entre 0 et 100
 */
export function calculateActivityScore(workoutData: WorkoutSession[]): number {
  if (workoutData.length === 0) return 50;
  
  // Logique de calcul du score d'activité
  let frequencyScore = 0;
  let intensityScore = 0;
  let diversityScore = 0;
  
  // Évaluer la fréquence d'entraînement
  const daysWithWorkouts = new Set(workoutData.map(workout => new Date(workout.created_at || '').toDateString())).size;
  frequencyScore = Math.min(40, (daysWithWorkouts / 5) * 40); // Idéal: 5 entraînements par semaine
  
  // Évaluer l'intensité moyenne des entraînements
  const totalDuration = workoutData.reduce((sum, workout) => sum + (workout.total_duration_minutes || 0), 0);
  const avgDuration = workoutData.length > 0 ? totalDuration / workoutData.length : 0;
  intensityScore = Math.min(30, (avgDuration / 60) * 30); // Idéal: 60 minutes par entraînement
  
  // Évaluer la diversité des entraînements (différents types de muscles)
  const muscleGroups = new Set();
  workoutData.forEach(workout => {
    if (Array.isArray(workout.exercises)) {
      workout.exercises.forEach((exercise: any) => {
        // Considérer que l'exercise est une string comme "Squats"
        // Dans un cas réel, on aurait besoin d'extraire le groupe musculaire
        muscleGroups.add(exercise);
      });
    }
  });
  
  diversityScore = Math.min(30, muscleGroups.size * 6); // 5 points par groupe musculaire, max 30
  
  const calculatedScore = frequencyScore + intensityScore + diversityScore;
  return Math.min(100, Math.max(0, calculatedScore));
}
