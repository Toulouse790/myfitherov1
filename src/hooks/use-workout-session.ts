import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutTimer } from "./workout/use-workout-timer";
import { useWorkoutExercises } from "./workout/use-workout-exercises";
import { useWorkoutCompletion } from "./workout/use-workout-completion";
import { useWorkoutRegeneration } from "./workout/use-workout-regeneration";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const useWorkoutSession = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCardio, setIsCardio] = useState(false);

  const { duration, isRunning, setIsRunning } = useWorkoutTimer();
  const { 
    exercises, 
    currentExerciseIndex, 
    workoutStarted,
    fetchSessionExercises,
    handleExerciseClick 
  } = useWorkoutExercises();
  const { handleConfirmEndWorkout } = useWorkoutCompletion(sessionId, user?.id);
  const { handleRegenerateWorkout } = useWorkoutRegeneration(sessionId);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
      checkSessionType(session);
      fetchSessionExercises(session);
    }
  }, [location]);

  const checkSessionType = async (sessionId: string) => {
    try {
      const { data: session } = await supabase
        .from('workout_sessions')
        .select('type')
        .eq('id', sessionId)
        .single();

      if (session?.type === 'cardio') {
        setIsCardio(true);
      }
    } catch (error) {
      console.error('Error checking session type:', error);
    }
  };

  return {
    user,
    sessionId,
    isCardio,
    duration,
    isRunning,
    exercises,
    currentExerciseIndex,
    workoutStarted,
    setIsRunning,
    handleRegenerateWorkout: () => user && handleRegenerateWorkout(user.id),
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};