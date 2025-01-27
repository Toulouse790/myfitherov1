import { useNavigate } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const { duration, isRunning, startTimer, stopTimer, resetTimer, setIsRunning } = useWorkoutTimer();
  const { exercises, isLoading, error } = useWorkoutExercises();
  const { handleConfirmEndWorkout } = useWorkoutCompletion(user?.id);
  const { handleRegenerateWorkout } = useWorkoutRegeneration();
  const { isCardio } = useSessionManagement();
  const { updateRecoveryStatus } = useRecoveryManagement();

  const muscleGroups = exercises.map(exercise => {
    return exercise.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  });

  const { recoveryStatus } = useMuscleRecovery(muscleGroups);
  const { updateMuscleRecovery } = useMuscleRecoveryManagement(user?.id);

  const createWorkoutSession = async (type: string) => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une séance",
          variant: "destructive",
        });
        return;
      }

      // First check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }]);

        if (insertError) {
          throw insertError;
        }
      }

      if (type === 'favorites') {
        navigate('/workouts');
        return;
      }

      // Définir les exercices selon le type
      let defaultExercises: string[];
      let workoutType: string;

      if (type === 'cardio') {
        defaultExercises = [
          "Course à pied",
          "Vélo stationnaire",
          "Rameur",
          "Corde à sauter"
        ];
        workoutType = 'cardio';
      } else if (type === 'hiit') {
        defaultExercises = [
          "Burpees",
          "Mountain climbers",
          "Jumping jacks",
          "High knees"
        ];
        workoutType = 'hiit';
      } else {
        defaultExercises = type === 'quick' ? [
          "Extensions triceps",
          "Développé couché",
          "Squat"
        ] : [
          "Extensions triceps",
          "Développé couché", 
          "Squat",
          "Soulevé de terre",
          "Développé militaire"
        ];
        workoutType = 'strength';
      }

      const workoutData = {
        user_id: user.id,
        workout_type: workoutType,
        status: 'in_progress',
        target_duration_minutes: type === 'quick' ? 30 : 45,
        exercises: defaultExercises,
      };

      const { data: workoutSession, error } = await supabase
        .from('workout_sessions')
        .insert(workoutData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (workoutSession) {
        console.log("Workout session created:", workoutSession);
        navigate(`/workouts/${workoutSession.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

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
    createWorkoutSession,
    handleRegenerateWorkout: () => user && handleRegenerateWorkout(user.id),
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};