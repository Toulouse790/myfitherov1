import { ExerciseMedia, ExerciseMediaInsert } from "@/types/exercise-media";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          id: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          updated_at?: string;
          username?: string | null;
        };
      };
      exercise_media: {
        Row: ExerciseMedia;
        Insert: ExerciseMediaInsert;
        Update: Partial<ExerciseMediaInsert>;
      };
      questionnaire_responses: {
        Row: {
          available_equipment: string | null;
          created_at: string;
          experience_level: string | null;
          id: string;
          objective: string | null;
          training_frequency: string | null;
          user_id: string | null;
        };
        Insert: {
          available_equipment?: string | null;
          created_at?: string;
          experience_level?: string | null;
          id?: string;
          objective?: string | null;
          training_frequency?: string | null;
          user_id?: string | null;
        };
        Update: {
          available_equipment?: string | null;
          created_at?: string;
          experience_level?: string | null;
          id?: string;
          objective?: string | null;
          training_frequency?: string | null;
          user_id?: string | null;
        };
      };
      workout_sessions: {
        Row: {
          created_at: string | null;
          id: string;
          started_at: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};