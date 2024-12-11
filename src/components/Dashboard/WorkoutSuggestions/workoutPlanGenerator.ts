export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

export interface WorkoutPlan {
  volume: number;
  intensity: number;
  recommendedRest: number;
  setsAndReps: {
    sets: number;
    reps: number;
  };
  exercises: Exercise[];
}

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
  workoutsPerWeek: number;
  dailyCalories: number;
  recoveryCapacity: 'low' | 'medium' | 'high';
}

const defaultProfile: UserProfile = {
  age: 30,
  weight: 75,
  height: 175,
  goal: 'muscle_gain',
  workoutsPerWeek: 3,
  dailyCalories: 2500,
  recoveryCapacity: 'medium'
};

const calculateCaloriesPerExercise = (
  weight: number,
  reps: number,
  sets: number,
  intensity: number
): number => {
  // MET (Metabolic Equivalent of Task) moyen pour la musculation
  const MET = 5.0;
  // Durée estimée par répétition en minutes (3 secondes par rep)
  const duration = (reps * sets * 3) / 60;
  // Formule de base des calories : MET * 3.5 * poids en kg * durée en minutes / 200
  const baseCalories = (MET * 3.5 * weight * duration) / 200;
  // Ajustement selon l'intensité
  return Math.round(baseCalories * (1 + intensity));
};

export const generateWorkoutPlan = (
  availableExercises: string[], 
  profile: UserProfile = defaultProfile,
  muscleRecoveryStatus?: { muscleGroup: string; recoveryStatus: string }[]
): WorkoutPlan => {
  console.log("Génération avec", availableExercises.length, "exercices disponibles");
  
  // Calcul de l'intensité en fonction du profil et de la récupération
  const baseIntensity = profile.workoutsPerWeek > 3 ? 0.8 : 0.7;
  const recoveryModifier = profile.recoveryCapacity === 'high' ? 0.1 : 
                          profile.recoveryCapacity === 'low' ? -0.1 : 0;
  
  // Ajustement de l'intensité en fonction du statut de récupération
  let intensityModifier = 0;
  if (muscleRecoveryStatus?.some(status => status.recoveryStatus === 'fatigued')) {
    intensityModifier -= 0.2;
  } else if (muscleRecoveryStatus?.every(status => status.recoveryStatus === 'recovered')) {
    intensityModifier += 0.1;
  }
  
  const intensity = Math.min(Math.max(baseIntensity + recoveryModifier + intensityModifier, 0.5), 0.9);

  // Calcul du volume en fonction de l'objectif et de la récupération
  const baseVolume = profile.goal === 'muscle_gain' ? 15 : 12;
  const volumeModifier = profile.workoutsPerWeek > 3 ? 3 : 0;
  const recoveryVolumeModifier = muscleRecoveryStatus?.some(status => status.recoveryStatus === 'fatigued') ? -3 : 0;
  const volume = baseVolume + volumeModifier + recoveryVolumeModifier;

  // Calcul des séries et répétitions
  const setsAndReps = {
    sets: profile.goal === 'muscle_gain' ? 4 : 3,
    reps: profile.goal === 'muscle_gain' ? 10 : 12,
  };

  // Temps de repos recommandé
  const baseRest = profile.goal === 'muscle_gain' ? 90 : 60;
  const restModifier = muscleRecoveryStatus?.some(status => status.recoveryStatus === 'fatigued') ? 30 : 0;
  const recommendedRest = baseRest + restModifier;

  // Filtrer les exercices en fonction du statut de récupération
  const availableForTraining = muscleRecoveryStatus 
    ? availableExercises.filter(exercise => {
        const muscleGroup = exercise.split('_')[0]; // Supposons que le nom contient le groupe musculaire
        const status = muscleRecoveryStatus.find(s => s.muscleGroup === muscleGroup);
        return !status || status.recoveryStatus !== 'fatigued';
      })
    : availableExercises;

  // Sélection aléatoire d'exercices
  const selectedExercises = [];
  const numExercises = Math.min(3, availableForTraining.length);
  const shuffledExercises = [...availableForTraining].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numExercises; i++) {
    const exercise = {
      name: shuffledExercises[i],
      sets: setsAndReps.sets,
      reps: setsAndReps.reps,
      restTime: recommendedRest
    };
    selectedExercises.push(exercise);
  }

  console.log("Exercices sélectionnés:", selectedExercises);

  return {
    volume,
    intensity,
    recommendedRest,
    setsAndReps,
    exercises: selectedExercises
  };
};