export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  difficulty: string;
  equipment: string;
  location: string[];
  image?: string;
  instructions: string[];
  targetMuscles?: string[];
  videoUrl?: string;
  duration?: number;
  calories?: number;
  sets?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  reps?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}