import { Profile, ProfileInsert, ProfileUpdate } from '@/types/database/profile';
import { QuestionnaireResponse, QuestionnaireResponseInsert, QuestionnaireResponseUpdate } from '@/types/database/questionnaire';
import { WorkoutSession, WorkoutSessionInsert, WorkoutSessionUpdate } from '@/types/database/workout';
import { ExerciseMedia, ExerciseMediaInsert, ExerciseMediaUpdate } from '@/types/database/exercise-media';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      questionnaire_responses: {
        Row: QuestionnaireResponse;
        Insert: QuestionnaireResponseInsert;
        Update: QuestionnaireResponseUpdate;
      };
      workout_sessions: {
        Row: WorkoutSession;
        Insert: WorkoutSessionInsert;
        Update: WorkoutSessionUpdate;
      };
      exercise_media: {
        Row: ExerciseMedia;
        Insert: ExerciseMediaInsert;
        Update: ExerciseMediaUpdate;
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