
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
      debugLogger.log("WorkoutOperations", "Démarrage d'une séance avec:", workoutData);

      // Créer un objet avec uniquement les champs qui existent dans la table
      const sessionData = {
        user_id: user.id,
        exercises: workoutData.exercises,
        workout_type: workoutData.type || 'strength',
        status: 'in_progress',
        started_at: new Date().toISOString(),
        // Ajouter une durée cible par défaut, mais ne pas inclure total_weight_lifted
        target_duration_minutes: workoutData.duration || 45
      };

      // Requête Supabase
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(sessionData)
        .select('id')
        .single();

      if (error) {
        debugLogger.error("WorkoutOperations", "Erreur Supabase:", error);
        throw error;
      }

      debugLogger.log("WorkoutOperations", "Séance créée avec succès:", data);
      
      toast({
        title: "Séance créée",
        description: "Votre séance d'entraînement a été créée avec succès",
      });
      
      // Naviguer vers la session
      navigate(`/workouts/session/${data.id}`);
      
      return data;
    } catch (error) {
      debugLogger.error("WorkoutOperations", "Erreur lors de la création de la séance:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance d'entraînement. Veuillez réessayer.",
        variant: "destructive",
      });
      
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
