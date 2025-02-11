
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export const useTrainingPeriodization = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentCycle, isLoading } = useQuery({
    queryKey: ['training-periodization', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('training_periodization')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching training cycle:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user
  });

  const createCycle = useMutation({
    mutationFn: async (cycleData: {
      cycle_type: 'macrocycle' | 'mesocycle' | 'microcycle';
      phase: 'preparation' | 'competition' | 'transition' | 'peak';
      start_date: Date;
      end_date: Date;
      objectives: Record<string, any>;
      sport_id: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('training_periodization')
        .insert([{
          user_id: user.id,
          ...cycleData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['training-periodization']);
      toast({
        title: "Cycle créé",
        description: "Le nouveau cycle d'entraînement a été créé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error creating cycle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le cycle d'entraînement",
        variant: "destructive",
      });
    }
  });

  return {
    currentCycle,
    isLoading,
    createCycle
  };
};
