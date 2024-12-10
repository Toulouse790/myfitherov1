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

export const generateWorkoutPlan = (availableExercises: string[], profile: UserProfile = defaultProfile): WorkoutPlan => {
  console.log("Génération avec", availableExercises.length, "exercices disponibles");
  
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

  // Sélection aléatoire d'exercices
  const selectedExercises = [];
  const numExercises = 3; // Nombre d'exercices souhaité
  const shuffledExercises = [...availableExercises].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(numExercises, shuffledExercises.length); i++) {
    selectedExercises.push({
      name: shuffledExercises[i],
      sets: setsAndReps.sets,
      reps: setsAndReps.reps,
      restTime: recommendedRest
    });
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