
import { SleepSession } from "@/types/sleep";
import { FoodItem } from "@/types/nutrition";

/**
 * Interface représentant une session d'entraînement
 */
interface WorkoutSession {
  id?: string;
  user_id?: string;
  created_at?: string;
  total_duration_minutes?: number;
  exercises?: string[];
}

/**
 * Interface représentant une corrélation trouvée
 */
export interface WellnessCorrelation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: 'positive' | 'negative' | 'neutral';
}

/**
 * Trouve des corrélations entre les données de sommeil, nutrition et entraînement
 * 
 * @param sleepData Données de sommeil des 7 derniers jours
 * @param nutritionData Données nutritionnelles des 7 derniers jours
 * @param workoutData Données d'entraînement des 7 derniers jours
 * @returns Liste des corrélations trouvées
 */
export function findCorrelations(
  sleepData: SleepSession[], 
  nutritionData: FoodItem[], 
  workoutData: WorkoutSession[]
): WellnessCorrelation[] {
  const correlations: WellnessCorrelation[] = [];
  
  // Exemple de corrélation: Qualité du sommeil vs apport en protéines
  if (sleepData.length > 0 && nutritionData.length > 0) {
    // Analyse de corrélation
    // ...
    
    correlations.push({
      id: 'sleep-protein',
      title: 'Sommeil et protéines',
      description: 'Un apport plus élevé en protéines semble être associé à une meilleure qualité de sommeil.',
      confidence: 75,
      type: 'positive'
    });
  }
  
  // Exemple de corrélation: Entraînement et sommeil
  if (workoutData.length > 0 && sleepData.length > 0) {
    // Analyse de corrélation
    // ...
    
    correlations.push({
      id: 'workout-sleep',
      title: 'Entraînement et sommeil',
      description: 'Les jours avec des entraînements intenses sont suivis de nuits de sommeil plus profondes.',
      confidence: 82,
      type: 'positive'
    });
  }
  
  return correlations;
}
