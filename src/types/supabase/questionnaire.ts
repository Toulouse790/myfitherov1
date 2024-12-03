export interface QuestionnaireResponse {
  id: string;
  user_id: string | null;
  objective: string | null;
  training_frequency: string | null;
  experience_level: string | null;
  available_equipment: string | null;
  created_at: string;
}

export interface QuestionnaireResponseInsert {
  user_id?: string | null;
  objective?: string | null;
  training_frequency?: string | null;
  experience_level?: string | null;
  available_equipment?: string | null;
}

export interface QuestionnaireResponseUpdate {
  objective?: string | null;
  training_frequency?: string | null;
  experience_level?: string | null;
  available_equipment?: string | null;
}