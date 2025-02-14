
export interface QuestionnaireResponse {
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  objective?: string;
  objectives?: string[];
  training_frequency?: number;
  workout_duration?: number;
  experience_level?: string;
  available_equipment?: string[];
  diet_type?: string;
}

export type QuestionnaireStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
