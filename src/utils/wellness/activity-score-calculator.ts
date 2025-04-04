
/**
 * Calcule le score d'activité physique basé sur les séances d'entraînement
 * 
 * @param workoutData Données d'entraînement des 7 derniers jours
 * @returns Score d'activité entre 0 et 100
 */
export function calculateActivityScore(workoutData: any[]): number {
  if (workoutData.length === 0) return 50;
  
  // Logique de calcul du score d'activité
  let frequencyScore = 0;
  let durationScore = 0;
  let intensityScore = 0;
  
  // Évaluer la fréquence d'entraînement (idéal: 4-5 fois par semaine)
  const uniqueDays = new Set(
    workoutData.map(session => new Date(session.created_at).toDateString())
  );
  frequencyScore = Math.min(40, (uniqueDays.size / 5) * 40);
  
  // Évaluer la durée totale des entraînements
  const totalDuration = workoutData.reduce((sum, session) => sum + (session.total_duration_minutes || 0), 0);
  const avgDuration = workoutData.length > 0 ? totalDuration / workoutData.length : 0;
  durationScore = Math.min(30, (avgDuration / 60) * 30); // 60 minutes par séance idéal
  
  // Évaluer l'intensité
  const intensityCount = {
    easy: 0,
    moderate: 0,
    hard: 0
  };
  
  workoutData.forEach(session => {
    if (session.perceived_difficulty) {
      intensityCount[session.perceived_difficulty] += 1;
    } else {
      intensityCount.moderate += 1; // Par défaut
    }
  });
  
  // Bonus pour une variété d'intensité
  if (intensityCount.easy > 0 && intensityCount.moderate > 0 && intensityCount.hard > 0) {
    intensityScore = 30;
  } else if ((intensityCount.easy > 0 && intensityCount.moderate > 0) || 
            (intensityCount.moderate > 0 && intensityCount.hard > 0)) {
    intensityScore = 20;
  } else {
    intensityScore = 10;
  }
  
  const calculatedScore = frequencyScore + durationScore + intensityScore;
  return Math.min(100, Math.max(0, calculatedScore));
}
