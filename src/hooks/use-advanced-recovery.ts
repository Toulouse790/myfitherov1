
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export const useAdvancedRecovery = (sessionId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recoveryMetrics, isLoading } = useQuery({
    queryKey: ['recovery-metrics', sessionId],
    queryFn: async () => {
      if (!user || !sessionId) return null;

      const { data, error } = await supabase
        .from('advanced_recovery_metrics')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching recovery metrics:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user && !!sessionId
  });

  const updateMetrics = useMutation({
    mutationFn: async (metrics: {
      biomechanical_load: Record<string, any>;
      fatigue_indicators: Record<string, any>;
      recovery_recommendations: Record<string, any>;
    }) => {
      if (!user || !sessionId) throw new Error("Missing required data");

      const { data, error } = await supabase
        .from('advanced_recovery_metrics')
        .upsert({
          user_id: user.id,
          session_id: sessionId,
          ...metrics
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-metrics'] });
      toast({
        title: "Métriques mises à jour",
        description: "Les données de récupération ont été enregistrées",
      });
    },
    onError: (error) => {
      console.error('Error updating recovery metrics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les métriques",
        variant: "destructive",
      });
    }
  });

  return {
    recoveryMetrics,
    isLoading,
    updateMetrics
  };
};
