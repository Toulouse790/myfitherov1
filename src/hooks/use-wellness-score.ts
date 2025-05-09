
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  calculateSleepScore, 
  calculateNutritionScore, 
  calculateActivityScore, 
  findCorrelations 
} from "@/utils/wellness";
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

interface WellnessScoreResult {
  score: number;
  sleepScore: number;
  nutritionScore: number;
  activityScore: number;
  sleepContribution: number;
  nutritionContribution: number;
  activityContribution: number;
  correlations: any[];
  lastUpdated: string;
}

export function useWellnessScore() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wellness-score', user?.id],
    queryFn: async (): Promise<WellnessScoreResult | null> => {
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
        const correlations = findCorrelations(
          (sleepData || []) as SleepSession[], 
          (nutritionData || []) as FoodItem[], 
          (workoutData || []) as WorkoutSession[]
        );
        
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
