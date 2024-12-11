import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutTimer } from "./use-workout-timer";
import { useWorkoutExercises } from "./use-workout-exercises";
import { useWorkoutCompletion } from "./use-workout-completion";
import { useWorkoutRegeneration } from "./use-workout-regeneration";
import { useMuscleRecovery } from "./use-muscle-recovery";
import { useMuscleRecoveryManagement } from "./use-muscle-recovery-management";
import { useSessionManagement } from "./use-session-management";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutSession = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const { duration, isRunning, startTimer, stopTimer, resetTimer } = useWorkoutTimer();
  const { exercises, isLoading, error } = useWorkoutExercises(sessionId);
  const { handleConfirmEndWorkout } = useWorkoutCompletion(sessionId, user?.id);
  const { handleRegenerateWorkout } = useWorkoutRegeneration(sessionId);
  const { isCardio } = useSessionManagement(sessionId);

  const muscleGroups = exercises.map(exercise => {
    return exercise.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  });

  const { recoveryStatus, updateRecoveryStatus } = useMuscleRecovery(muscleGroups);
  const { updateMuscleRecovery } = useMuscleRecoveryManagement(user?.id);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
    }

    // Cleanup function
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
        
        if (!user || !sessionId) {
          console.error("No user or session ID available");
          return;
        }

        const exerciseName = exercises[index];
        const normalizedName = exerciseName.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_');

        console.log("Updating recovery status for:", {
          exerciseName,
          normalizedName,
          userId: user.id
        });

        const { error: recoveryError } = await supabase
          .from('muscle_recovery')
          .upsert({
            user_id: user.id,
            muscle_group: normalizedName,
            intensity: 0.7,
            recovery_status: 'fatigued',
            estimated_recovery_hours: 48,
            last_trained_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,muscle_group'
          });

        if (recoveryError) {
          console.error('Error updating recovery status:', recoveryError);
          toast({
            title: "Erreur",
            description: "Impossible de mettre à jour le statut de récupération",
            variant: "destructive",
          });
          return;
        }

        await updateMuscleRecovery(exerciseName, 0.7, duration / 60);
        updateRecoveryStatus(exerciseName, 0.7, duration / 60);
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
    handleRegenerateWorkout: () => user && handleRegenerateWorkout(user.id),
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};