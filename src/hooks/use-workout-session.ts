
import { useEffect } from "react";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { useWorkoutExercisesState } from "@/hooks/workout/use-workout-exercises-state";
import { useSessionActions } from "@/hooks/workout/use-session-actions";

export const useWorkoutSession = () => {
  const { 
    exercises, 
    currentExerciseIndex, 
    workoutStarted,
    fetchSessionExercises,
    handleExerciseClick
  } = useWorkoutExercisesState();

  const {
    createWorkoutSession,
    handleConfirmEndWorkout
  } = useSessionActions();

  const { 
    duration, 
    isRunning, 
    startTimer, 
    stopTimer, 
    resetTimer 
  } = useWorkoutTimer();

  useEffect(() => {
    // Extraire l'ID de session de l'URL
    const pathParts = window.location.pathname.split('/');
    const sessionId = pathParts[pathParts.length - 1];
    if (sessionId && sessionId !== 'workouts') {
      fetchSessionExercises(sessionId);
    }
  }, []);

  return { 
    exercises, 
    currentExerciseIndex, 
    workoutStarted, 
    duration,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    handleExerciseClick,
    handleConfirmEndWorkout,
    createWorkoutSession 
  };
};
