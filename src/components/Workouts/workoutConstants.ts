export const muscleGroups = [
  { id: "chest", name: "Pectoraux", color: "bg-primary" },
  { id: "back", name: "Dos", color: "bg-primary" },
  { id: "legs", name: "Jambes", color: "bg-primary" },
  { id: "shoulders", name: "Épaules", color: "bg-primary" },
  { id: "arms", name: "Bras", color: "bg-primary" },
  { id: "abs", name: "Abdominaux", color: "bg-primary" },
  { id: "fullBody", name: "Full Body", color: "bg-primary" },
];

export const difficultyLevels = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" },
  { id: "expert", name: "Expert" },
];

export interface WorkoutFormData {
  title: string;
  description: string;
  muscleGroup: string;
  duration: string;
  exercises: string;
  difficulty: string;
  equipment: string;
}

export const initialFormData: WorkoutFormData = {
  title: "",
  description: "",
  muscleGroup: "",
  duration: "",
  exercises: "",
  difficulty: "",
  equipment: "",
};