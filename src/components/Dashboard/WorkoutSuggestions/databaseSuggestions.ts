
import { WorkoutSuggestion } from "./types";

export const databaseSuggestions: WorkoutSuggestion[] = [
  {
    id: "db-1",
    title: "Séance personnalisée",
    description: "Séance adaptée à vos préférences",
    icon_name: "User",
    type: "custom",
    duration: null,
    difficulty: null,
    muscleGroups: []
  },
  {
    id: "db-2",
    title: "Séance cardio",
    description: "Course à pied, vélo, rameur...",
    icon_name: "Heart",
    type: "cardio",
    duration: 30,
    difficulty: "moderate",
    muscleGroups: ["cardio"]
  },
  {
    id: "db-3",
    title: "Séance force",
    description: "Entraînement en force",
    icon_name: "Dumbbell",
    type: "strength",
    duration: 45,
    difficulty: "challenging",
    muscleGroups: ["full_body"]
  },
  {
    id: "db-4",
    title: "Séance HIIT",
    description: "Burpees, mountain climbers...",
    icon_name: "Zap",
    type: "hiit",
    duration: 25,
    difficulty: "intense",
    muscleGroups: ["full_body"]
  },
  {
    id: "db-5",
    title: "Séance perte de poids",
    description: "Programme spécial perte de poids",
    icon_name: "Scale",
    type: "weight_loss",
    duration: 40,
    difficulty: "moderate",
    muscleGroups: ["full_body"]
  },
  {
    id: "db-6",
    title: "Séance prise de masse",
    description: "Programme de musculation intense",
    icon_name: "Beef",
    type: "muscle_gain",
    duration: 60,
    difficulty: "challenging",
    muscleGroups: ["chest", "back", "arms"]
  },
  {
    id: "db-8",
    title: "Séance récupération",
    description: "Exercices légers de récupération",
    icon_name: "Heart",
    type: "recovery",
    duration: 30,
    difficulty: "easy",
    muscleGroups: ["full_body"]
  },
  {
    id: "db-10",
    title: "Séance explosivité",
    description: "Exercices de puissance",
    icon_name: "Zap",
    type: "power",
    duration: 45,
    difficulty: "intense",
    muscleGroups: ["legs", "glutes"]
  }
];
