export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string | string[];
  image_url?: string;
  video_url?: string;
  is_published?: boolean;
  location?: string[];
}