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
  location: string;
}

export interface WorkoutData extends Omit<WorkoutFormData, 'duration' | 'exercises'> {
  id: string;
  duration: number;
  exercises: number;
}

export const initialFormData: WorkoutFormData = {
  title: "",
  description: "",
  muscleGroup: "",
  duration: "",
  exercises: "",
  difficulty: "",
  equipment: "",
  location: "",
};

export const sampleWorkouts: WorkoutData[] = [
  {
    id: "1",
    title: "Full Body Débutant",
    description: "Une séance complète pour débuter la musculation",
    muscleGroup: "fullBody",
    difficulty: "beginner",
    duration: 45,
    exercises: 8,
    equipment: "Haltères, Tapis",
    location: "home",
  },
  {
    id: "2",
    title: "Push Day",
    description: "Séance focalisée sur les muscles de la poussée",
    muscleGroup: "chest",
    difficulty: "intermediate",
    duration: 60,
    exercises: 6,
    equipment: "Banc de musculation, Haltères, Élastiques",
    location: "gym",
  },
  {
    id: "3",
    title: "Cardio HIIT",
    description: "Entraînement par intervalles de haute intensité",
    muscleGroup: "fullBody",
    difficulty: "advanced",
    duration: 30,
    exercises: 10,
    equipment: "Tapis, Corde à sauter",
    location: "outdoor",
  },
];