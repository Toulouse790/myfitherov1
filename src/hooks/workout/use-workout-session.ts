import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutTimer } from "./use-workout-timer";
import { useWorkoutExercises } from "./use-workout-exercises";
import { useWorkoutCompletion } from "./use-workout-completion";
import { useWorkoutRegeneration } from "./use-workout-regeneration";
import { useMuscleRecovery } from "./use-muscle-recovery";
import { useMuscleRecoveryManagement } from "./use-muscle-recovery-management";
import { useSessionManagement } from "./use-session-management";
import { useRecoveryManagement } from "./use-recovery-management";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutSession = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const { duration, isRunning, startTimer, stopTimer, resetTimer, setIsRunning } = useWorkoutTimer();
  const { exercises, isLoading, error } = useWorkoutExercises(sessionId);
  const { handleConfirmEndWorkout } = useWorkoutCompletion(sessionId, user?.id);
  const { handleRegenerateWorkout } = useWorkoutRegeneration(sessionId);
  const { isCardio } = useSessionManagement(sessionId);
  const { updateRecoveryStatus } = useRecoveryManagement();

  const muscleGroups = exercises.map(exercise => {
    return exercise.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  });

  const { recoveryStatus } = useMuscleRecovery(muscleGroups);
  const { updateMuscleRecovery } = useMuscleRecoveryManagement(user?.id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
    }

    return () => {
      stopTimer();
      setWorkoutStarted(false);
    };
  }, [location, stopTimer]);

  const handleExerciseClick = async (index: number) => {
    try {
      if (index >= 0 && index < exercises.length) {
        setCurrentExerciseIndex(index);
        setWorkoutStarted(true);
        startTimer();
        
        if (!user) {
          console.error("No user available");
          return;
        }

        const exerciseName = exercises[index];
        await updateRecoveryStatus(exerciseName, 0.7, duration / 60);
        await updateMuscleRecovery(exerciseName, 0.7, duration / 60);
      } else {
        console.error("Invalid exercise index:", index);
      }
    } catch (error) {
      console.error('Error in handleExerciseClick:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement d'exercice",
        variant: "destructive",
      });
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
    recoveryStatus,
    startTimer,
    stopTimer,
    resetTimer,
    setIsRunning,
    handleRegenerateWorkout: () => user && handleRegenerateWorkout(user.id),
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};