export const muscleGroups = [
  { id: "pectoraux", name: "Pectoraux" },
  { id: "dos", name: "Dos" },
  { id: "jambes", name: "Jambes" },
  { id: "épaules", name: "Épaules" },
  { id: "biceps", name: "Biceps" },
  { id: "triceps", name: "Triceps" },
  { id: "abdominaux", name: "Abdominaux" }
];

export const workoutTypes = [
  { id: "strength", name: "Force" },
  { id: "hypertrophy", name: "Volume" },
  { id: "endurance", name: "Endurance" },
  { id: "cardio", name: "Cardio" }
];

export const locations = [
  { id: "home", name: "Maison" },
  { id: "gym", name: "Salle" },
  { id: "outdoor", name: "Extérieur" }
];

export const difficulties = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" }
];

export const objectives = [
  { id: "weight_loss", name: "Perte de poids" },
  { id: "muscle_gain", name: "Prise de masse" },
  { id: "maintenance", name: "Maintien" },
  { id: "endurance", name: "Endurance" }
];

export interface WorkoutData {
  id: string;
  title: string;
  muscleGroups: string[];
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    calories?: number;
  }[];
  duration: number;
  difficulty: string;
  location: string;
  type: string;
  objectives: string[];
}