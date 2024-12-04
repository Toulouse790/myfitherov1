export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string;
  location: ("home" | "gym" | "outdoor")[];
  image?: string;
  instructions: string[];
  targetMuscles: string[];
  objectives: ("weight_loss" | "muscle_gain" | "maintenance" | "endurance")[];
  sets: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  reps: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  restTime: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  calories: number;
}