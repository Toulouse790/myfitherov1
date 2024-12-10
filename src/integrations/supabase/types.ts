export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon_name: string
          id: string
          name: string
          unlocked_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon_name: string
          id?: string
          name: string
          unlocked_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          name?: string
          unlocked_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          action_type: string
          context: Json
          created_at: string
          feedback: boolean | null
          id: string
          input_tokens: number | null
          metadata: Json | null
          model_name: string | null
          output_tokens: number | null
          prompt_template: string | null
          response_time_ms: number | null
          result: string | null
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          context: Json
          created_at?: string
          feedback?: boolean | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_name?: string | null
          output_tokens?: number | null
          prompt_template?: string | null
          response_time_ms?: number | null
          result?: string | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          context?: Json
          created_at?: string
          feedback?: boolean | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_name?: string | null
          output_tokens?: number | null
          prompt_template?: string | null
          response_time_ms?: number | null
          result?: string | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_training_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cardio_exercises: {
        Row: {
          calories_formula: string
          created_at: string
          id: string
          name: string
          parameters: Json
          type: string
        }
        Insert: {
          calories_formula: string
          created_at?: string
          id?: string
          name: string
          parameters: Json
          type: string
        }
        Update: {
          calories_formula?: string
          created_at?: string
          id?: string
          name?: string
          parameters?: Json
          type?: string
        }
        Relationships: []
      }
      cheat_meal_library: {
        Row: {
          calories: number
          carbs: number
          category: string
          created_at: string
          fats: number
          id: string
          name: string
          proteins: number
          updated_at: string
        }
        Insert: {
          calories: number
          carbs?: number
          category: string
          created_at?: string
          fats?: number
          id?: string
          name: string
          proteins: number
          updated_at?: string
        }
        Update: {
          calories?: number
          carbs?: number
          category?: string
          created_at?: string
          fats?: number
          id?: string
          name?: string
          proteins?: number
          updated_at?: string
        }
        Relationships: []
      }
      common_foods: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          description: string | null
          diet_types: string[] | null
          fats: number
          food_category: string
          id: string
          ingredients: Json | null
          name: string
          proteins: number
          serving_size: number
          serving_unit: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          description?: string | null
          diet_types?: string[] | null
          fats: number
          food_category: string
          id?: string
          ingredients?: Json | null
          name: string
          proteins: number
          serving_size?: number
          serving_unit?: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          description?: string | null
          diet_types?: string[] | null
          fats?: number
          food_category?: string
          id?: string
          ingredients?: Json | null
          name?: string
          proteins?: number
          serving_size?: number
          serving_unit?: string
        }
        Relationships: []
      }
      exercise_media: {
        Row: {
          created_at: string
          difficulty: string[] | null
          exercise_id: string | null
          exercise_name: string
          id: string
          location: string[] | null
          media_type: string
          media_url: string
        }
        Insert: {
          created_at?: string
          difficulty?: string[] | null
          exercise_id?: string | null
          exercise_name: string
          id?: string
          location?: string[] | null
          media_type: string
          media_url: string
        }
        Update: {
          created_at?: string
          difficulty?: string[] | null
          exercise_id?: string | null
          exercise_name?: string
          id?: string
          location?: string[] | null
          media_type?: string
          media_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_media_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          difficulty: string[]
          id: string
          is_published: boolean | null
          location: string[] | null
          muscle_group: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: string[]
          id?: string
          is_published?: boolean | null
          location?: string[] | null
          muscle_group: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: string[]
          id?: string
          is_published?: boolean | null
          location?: string[] | null
          muscle_group?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_journal_entries: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          fats: number
          id: string
          meal_type: string
          name: string
          notes: string | null
          proteins: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calories: number
          carbs?: number
          created_at?: string
          fats?: number
          id?: string
          meal_type?: string
          name: string
          notes?: string | null
          proteins: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          fats?: number
          id?: string
          meal_type?: string
          name?: string
          notes?: string | null
          proteins?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_data: Json
          start_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_data: Json
          start_date: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_data?: Json
          start_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      muscle_measurements: {
        Row: {
          biceps_left_cm: number | null
          biceps_right_cm: number | null
          calf_left_cm: number | null
          calf_right_cm: number | null
          chest_cm: number | null
          created_at: string
          forearm_left_cm: number | null
          forearm_right_cm: number | null
          height_cm: number | null
          hips_cm: number | null
          id: string
          measurement_date: string
          thigh_left_cm: number | null
          thigh_right_cm: number | null
          updated_at: string
          user_id: string | null
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          biceps_left_cm?: number | null
          biceps_right_cm?: number | null
          calf_left_cm?: number | null
          calf_right_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          forearm_left_cm?: number | null
          forearm_right_cm?: number | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string
          measurement_date?: string
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          updated_at?: string
          user_id?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          biceps_left_cm?: number | null
          biceps_right_cm?: number | null
          calf_left_cm?: number | null
          calf_right_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          forearm_left_cm?: number | null
          forearm_right_cm?: number | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string
          measurement_date?: string
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          updated_at?: string
          user_id?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "muscle_measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          level: number | null
          meal_notifications: boolean | null
          points: number | null
          reminder_time: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          level?: number | null
          meal_notifications?: boolean | null
          points?: number | null
          reminder_time?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          meal_notifications?: boolean | null
          points?: number | null
          reminder_time?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          available_equipment: string | null
          created_at: string
          diet_type: string | null
          experience_level: string | null
          gender: string | null
          has_afternoon_snack: boolean | null
          has_morning_snack: boolean | null
          id: string
          objective: string | null
          training_frequency: string | null
          training_time: string | null
          user_id: string | null
          wake_up_time: string | null
          workout_duration: string | null
        }
        Insert: {
          available_equipment?: string | null
          created_at?: string
          diet_type?: string | null
          experience_level?: string | null
          gender?: string | null
          has_afternoon_snack?: boolean | null
          has_morning_snack?: boolean | null
          id?: string
          objective?: string | null
          training_frequency?: string | null
          training_time?: string | null
          user_id?: string | null
          wake_up_time?: string | null
          workout_duration?: string | null
        }
        Update: {
          available_equipment?: string | null
          created_at?: string
          diet_type?: string | null
          experience_level?: string | null
          gender?: string | null
          has_afternoon_snack?: boolean | null
          has_morning_snack?: boolean | null
          id?: string
          objective?: string | null
          training_frequency?: string | null
          training_time?: string | null
          user_id?: string | null
          wake_up_time?: string | null
          workout_duration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_stats: {
        Row: {
          average_intensity: number | null
          created_at: string
          duration_minutes: number
          energy_level: number | null
          id: string
          muscle_groups_worked: string[] | null
          perceived_difficulty: string | null
          session_id: string | null
          total_reps: number
          total_sets: number
          total_weight: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          average_intensity?: number | null
          created_at?: string
          duration_minutes?: number
          energy_level?: number | null
          id?: string
          muscle_groups_worked?: string[] | null
          perceived_difficulty?: string | null
          session_id?: string | null
          total_reps?: number
          total_sets?: number
          total_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          average_intensity?: number | null
          created_at?: string
          duration_minutes?: number
          energy_level?: number | null
          id?: string
          muscle_groups_worked?: string[] | null
          perceived_difficulty?: string | null
          session_id?: string | null
          total_reps?: number
          total_sets?: number
          total_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_stats_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_nutrition_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string
          excluded_foods: string[] | null
          id: string
          intolerances: string[] | null
          meal_validation_notifications: boolean | null
          meal_validation_times: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          excluded_foods?: string[] | null
          id?: string
          intolerances?: string[] | null
          meal_validation_notifications?: boolean | null
          meal_validation_times?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          excluded_foods?: string[] | null
          id?: string
          intolerances?: string[] | null
          meal_validation_notifications?: boolean | null
          meal_validation_times?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_nutrition_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_suggested_foods: {
        Row: {
          calories: number
          category: string
          created_at: string
          id: string
          name: string
          proteins: number
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calories: number
          category: string
          created_at?: string
          id?: string
          name: string
          proteins: number
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calories?: number
          category?: string
          created_at?: string
          id?: string
          name?: string
          proteins?: number
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_suggested_foods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          created_at: string | null
          exercises: string[] | null
          id: string
          initial_energy_level: string | null
          is_adapted: boolean | null
          started_at: string | null
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          exercises?: string[] | null
          id?: string
          initial_energy_level?: string | null
          is_adapted?: boolean | null
          started_at?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          exercises?: string[] | null
          id?: string
          initial_energy_level?: string | null
          is_adapted?: boolean | null
          started_at?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ai_training_analytics: {
        Row: {
          action_type: string | null
          avg_input_tokens: number | null
          avg_output_tokens: number | null
          avg_response_time_ms: number | null
          day: string | null
          negative_feedback: number | null
          positive_feedback: number | null
          total_requests: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_ai_usage_stats: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          total_requests: number
          avg_response_time: number
          success_rate: number
          top_actions: string[]
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
