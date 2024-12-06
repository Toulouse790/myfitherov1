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

export const generateWorkoutPlan = (profile: UserProfile): WorkoutPlan => {
  // Calcul de l'intensité en fonction du profil
  const baseIntensity = profile.workoutsPerWeek > 3 ? 0.8 : 0.7;
  const intensityModifier = profile.recoveryCapacity === 'high' ? 0.1 : 0;
  const intensity = Math.min(baseIntensity + intensityModifier, 0.9);

  // Calcul du volume en fonction de l'objectif
  const baseVolume = profile.goal === 'muscle_gain' ? 15 : 12;
  const volumeModifier = profile.workoutsPerWeek > 3 ? 3 : 0;
  const volume = baseVolume + volumeModifier;

  // Calcul des séries et répétitions
  const setsAndReps = {
    sets: profile.goal === 'muscle_gain' ? 4 : 3,
    reps: profile.goal === 'muscle_gain' ? 10 : 12,
  };

  // Temps de repos recommandé
  const recommendedRest = profile.goal === 'muscle_gain' ? 90 : 60;

  // Exemple d'exercices (à adapter selon les besoins)
  const exercises: Exercise[] = [
    {
      name: "Développé couché",
      sets: setsAndReps.sets,
      reps: setsAndReps.reps,
      restTime: recommendedRest
    },
    {
      name: "Squat",
      sets: setsAndReps.sets,
      reps: setsAndReps.reps,
      restTime: recommendedRest
    },
    {
      name: "Rowing barre",
      sets: setsAndReps.sets,
      reps: setsAndReps.reps,
      restTime: recommendedRest
    }
  ];

  return {
    volume,
    intensity,
    recommendedRest,
    setsAndReps,
    exercises
  };
};