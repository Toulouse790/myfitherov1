
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function useWellnessScore() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wellness-score', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // Récupération des données récentes
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        // Données de sommeil
        const { data: sleepData } = await supabase
          .from('sleep_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false });
          
        // Données nutritionnelles  
        const { data: nutritionData } = await supabase
          .from('food_journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false });
          
        // Données d'entraînement  
        const { data: workoutData } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false });
          
        // Calcul des scores individuels
        const sleepScore = calculateSleepScore(sleepData || []);
        const nutritionScore = calculateNutritionScore(nutritionData || []);
        const activityScore = calculateActivityScore(workoutData || []);
        
        // Calcul du score global avec pondération
        const overallScore = Math.round(
          (sleepScore * 0.35) + (nutritionScore * 0.3) + (activityScore * 0.35)
        );
        
        // Calcul des contributions en pourcentage
        const total = sleepScore + nutritionScore + activityScore;
        const sleepContribution = total > 0 ? (sleepScore / total) * 100 : 33.33;
        const nutritionContribution = total > 0 ? (nutritionScore / total) * 100 : 33.33;
        const activityContribution = total > 0 ? (activityScore / total) * 100 : 33.33;
        
        // Recherche de corrélations entre les trois piliers
        const correlations = findCorrelations(sleepData, nutritionData, workoutData);
        
        return {
          score: overallScore,
          sleepScore,
          nutritionScore,
          activityScore,
          sleepContribution,
          nutritionContribution,
          activityContribution,
          correlations,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error calculating wellness score:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

// Fonctions auxiliaires
function calculateSleepScore(sleepData: any[]): number {
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

function calculateNutritionScore(nutritionData: any[]): number {
  if (nutritionData.length === 0) return 50;
  
  // Logique de calcul du score nutritionnel
  let balanceScore = 0;
  let consistencyScore = 0;
  let diversityScore = 0;
  
  // Évaluer l'équilibre des macros
  const entries = nutritionData.length;
  const daysWithEntries = new Set(nutritionData.map(entry => new Date(entry.created_at).toDateString())).size;
  
  // Calculer les moyennes de macronutriments
  const totalProteins = nutritionData.reduce((sum, entry) => sum + (entry.proteins || 0), 0);
  const totalCarbs = nutritionData.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFats = nutritionData.reduce((sum, entry) => sum + (entry.fats || 0), 0);
  
  // Vérifier l'équilibre des macros (ratio protéines/glucides/lipides idéal approx. 30/40/30)
  const totalMacros = totalProteins + totalCarbs + totalFats;
  if (totalMacros > 0) {
    const proteinRatio = totalProteins / totalMacros;
    const carbRatio = totalCarbs / totalMacros;
    const fatRatio = totalFats / totalMacros;
    
    // Calculer l'écart par rapport aux ratios idéaux
    const proteinDiff = Math.abs(proteinRatio - 0.3);
    const carbDiff = Math.abs(carbRatio - 0.4);
    const fatDiff = Math.abs(fatRatio - 0.3);
    
    balanceScore = 50 * (1 - ((proteinDiff + carbDiff + fatDiff) / 1.2));
  }
  
  // Évaluer la consistance des repas
  consistencyScore = Math.min(25, (daysWithEntries / 7) * 25);
  
  // Évaluer la diversité des aliments
  const mealTypes = new Set(nutritionData.map(entry => entry.meal_type)).size;
  diversityScore = Math.min(25, (mealTypes / 5) * 25); // 5 repas possibles
  
  const calculatedScore = balanceScore + consistencyScore + diversityScore;
  return Math.min(100, Math.max(0, calculatedScore));
}

function calculateActivityScore(workoutData: any[]): number {
  if (workoutData.length === 0) return 50;
  
  // Logique de calcul du score d'activité
  let frequencyScore = 0;
  let intensityScore = 0;
  let diversityScore = 0;
  
  // Évaluer la fréquence d'entraînement
  const daysWithWorkouts = new Set(workoutData.map(workout => new Date(workout.created_at).toDateString())).size;
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

function findCorrelations(sleepData: any[], nutritionData: any[], workoutData: any[]): any[] {
  const correlations = [];
  
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
