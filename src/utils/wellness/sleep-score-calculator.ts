
import { SleepSession } from "@/types/sleep";

/**
 * Calcule le score de sommeil en fonction des données de sommeil récentes
 * 
 * @param sleepData Données de sommeil des 7 derniers jours
 * @returns Score de sommeil entre 0 et 100
 */
export function calculateSleepScore(sleepData: SleepSession[]): number {
  if (sleepData.length === 0) return 50;
  
  // Logique de calcul du score de sommeil basée sur différents facteurs
  let durationScore = 0;
  let qualityScore = 0;
  let consistencyScore = 0;
  
  // Évaluer la durée moyenne de sommeil
  const totalDuration = sleepData.reduce((sum, session) => sum + (session.total_duration_minutes || 0), 0);
  const avgDuration = sleepData.length > 0 ? totalDuration / sleepData.length : 0;
  durationScore = Math.min(50, (avgDuration / 480) * 50); // 480 minutes = 8 heures (idéal)
  
  // Évaluer la qualité du sommeil (si disponible)
  const totalQuality = sleepData.reduce((sum, session) => {
    if (session.quality_metrics && session.quality_metrics.sleep_quality) {
      return sum + session.quality_metrics.sleep_quality;
    }
    return sum;
  }, 0);
  
  const avgQuality = sleepData.length > 0 ? totalQuality / sleepData.length : 5;
  qualityScore = (avgQuality / 10) * 25; // Qualité sur 10
  
  // Évaluer la régularité du sommeil
  // Créons une nouvelle instance pour éviter la référence à sevenDaysAgo
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const hasDailySleep = sleepData.length >= Math.min(7, (new Date().getTime() - sevenDaysAgo.getTime()) / (24 * 3600 * 1000));
  consistencyScore = hasDailySleep ? 25 : (sleepData.length / 7) * 25;
  
  const calculatedScore = durationScore + qualityScore + consistencyScore;
  return Math.min(100, Math.max(0, calculatedScore));
}
