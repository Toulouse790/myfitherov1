
import { Dumbbell, Activity, Heart, Users } from "lucide-react";

export interface WorkoutFormData {
  title: string;
  muscleGroups: string[];
  difficulty: string;
  duration: string | number;
  exercises: string | number;
}

export const muscleGroups = [
  { id: "chest", name: "Pectoraux", icon: Dumbbell, color: "bg-red-500" },
  { id: "back", name: "Dos", icon: Dumbbell, color: "bg-blue-500" },
  { id: "legs", name: "Jambes", icon: Dumbbell, color: "bg-green-500" },
  { id: "shoulders", name: "Épaules", icon: Dumbbell, color: "bg-purple-500" },
  { id: "biceps", name: "Biceps", icon: Dumbbell, color: "bg-yellow-500" },
  { id: "triceps", name: "Triceps", icon: Dumbbell, color: "bg-pink-500" },
  { id: "abs", name: "Abdominaux", icon: Dumbbell, color: "bg-orange-500" },
  { id: "core", name: "Gainage", icon: Dumbbell, color: "bg-indigo-500" },
  { id: "full_body", name: "Corps complet", icon: Users, color: "bg-teal-500" },
  { id: "upper_body", name: "Haut du corps", icon: Dumbbell, color: "bg-cyan-500" },
  { id: "lower_body", name: "Bas du corps", icon: Dumbbell, color: "bg-lime-500" },
  { id: "cardio", name: "Cardio", icon: Heart, color: "bg-rose-500" }
];

export const difficultyLevels = [
  { id: "beginner", name: "Débutant", value: "Débutant" },
  { id: "intermediate", name: "Intermédiaire", value: "Intermédiaire" },
  { id: "advanced", name: "Avancé", value: "Avancé" }
];

export const workoutLocations = [
  { id: "home", value: "Maison" },
  { id: "gym", value: "Salle de sport" },
  { id: "outdoor", value: "Extérieur" }
];
