
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const usePerformancePredictions = (sportId?: string) => {
  const { user } = useAuth();

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['performance-predictions', sportId],
    queryFn: async () => {
      if (!user || !sportId) return null;

      const { data, error } = await supabase
        .from('performance_predictions')
        .select('*')
        .eq('user_id', user.id)
        .eq('sport_id', sportId)
        .order('predicted_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user && !!sportId
  });

  return {
    predictions,
    isLoading,
  };
};
