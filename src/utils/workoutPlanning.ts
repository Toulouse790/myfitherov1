interface MuscleGroup {
  name: string;
  recoveryTime: number; // in hours
  synergistMuscles: string[]; // muscles that work together
}

// Données scientifiques sur la récupération musculaire
export const muscleRecoveryData: { [key: string]: MuscleGroup } = {
  chest: {
    name: "Pectoraux",
    recoveryTime: 48,
    synergistMuscles: ["shoulders", "triceps"]
  },
  back: {
    name: "Dos",
    recoveryTime: 72,
    synergistMuscles: ["biceps", "shoulders"]
  },
  legs: {
    name: "Jambes",
    recoveryTime: 72,
    synergistMuscles: ["lower_back"]
  },
  shoulders: {
    name: "Épaules",
    recoveryTime: 48,
    synergistMuscles: ["triceps", "chest"]
  },
  biceps: {
    name: "Biceps",
    recoveryTime: 48,
    synergistMuscles: ["back"]
  },
  triceps: {
    name: "Triceps",
    recoveryTime: 48,
    synergistMuscles: ["chest", "shoulders"]
  },
  abs: {
    name: "Abdominaux",
    recoveryTime: 24,
    synergistMuscles: ["lower_back"]
  }
};

interface WorkoutPerformance {
  muscleGroup: string;
  intensity: number; // 0-1
  volume: number; // total reps × sets
  duration: number;
  actualVsPlanned: number; // ratio of actual/planned
}

export const calculateRecoveryNeeds = (performance: WorkoutPerformance) => {
  const baseRecovery = muscleRecoveryData[performance.muscleGroup]?.recoveryTime || 48;
  
  // Facteurs qui augmentent le temps de récupération
  const intensityFactor = performance.intensity > 0.8 ? 1.2 : 
                         performance.intensity > 0.6 ? 1 : 0.8;
  
  const volumeFactor = performance.actualVsPlanned > 1.2 ? 1.3 : 
                      performance.actualVsPlanned > 1 ? 1.1 : 1;
  
  const durationFactor = performance.duration > 60 ? 1.2 : 1;
  
  return Math.round(baseRecovery * intensityFactor * volumeFactor * durationFactor);
};

export const shouldAvoidMuscleGroup = (
  muscleGroup: string,
  lastTrainingDate: Date,
  performance: WorkoutPerformance
) => {
  const recoveryNeeded = calculateRecoveryNeeds(performance);
  const hoursSinceLastTraining = (new Date().getTime() - lastTrainingDate.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLastTraining < recoveryNeeded;
};

export const getNextWorkoutRecommendation = (
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
    const performance: WorkoutPerformance = {
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