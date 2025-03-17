
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/contexts/AuthContext";

export const useWorkoutExercisesState = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const fetchSessionExercises = async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('exercises, status')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setExercises(data.exercises || []);
        setWorkoutStarted(data.status === 'in_progress');
      }
    } catch (error) {
      debugLogger.error("useWorkoutExercisesState", "Erreur lors du chargement de la session:", error);
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
    handleExerciseClick
  };
};
