
import { Dumbbell, Activity, Heart, Users } from "lucide-react";

export const muscleGroups = [
  { id: "chest", icon: Dumbbell },
  { id: "back", icon: Dumbbell },
  { id: "legs", icon: Dumbbell },
  { id: "shoulders", icon: Dumbbell },
  { id: "biceps", icon: Dumbbell },
  { id: "triceps", icon: Dumbbell },
  { id: "abs", icon: Dumbbell },
  { id: "core", icon: Dumbbell },
  { id: "full_body", icon: Users },
  { id: "upper_body", icon: Dumbbell },
  { id: "lower_body", icon: Dumbbell },
  { id: "cardio", icon: Heart }
];

export const difficultyLevels = [
  { id: "beginner", value: "Débutant" },
  { id: "intermediate", value: "Intermédiaire" },
  { id: "advanced", value: "Avancé" }
];

export const workoutLocations = [
  { id: "home", value: "Maison" },
  { id: "gym", value: "Salle de sport" },
  { id: "outdoor", value: "Extérieur" }
];
