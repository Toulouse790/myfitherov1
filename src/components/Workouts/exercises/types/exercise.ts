export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string | string[];
  description: string;
  equipment: string;
  location: string[];
  image_url?: string;
  video_url?: string;
  is_published?: boolean;
  instructions?: string[];
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
}