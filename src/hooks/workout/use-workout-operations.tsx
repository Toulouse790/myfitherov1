
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
      console.log("WorkoutData reçue:", workoutData); // Log plus détaillé

      // Vérifier que les exercices sont bien définis
      if (!workoutData.exercises || workoutData.exercises.length === 0) {
        const errMsg = "Aucun exercice sélectionné pour la séance";
        debugLogger.error("WorkoutOperations", errMsg);
        toast({
          title: "Erreur",
          description: errMsg,
          variant: "destructive",
        });
        throw new Error(errMsg);
      }

      // Structure minimale de données pour éviter les erreurs
      const sessionData = {
        user_id: user.id,
        exercises: workoutData.exercises,
        workout_type: workoutData.type || 'strength',
        status: 'in_progress',
        started_at: new Date().toISOString()
      };

      if (workoutData.duration) {
        sessionData['target_duration_minutes'] = workoutData.duration;
      }

      debugLogger.log("WorkoutOperations", "Envoi des données à Supabase:", sessionData);
      console.log("Données envoyées à Supabase:", sessionData);

      // Requête Supabase avec gestion d'erreur explicite
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(sessionData)
        .select('id')
        .single();

      if (error) {
        debugLogger.error("WorkoutOperations", "Erreur Supabase:", error);
        console.error("Erreur Supabase complète:", error);
        
        toast({
          title: "Erreur",
          description: `Impossible de créer la séance: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      if (!data || !data.id) {
        const errMsg = "Aucun ID de séance retourné";
        debugLogger.error("WorkoutOperations", errMsg);
        toast({
          title: "Erreur",
          description: "Problème lors de la création de la séance",
          variant: "destructive",
        });
        throw new Error(errMsg);
      }

      debugLogger.log("WorkoutOperations", "Séance créée avec succès:", data);
      console.log("Séance créée avec ID:", data.id);
      
      toast({
        title: "Séance créée",
        description: "Votre séance d'entraînement a été créée avec succès",
      });
      
      // Navigation vers la nouvelle session avec l'ID
      const sessionUrl = `/workouts/session/${data.id}`;
      debugLogger.log("WorkoutOperations", "Navigation vers:", sessionUrl);
      console.log("Navigation vers:", sessionUrl);
      navigate(sessionUrl);
      
      return data;
    } catch (error: any) {
      debugLogger.error("WorkoutOperations", "Erreur lors de la création de la séance:", error);
      console.error("Erreur complète:", error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de démarrer la séance d'entraînement.",
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
