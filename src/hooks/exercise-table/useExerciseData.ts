import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useExerciseData = (publishFilter: boolean | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercises', publishFilter],
    queryFn: async () => {
      try {
        let query = supabase.from('unified_exercises').select('*');
        
        if (publishFilter !== null) {
          query = query.eq('is_published', publishFilter);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching exercises:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les exercices. Veuillez réessayer.",
            variant: "destructive",
          });
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Network error fetching exercises:', error);
        toast({
          title: "Erreur réseau",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    const channel = supabase.channel('unified_exercises_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'unified_exercises'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['exercises'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    exercises,
    isLoading,
  };
};