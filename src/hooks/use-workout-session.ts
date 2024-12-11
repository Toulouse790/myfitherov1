import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutTimer } from "./workout/use-workout-timer";
import { useWorkoutExercises } from "./workout/use-workout-exercises";
import { useWorkoutCompletion } from "./workout/use-workout-completion";
import { useWorkoutRegeneration } from "./workout/use-workout-regeneration";
import { useMuscleRecovery } from "./workout/use-muscle-recovery";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutSession = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCardio, setIsCardio] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const { duration, isRunning, setIsRunning } = useWorkoutTimer();
  const { exercises, isLoading, error } = useWorkoutExercises(sessionId);
  const { handleConfirmEndWorkout } = useWorkoutCompletion(sessionId, user?.id);
  const { handleRegenerateWorkout } = useWorkoutRegeneration(sessionId);
  
  // Récupérer les groupes musculaires des exercices
  const muscleGroups = exercises.map(exercise => {
    const parts = exercise.split('_');
    return parts[0]; // Supposons que le nom commence par le groupe musculaire
  });

  // Utiliser le hook de récupération musculaire
  const { recoveryStatus, updateRecoveryStatus } = useMuscleRecovery(muscleGroups);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
      checkSessionType(session);
    }
  }, [location]);

  const checkSessionType = async (sessionId: string) => {
    try {
      console.log("Checking session type for:", sessionId);
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .select('type, exercises')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error checking session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la session d'entraînement",
          variant: "destructive",
        });
        return;
      }

      console.log("Session data:", session);
      if (session?.type === 'cardio') {
        setIsCardio(true);
      }
    } catch (error) {
      console.error('Error in checkSessionType:', error);
    }
  };

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
        try {
          const exerciseName = exercises[index];
          const intensity = 0.7; // À ajuster en fonction de la difficulté réelle
          const estimatedRecoveryHours = 48; // Valeur par défaut de 48h

          // Vérifier si un enregistrement existe déjà
          const { data: existingRecord } = await supabase
            .from('muscle_recovery')
            .select('*')
            .eq('user_id', user.id)
            .eq('muscle_group', exerciseName)
            .single();

          if (existingRecord) {
            // Mettre à jour l'enregistrement existant
            const { error: updateError } = await supabase
              .from('muscle_recovery')
              .update({
                last_trained_at: new Date().toISOString(),
                intensity,
                recovery_status: 'fatigued',
                estimated_recovery_hours: estimatedRecoveryHours
              })
              .eq('user_id', user.id)
              .eq('muscle_group', exerciseName);

            if (updateError) throw updateError;
          } else {
            // Créer un nouvel enregistrement
            const { error: insertError } = await supabase
              .from('muscle_recovery')
              .insert({
                user_id: user.id,
                muscle_group: exerciseName,
                intensity,
                recovery_status: 'fatigued',
                estimated_recovery_hours: estimatedRecoveryHours
              });

            if (insertError) throw insertError;
          }

          // Mettre à jour le statut de récupération local
          updateRecoveryStatus(exerciseName, intensity, duration / 60);
        } catch (error) {
          console.error('Error updating muscle recovery:', error);
          toast({
            title: "Erreur",
            description: "Impossible de mettre à jour le statut de récupération",
            variant: "destructive",
          });
        }
      }
      
      console.log("Updated exercise index to:", index);
    } else {
      console.error("Invalid exercise index:", index);
    }
  };

  // Log state changes
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
    handleRegenerateWorkout: () => user && handleRegenerateWorkout(user.id),
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};