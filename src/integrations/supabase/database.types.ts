import { Profile, ProfileInsert, ProfileUpdate } from '@/types/supabase/profile';
import { QuestionnaireResponse, QuestionnaireResponseInsert, QuestionnaireResponseUpdate } from '@/types/supabase/questionnaire';
import { WorkoutSession, WorkoutSessionInsert, WorkoutSessionUpdate } from '@/types/supabase/workout';
import { FoodJournalEntry, FoodJournalEntryInsert } from '@/types/supabase/food';

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
      food_journal_entries: {
        Row: FoodJournalEntry;
        Insert: FoodJournalEntryInsert;
        Update: Partial<FoodJournalEntryInsert>;
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