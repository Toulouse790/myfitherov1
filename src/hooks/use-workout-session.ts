import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutTimer } from "./workout/use-workout-timer";
import { useWorkoutExercises } from "./workout/use-workout-exercises";
import { useWorkoutCompletion } from "./workout/use-workout-completion";
import { useWorkoutRegeneration } from "./workout/use-workout-regeneration";
import { useMuscleRecovery } from "./workout/use-muscle-recovery";
import { useMuscleRecoveryManagement } from "./workout/use-muscle-recovery-management";
import { useSessionManagement } from "./workout/use-session-management";
import { useState, useEffect } from "react";

export const useWorkoutSession = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const { 
    duration, 
    isRunning, 
    setIsRunning, 
    startTimer, 
    stopTimer, 
    resetTimer 
  } = useWorkoutTimer();
  
  const { exercises, isLoading, error } = useWorkoutExercises(sessionId);
  const { handleConfirmEndWorkout } = useWorkoutCompletion(sessionId, user?.id);
  const { handleRegenerateWorkout } = useWorkoutRegeneration(sessionId);
  const { isCardio } = useSessionManagement(sessionId);
  
  const muscleGroups = exercises.map(exercise => {
    const parts = exercise.split('_');
    return parts[0];
  });

  const { recoveryStatus, updateRecoveryStatus } = useMuscleRecovery(muscleGroups);
  const { updateMuscleRecovery } = useMuscleRecoveryManagement(user?.id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
    }
  }, [location]);

  const handleExerciseClick = async (index: number) => {
    console.log("Handling exercise click:", {
      index,
      currentExerciseIndex,
      exercises: exercises.length
    });
    
    if (index >= 0 && index < exercises.length) {
      setCurrentExerciseIndex(index);
      setWorkoutStarted(true);
      
      if (user) {
        const exerciseName = exercises[index];
        const intensity = 0.7;
        
        await updateMuscleRecovery(exerciseName, intensity, duration / 60);
        updateRecoveryStatus(exerciseName, intensity, duration / 60);
      }
    } else {
      console.error("Invalid exercise index:", index);
    }
  };

  useEffect(() => {
    console.log("Workout session state updated:", {
      sessionId,
      exercises,
      currentExerciseIndex,
      workoutStarted,
      recoveryStatus
    });
  }, [sessionId, exercises, currentExerciseIndex, workoutStarted, recoveryStatus]);

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
    setIsRunning,
    startTimer,
    stopTimer,
    resetTimer,
    handleRegenerateWorkout: () => user && handleRegenerateWorkout(user.id),
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};