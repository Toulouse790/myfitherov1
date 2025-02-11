
interface HistoricalData {
  recentWorkouts?: number;
  nutritionHabits?: string;
  sleepQuality?: string;
  progression?: string;
}

export const calculateConfidenceScore = (historicalData: HistoricalData | null): number => {
  if (!historicalData) return 70; // Score de base sans données historiques

  let score = 70; // Score de base

  // Ajustement basé sur les entraînements récents
  if (historicalData.recentWorkouts) {
    score += Math.min(historicalData.recentWorkouts * 2, 10);
  }

  // Ajustement basé sur le suivi nutritionnel
  if (historicalData.nutritionHabits === 'Suivi régulier') {
    score += 10;
  }

  // Ajustement basé sur le suivi du sommeil
  if (historicalData.sleepQuality === 'Suivi régulier') {
    score += 10;
  }

  // Limitation du score maximum à 100
  return Math.min(score, 100);
};
