
import { useState, useEffect } from "react";
import { muscleRecoveryData } from "@/data/muscleRecoveryData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface MuscleRecoveryState {
  musclesNeedingRest: string[];
  recommendedIntensity: number;
  recommendedVolume: number;
  lastTrainingDate?: Date;
}

export const useMuscleRecovery = () => {
  const { user } = useAuth();
  const [recoveryState, setRecoveryState] = useState<MuscleRecoveryState>({
    musclesNeedingRest: [],
    recommendedIntensity: 0.7,
    recommendedVolume: 15
  });

  useEffect(() => {
    if (user) {
      fetchLastWorkout();
    }
  }, [user]);

  const fetchLastWorkout = async () => {
    try {
      // Récupérer la dernière session d'entraînement
      const { data: workoutSessions, error: workoutError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (workoutError) throw workoutError;

      if (!workoutSessions || workoutSessions.length === 0) {
        return;
      }

      const lastSession = workoutSessions[0];
      
      // Récupérer les exercices de cette session
      const { data: exercises, error: exerciseError } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_session_id', lastSession.id);
        
      if (exerciseError) throw exerciseError;
      
      if (!exercises || exercises.length === 0) {
        return;
      }
      
      // Transformer les exercices au format attendu par getNextWorkoutRecommendation
      const formattedExercises = exercises.map(ex => ({
        muscleGroup: ex.muscle_group,
        intensity: ex.intensity || 0.7,
        volume: ex.sets * ex.reps,
        duration: ex.duration || 0,
        actualVsPlanned: 1.0 // Par défaut
      }));
      
      const lastWorkout = {
        exercises: formattedExercises,
        date: new Date(lastSession.created_at)
      };
      
      // Calculer les recommandations
      const recommendations = getNextWorkoutRecommendation(lastWorkout);
      
      setRecoveryState({
        ...recommendations,
        lastTrainingDate: lastWorkout.date
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des données d'entraînement:", error);
    }
  };

  const calculateRecoveryNeeds = (performance: {
    muscleGroup: string;
    intensity: number;
    volume: number;
    duration: number;
    actualVsPlanned: number;
  }) => {
    const baseRecovery = muscleRecoveryData[performance.muscleGroup]?.recoveryTime || 48;
    
    // Facteurs qui augmentent le temps de récupération
    const intensityFactor = performance.intensity > 0.8 ? 1.2 : 
                          performance.intensity > 0.6 ? 1 : 0.8;
    
    const volumeFactor = performance.actualVsPlanned > 1.2 ? 1.3 : 
                        performance.actualVsPlanned > 1 ? 1.1 : 1;
    
    const durationFactor = performance.duration > 60 ? 1.2 : 1;
    
    return Math.round(baseRecovery * intensityFactor * volumeFactor * durationFactor);
  };

  const shouldAvoidMuscleGroup = (
    muscleGroup: string,
    lastTrainingDate: Date,
    performance: {
      muscleGroup: string;
      intensity: number;
      volume: number;
      duration: number;
      actualVsPlanned: number;
    }
  ) => {
    const recoveryNeeded = calculateRecoveryNeeds(performance);
    const hoursSinceLastTraining = (new Date().getTime() - lastTrainingDate.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastTraining < recoveryNeeded;
  };

  const getNextWorkoutRecommendation = (
    lastWorkout: {
      exercises: Array<{
        muscleGroup: string;
        intensity: number;
        volume: number;
        duration: number;
        actualVsPlanned: number;
      }>;
      date: Date;
    }
  ) => {
    // Muscles à éviter basés sur le dernier entraînement
    const musclesNeedingRest = new Set<string>();
    
    lastWorkout.exercises.forEach(exercise => {
      const performance = {
        muscleGroup: exercise.muscleGroup,
        intensity: exercise.intensity,
        volume: exercise.volume,
        duration: exercise.duration,
        actualVsPlanned: exercise.actualVsPlanned
      };
      
      if (shouldAvoidMuscleGroup(exercise.muscleGroup, lastWorkout.date, performance)) {
        musclesNeedingRest.add(exercise.muscleGroup);
        // Ajouter aussi les muscles synergistes
        muscleRecoveryData[exercise.muscleGroup]?.synergistMuscles.forEach(muscle => {
          musclesNeedingRest.add(muscle);
        });
      }
    });
    
    return {
      musclesNeedingRest: Array.from(musclesNeedingRest),
      recommendedIntensity: calculateRecommendedIntensity(lastWorkout.exercises),
      recommendedVolume: calculateRecommendedVolume(lastWorkout.exercises)
    };
  };

  const calculateRecommendedIntensity = (lastExercises: any[]) => {
    const averageIntensity = lastExercises.reduce((acc, ex) => acc + ex.intensity, 0) / lastExercises.length;
    const averageActualVsPlanned = lastExercises.reduce((acc, ex) => acc + ex.actualVsPlanned, 0) / lastExercises.length;
    
    // Ajuster l'intensité en fonction des performances
    if (averageActualVsPlanned > 1.2) {
      return Math.min(averageIntensity * 1.1, 1); // Augmenter mais pas plus que 1
    } else if (averageActualVsPlanned < 0.8) {
      return averageIntensity * 0.9; // Réduire de 10%
    }
    return averageIntensity;
  };

  const calculateRecommendedVolume = (lastExercises: any[]) => {
    const averageVolume = lastExercises.reduce((acc, ex) => acc + ex.volume, 0) / lastExercises.length;
    const averageActualVsPlanned = lastExercises.reduce((acc, ex) => acc + ex.actualVsPlanned, 0) / lastExercises.length;
    
    // Ajuster le volume en fonction des performances
    if (averageActualVsPlanned > 1.2) {
      return Math.round(averageVolume * 1.05); // Augmentation légère
    } else if (averageActualVsPlanned < 0.8) {
      return Math.round(averageVolume * 0.9); // Réduction plus importante
    }
    return Math.round(averageVolume);
  };

  return {
    ...recoveryState,
    refreshRecoveryData: fetchLastWorkout
  };
};
