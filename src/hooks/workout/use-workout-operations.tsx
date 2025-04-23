
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
      console.log("=== DÉMARRAGE SÉANCE ===");
      console.log("WorkoutData reçue:", workoutData);
      debugLogger.log("WorkoutOperations", "Démarrage d'une séance avec:", workoutData);

      // Vérifier que les exercices sont bien définis
      if (!workoutData.exercises || workoutData.exercises.length === 0) {
        const errMsg = "Aucun exercice sélectionné pour la séance";
        console.error(errMsg);
        debugLogger.error("WorkoutOperations", errMsg);
        toast({
          title: "Erreur",
          description: errMsg,
          variant: "destructive",
        });
        return;
      }
      
      // Valeurs autorisées pour workout_type dans la base de données
      const validWorkoutTypes = ['strength', 'cardio', 'flexibility', 'hiit', 'sport_specific', 'general', 'custom'];
      
      // S'assurer que le type est valide, sinon utiliser 'strength' par défaut
      const workoutType = workoutData.type && validWorkoutTypes.includes(workoutData.type) 
        ? workoutData.type 
        : 'strength';

      // Structure simplifiée pour la session
      const sessionData = {
        user_id: user.id,
        exercises: workoutData.exercises,
        workout_type: workoutType,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        target_duration_minutes: workoutData.duration || 45,
        intensity_level: workoutData.intensity || 50
      };

      console.log("Données envoyées à Supabase:", sessionData);
      debugLogger.log("WorkoutOperations", "Envoi des données à Supabase:", sessionData);

      // Requête Supabase simplifiée
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(sessionData)
        .select('id')
        .single();

      if (error) {
        console.error("ERREUR SUPABASE:", error);
        console.error("Code d'erreur:", error.code);
        console.error("Message d'erreur:", error.message);
        console.error("Détails:", error.details);
        
        debugLogger.error("WorkoutOperations", "Erreur Supabase:", error);
        
        toast({
          title: "Erreur de création",
          description: `Impossible de créer la séance: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.id) {
        const errMsg = "Aucun ID de séance retourné";
        console.error(errMsg);
        debugLogger.error("WorkoutOperations", errMsg);
        toast({
          title: "Erreur",
          description: "Problème lors de la création de la séance",
          variant: "destructive",
        });
        return;
      }

      console.log("SUCCÈS: Séance créée avec ID:", data.id);
      debugLogger.log("WorkoutOperations", "Séance créée avec succès:", data);
      
      toast({
        title: "Séance créée",
        description: "Votre séance d'entraînement a été créée avec succès",
      });
      
      // Navigation vers la nouvelle session
      const sessionUrl = `/workouts/session/${data.id}`;
      console.log("Navigation vers:", sessionUrl);
      debugLogger.log("WorkoutOperations", "Navigation vers:", sessionUrl);
      navigate(sessionUrl);
      
      return data;
    } catch (error: any) {
      console.error("ERREUR CRITIQUE:", error);
      debugLogger.error("WorkoutOperations", "Erreur lors de la création de la séance:", error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de démarrer la séance d'entraînement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startWorkout,
    isLoading
  };
}
