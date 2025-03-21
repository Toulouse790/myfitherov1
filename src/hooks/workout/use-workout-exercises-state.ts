
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutExercisesState = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessionExercises = async (sessionId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour accéder à cette séance",
        variant: "destructive",
      });
      navigate('/signin', { state: { from: `/workouts/${sessionId}` } });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('exercises, status')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setExercises(data.exercises || []);
        setWorkoutStarted(data.status === 'in_progress');
        
        if (data.exercises?.length === 0) {
          toast({
            title: "Séance vide",
            description: "Cette séance ne contient aucun exercice",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      debugLogger.error("useWorkoutExercisesState", "Erreur lors du chargement de la session:", error);
      
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la séance d'entraînement",
        variant: "destructive",
      });
      
      // Redirection vers la page des workouts en cas d'erreur
      navigate('/workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseClick = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  return {
    exercises,
    setExercises,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    workoutStarted,
    setWorkoutStarted,
    fetchSessionExercises,
    handleExerciseClick,
    isLoading
  };
};
