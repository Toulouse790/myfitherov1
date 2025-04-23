
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export interface WorkoutData {
  exercises: string[];
  duration?: number;
  intensity?: number;
  type?: string;
}

/**
 * Hook pour la gestion des opérations liées aux séances d'entraînement
 */
export function useWorkoutOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Démarre une nouvelle séance d'entraînement
   */
  const startWorkout = async (workoutData: WorkoutData) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour démarrer une séance",
        variant: "destructive",
      });
      navigate('/signin');
      return null;
    }

    try {
      setIsLoading(true);
      console.log("Démarrage d'une séance avec:", JSON.stringify(workoutData));

      // Vérifier les exercices
      if (!workoutData.exercises || workoutData.exercises.length === 0) {
        throw new Error("Aucun exercice sélectionné pour la séance");
      }
      
      // Structure pour la session
      const sessionData = {
        user_id: user.id,
        exercises: workoutData.exercises,
        workout_type: 'strength',
        status: 'in_progress',
        started_at: new Date().toISOString(),
        target_duration_minutes: workoutData.duration || 45,
        intensity_level: workoutData.intensity || 50
      };

      console.log("Envoi des données à Supabase:", JSON.stringify(sessionData));

      // Requête Supabase
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(sessionData)
        .select('id')
        .single();

      if (error) {
        console.error("ERREUR SUPABASE:", error);
        throw new Error(`Impossible de créer la séance: ${error.message}`);
      }

      if (!data || !data.id) {
        throw new Error("Aucun ID de séance retourné");
      }

      console.log("Séance créée avec succès:", data);
      
      toast({
        title: "Séance créée",
        description: "Votre séance d'entraînement a été créée avec succès",
      });
      
      // Navigation vers la nouvelle session
      navigate(`/workouts/session/${data.id}`);
      
      return data;
    } catch (error: any) {
      console.error("Erreur lors de la création de la séance:", error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de démarrer la séance d'entraînement.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startWorkout,
    isLoading
  };
}
