
import { useQuery } from "@tanstack/react-query";
import { ClaudeService, ClaudeResponse } from "@/services/claude-service";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useClaudeRecommendations = (questionnaireData: any) => {
  const { toast } = useToast();

  const getHistoricalData = async (userId: string) => {
    try {
      // Récupération des dernières recommandations
      const { data: previousRecommendations } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Récupération des métriques utilisateur
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: nutrition } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', userId)
        .limit(7);

      const { data: sleep } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', userId)
        .limit(7);

      return {
        previousRecommendations,
        workouts,
        nutrition,
        sleep
      };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  };

  return useQuery({
    queryKey: ['claude-recommendations', questionnaireData],
    queryFn: async (): Promise<ClaudeResponse> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Utilisateur non authentifié");

        const historicalData = await getHistoricalData(user.id);
        const recommendation = await ClaudeService.getPersonalizedRecommendations(
          questionnaireData,
          historicalData
        );
        
        // Affichage du score de confiance
        if (recommendation.metadata?.confidence_score) {
          toast({
            title: "Score de confiance",
            description: `Confiance de la recommandation : ${recommendation.metadata.confidence_score}%`,
          });
        }

        // Sauvegarde de la recommandation
        const { error: saveError } = await supabase
          .from('ai_recommendations')
          .insert({
            user_id: user.id,
            context: 'fitness',
            recommendation_text: recommendation.response,
            confidence_score: recommendation.metadata?.confidence_score,
            input_data: questionnaireData,
            recommendation_type: 'initial_assessment',
            metadata: {
              historical_data: historicalData,
              model_version: 'claude-3-opus-20240229'
            }
          });

        if (saveError) {
          console.error('Error saving recommendation:', saveError);
        }

        return recommendation;
      } catch (error) {
        console.error('Error in recommendations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de générer les recommandations. Veuillez réessayer.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!questionnaireData,
    staleTime: 24 * 60 * 60 * 1000, // Cache pendant 24h
  });
};
