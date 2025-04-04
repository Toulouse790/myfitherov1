
import { SleepSession } from "@/types/sleep";
import { FoodItem } from "@/types/nutrition";

interface WorkoutSession {
  id?: string;
  user_id?: string;
  created_at?: string;
  total_duration_minutes?: number;
  exercises?: string[];
  perceived_difficulty?: 'easy' | 'moderate' | 'hard';
}

interface Correlation {
  type: string;
  description: string;
  strength: number; // 0-1
  data: any;
}

/**
 * Trouve des corrélations potentielles entre les différentes données de bien-être
 * 
 * @param sleepData Données de sommeil
 * @param nutritionData Données nutritionnelles
 * @param workoutData Données d'entraînement
 * @returns Tableau de corrélations trouvées
 */
export function findCorrelations(
  sleepData: SleepSession[], 
  nutritionData: FoodItem[], 
  workoutData: WorkoutSession[]
): Correlation[] {
  const correlations: Correlation[] = [];
  
  // Simplification: nous retournons quelques corrélations simples basées sur des heuristiques
  
  // Vérifier si l'utilisateur s'entraîne après une bonne nuit de sommeil
  const goodSleepDays = new Set(
    sleepData
      .filter(session => (session.sleep_score || 0) > 70)
      .map(session => new Date(session.created_at || '').toDateString())
  );
  
  const workoutAfterGoodSleepDays = workoutData
    .filter(session => {
      const sessionDate = new Date(session.created_at || '').toDateString();
      return goodSleepDays.has(sessionDate);
    }).length;
  
  if (workoutAfterGoodSleepDays > 0 && goodSleepDays.size > 0) {
    const correlation = workoutAfterGoodSleepDays / goodSleepDays.size;
    if (correlation > 0.5) {
      correlations.push({
        type: 'sleep-workout',
        description: 'Tendance à s\'entraîner après une bonne nuit de sommeil',
        strength: correlation,
        data: { workoutAfterGoodSleepDays, goodSleepDays: goodSleepDays.size }
      });
    }
  }
  
  // Autres corrélations simplifiées...
  
  return correlations;
}
