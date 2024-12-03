export interface QuestionnaireResponse {
  available_equipment: string | null;
  created_at: string;
  experience_level: string | null;
  id: string;
  objective: string | null;
  training_frequency: string | null;
  user_id: string | null;
}

export interface QuestionnaireResponseInsert {
  available_equipment?: string | null;
  created_at?: string;
  experience_level?: string | null;
  id?: string;
  objective?: string | null;
  training_frequency?: string | null;
  user_id?: string | null;
}

export interface QuestionnaireResponseUpdate {
  available_equipment?: string | null;
  created_at?: string;
  experience_level?: string | null;
  id?: string;
  objective?: string | null;
  training_frequency?: string | null;
  user_id?: string | null;
}