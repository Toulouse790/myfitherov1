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
}