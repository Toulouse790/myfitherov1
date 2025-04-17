
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export const useExerciseWeights = (exerciseName: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: exerciseWeight, isLoading } = useQuery({
    queryKey: ['exercise-weights', exerciseName, user?.id],
    queryFn: async () => {
      if (!user || !exerciseName) {
        debugLogger.log("useExerciseWeights", "Pas d'utilisateur ou d'exercice");
        return null;
      }

      debugLogger.log("useExerciseWeights", "Récupération du poids pour:", exerciseName);
      const { data, error } = await supabase
        .from('user_exercise_weights')
        .select('*')
        .eq('exercise_name', exerciseName)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        debugLogger.error('useExerciseWeights', 'Erreur récupération du poids:', error);
        throw error;
      }

      debugLogger.log("useExerciseWeights", "Données récupérées:", data);
      return data || { weight: 20, reps: 12 };
    },
    enabled: !!user && !!exerciseName,
  });

  const { mutate: updateWeight } = useMutation({
    mutationFn: async (weight: number) => {
      if (!user) throw new Error(t('workouts.errors.userNotAuthenticated') || 'Utilisateur non authentifié');

      debugLogger.log("useExerciseWeights", "Mise à jour du poids pour:", exerciseName, "Nouveau poids:", weight);
      
      // Vérification que le poids est valide
      if (typeof weight !== 'number' || isNaN(weight) || weight < 0) {
        const errorMessage = t('workouts.errors.invalidWeightValue') || 'Valeur de poids invalide';
        debugLogger.error('useExerciseWeights', errorMessage);
        throw new Error(errorMessage);
      }
      
      try {
        // Vérification si l'entrée existe déjà
        const { data: existingData, error: checkError } = await supabase
          .from('user_exercise_weights')
          .select('id')
          .eq('user_id', user.id)
          .eq('exercise_name', exerciseName)
          .maybeSingle();
          
        if (checkError && checkError.code !== 'PGRST116') {
          debugLogger.error('useExerciseWeights', 'Erreur lors de la vérification des données existantes:', checkError);
          throw checkError;
        }
        
        let operation;
        
        if (existingData) {
          // Mise à jour d'une entrée existante
          operation = supabase
            .from('user_exercise_weights')
            .update({
              weight: weight,
              last_used_weight: weight,
              last_used_at: new Date().toISOString()
            })
            .eq('id', existingData.id);
        } else {
          // Création d'une nouvelle entrée
          operation = supabase
            .from('user_exercise_weights')
            .insert({
              user_id: user.id,
              exercise_name: exerciseName,
              weight: weight,
              last_used_weight: weight,
              last_used_at: new Date().toISOString()
            });
        }
        
        const { data, error } = await operation;
        
        if (error) {
          debugLogger.error('useExerciseWeights', 'Erreur mise à jour du poids:', error);
          throw error;
        }

        return data;
      } catch (error) {
        debugLogger.error('useExerciseWeights', 'Exception lors de la mise à jour du poids:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-weights', exerciseName, user?.id] });
      debugLogger.log("useExerciseWeights", "Poids mis à jour avec succès");
      toast({
        title: t("common.success"),
        description: t("workouts.weightUpdatedSuccessfully") || "Poids mis à jour avec succès",
      });
    },
    onError: (error) => {
      debugLogger.error('useExerciseWeights', 'Erreur mutation:', error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.weightUpdateFailed") || "Impossible de mettre à jour le poids.",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateReps } = useMutation({
    mutationFn: async (reps: number) => {
      if (!user) throw new Error(t('workouts.errors.userNotAuthenticated') || 'Utilisateur non authentifié');

      debugLogger.log("useExerciseWeights", "Mise à jour des répétitions pour:", exerciseName, "Nouvelles répétitions:", reps);
      
      // Vérification que les répétitions sont valides
      if (typeof reps !== 'number' || isNaN(reps) || reps <= 0) {
        const errorMessage = t('workouts.errors.invalidRepsValue') || 'Valeur de répétitions invalide';
        debugLogger.error('useExerciseWeights', errorMessage);
        throw new Error(errorMessage);
      }
      
      try {
        // Vérification si l'entrée existe déjà
        const { data: existingData, error: checkError } = await supabase
          .from('user_exercise_weights')
          .select('id')
          .eq('user_id', user.id)
          .eq('exercise_name', exerciseName)
          .maybeSingle();
          
        if (checkError && checkError.code !== 'PGRST116') {
          debugLogger.error('useExerciseWeights', 'Erreur lors de la vérification des données existantes:', checkError);
          throw checkError;
        }
        
        let operation;
        
        if (existingData) {
          // Mise à jour d'une entrée existante
          operation = supabase
            .from('user_exercise_weights')
            .update({
              weight: exerciseWeight?.weight || 20,
              last_used_at: new Date().toISOString()
            })
            .eq('id', existingData.id);
        } else {
          // Création d'une nouvelle entrée
          operation = supabase
            .from('user_exercise_weights')
            .insert({
              user_id: user.id,
              exercise_name: exerciseName,
              weight: exerciseWeight?.weight || 20,
              last_used_at: new Date().toISOString()
            });
        }
        
        const { data, error } = await operation;
        
        if (error) {
          debugLogger.error('useExerciseWeights', 'Erreur mise à jour des répétitions:', error);
          throw error;
        }

        return data;
      } catch (error) {
        debugLogger.error('useExerciseWeights', 'Exception lors de la mise à jour des répétitions:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-weights', exerciseName, user?.id] });
      debugLogger.log("useExerciseWeights", "Répétitions mises à jour avec succès");
      toast({
        title: t("common.success"),
        description: t("workouts.repsUpdatedSuccessfully") || "Répétitions mises à jour avec succès",
      });
    },
    onError: (error) => {
      debugLogger.error('useExerciseWeights', 'Erreur mutation:', error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.repsUpdateFailed") || "Impossible de mettre à jour les répétitions.",
        variant: "destructive",
      });
    },
  });

  return {
    exerciseWeight,
    isLoading,
    updateWeight,
    updateReps
  };
};
