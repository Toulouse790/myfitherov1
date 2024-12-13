export const muscleGroups = [
  { id: "chest", name: "Pectoraux", color: "bg-red-500" },
  { id: "back", name: "Dos", color: "bg-blue-500" },
  { id: "legs", name: "Jambes", color: "bg-green-500" },
  { id: "shoulders", name: "Épaules", color: "bg-purple-500" },
  { id: "biceps", name: "Biceps", color: "bg-yellow-500" },
  { id: "triceps", name: "Triceps", color: "bg-pink-500" },
  { id: "abs", name: "Abdominaux", color: "bg-orange-500" }
];

export const difficultyLevels = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" }
];

export interface WorkoutFormData {
  title: string;
  muscleGroups: string[];
  difficulty: string;
  duration: string;
  exercises: string;
}

export interface WorkoutData {
  id: string;
  title: string;
  muscleGroups: string[];
  difficulty: string;
  duration: string;
  exercises: string[];
}

export const initialFormData: WorkoutFormData = {
  title: "",
  muscleGroups: [],
  difficulty: "beginner",
  duration: "45",
  exercises: ""
};