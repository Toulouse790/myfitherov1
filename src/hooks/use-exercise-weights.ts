
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth";

export const useExerciseWeights = (exerciseName: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exerciseWeight, isLoading } = useQuery({
    queryKey: ['exercise-weights', exerciseName, user?.id],
    queryFn: async () => {
      if (!user || !exerciseName) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_exercise_weights')
        .select('*')
        .eq('exercise_name', exerciseName)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching exercise weight:', error);
        throw error;
      }

      return data || { weight: 20, reps: 12 };
    },
    enabled: !!user && !!exerciseName,
  });

  const { mutate: updateWeight } = useMutation({
    mutationFn: async (weight: number) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_exercise_weights')
        .upsert({
          user_id: user.id,
          exercise_name: exerciseName,
          weight: weight,
          last_used_weight: weight,
          last_used_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating weight:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-weights', exerciseName, user?.id] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le poids.",
        variant: "destructive",
      });
    },
  });

  return {
    exerciseWeight,
    isLoading,
    updateWeight,
  };
};
