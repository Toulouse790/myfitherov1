
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

export interface WorkoutData {
  exercises: string[];
  duration?: number;
  intensity?: number;
  type?: string;
}

export function useWorkoutOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const startWorkout = async (workoutData: WorkoutData) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour démarrer une séance",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    try {
      setIsLoading(true);
      debugLogger.log("useWorkoutOperations", "Démarrage d'une séance avec:", workoutData);

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          exercises: workoutData.exercises,
          workout_type: workoutData.type || 'strength',
          target_duration_minutes: workoutData.duration || 45,
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      debugLogger.log("useWorkoutOperations", "Séance créée avec succès:", data);
      navigate(`/workouts/session/${data.id}`);
      
      return data;
    } catch (error) {
      debugLogger.error("useWorkoutOperations", "Erreur lors de la création de la séance:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startWorkout,
    isLoading
  };
}
