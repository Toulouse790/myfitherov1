export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  muscle_group: string;
  description: string;
  difficulty: string[];
  equipment: string;
  location: string[];
  image_url?: string;
  video_url?: string;
  instructions: string[];
  targetMuscles?: string[];
  objectives?: string[];
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
  restTime?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  calories?: number;
  is_published?: boolean;
}