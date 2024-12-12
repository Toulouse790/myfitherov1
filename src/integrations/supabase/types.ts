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
      admin_page_styles: {
        Row: {
          accent_color: string | null
          button_radius: string | null
          button_shadow: string | null
          created_at: string
          heading_font: string | null
          id: string
          page_name: string
          primary_color: string | null
          primary_font: string | null
          secondary_color: string | null
          updated_at: string
          user_id: string | null
          widget_radius: string | null
          widget_shadow: string | null
        }
        Insert: {
          accent_color?: string | null
          button_radius?: string | null
          button_shadow?: string | null
          created_at?: string
          heading_font?: string | null
          id?: string
          page_name: string
          primary_color?: string | null
          primary_font?: string | null
          secondary_color?: string | null
          updated_at?: string
          user_id?: string | null
          widget_radius?: string | null
          widget_shadow?: string | null
        }
        Update: {
          accent_color?: string | null
          button_radius?: string | null
          button_shadow?: string | null
          created_at?: string
          heading_font?: string | null
          id?: string
          page_name?: string
          primary_color?: string | null
          primary_font?: string | null
          secondary_color?: string | null
          updated_at?: string
          user_id?: string | null
          widget_radius?: string | null
          widget_shadow?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_page_styles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_widget_configs: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          position: number
          title: string
          updated_at: string
          user_id: string | null
          widget_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          position?: number
          title: string
          updated_at?: string
          user_id?: string | null
          widget_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          position?: number
          title?: string
          updated_at?: string
          user_id?: string | null
          widget_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_widget_configs_user_id_fkey"
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
      available_buttons: {
        Row: {
          category: string | null
          created_at: string
          icon_name: string | null
          id: string
          name: string
          style: Json
        }
        Insert: {
          category?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          name: string
          style: Json
        }
        Update: {
          category?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          name?: string
          style?: Json
        }
        Relationships: []
      }
      available_widgets: {
        Row: {
          category: string
          chart_type: string
          created_at: string
          description: string | null
          icon_name: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          chart_type: string
          created_at?: string
          description?: string | null
          icon_name: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          chart_type?: string
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cardio_exercises: {
        Row: {
          calories_burned: number | null
          calories_formula: string
          created_at: string
          id: string
          is_base_male: boolean | null
          name: string
          parameters: Json
          type: string
        }
        Insert: {
          calories_burned?: number | null
          calories_formula: string
          created_at?: string
          id?: string
          is_base_male?: boolean | null
          name: string
          parameters: Json
          type: string
        }
        Update: {
          calories_burned?: number | null
          calories_formula?: string
          created_at?: string
          id?: string
          is_base_male?: boolean | null
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
      exercise_sets: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          exercise_name: string
          id: string
          one_rep_max: number | null
          perceived_difficulty: string | null
          reps: number
          rest_time_seconds: number | null
          session_id: string | null
          set_number: number
          volume: number | null
          weight: number | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          exercise_name: string
          id?: string
          one_rep_max?: number | null
          perceived_difficulty?: string | null
          reps: number
          rest_time_seconds?: number | null
          session_id?: string | null
          set_number: number
          volume?: number | null
          weight?: number | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          exercise_name?: string
          id?: string
          one_rep_max?: number | null
          perceived_difficulty?: string | null
          reps?: number
          rest_time_seconds?: number | null
          session_id?: string | null
          set_number?: number
          volume?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_workouts: {
        Row: {
          created_at: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorite_workouts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_journal_entries: {
        Row: {
          calories: number
          carbs: number
          components: Json | null
          created_at: string
          fats: number
          id: string
          is_composite: boolean | null
          meal_type: string
          name: string
          portion_size: number | null
          portion_unit: string | null
          proteins: number
          source: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calories: number
          carbs?: number
          components?: Json | null
          created_at?: string
          fats?: number
          id?: string
          is_composite?: boolean | null
          meal_type?: string
          name: string
          portion_size?: number | null
          portion_unit?: string | null
          proteins: number
          source?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calories?: number
          carbs?: number
          components?: Json | null
          created_at?: string
          fats?: number
          id?: string
          is_composite?: boolean | null
          meal_type?: string
          name?: string
          portion_size?: number | null
          portion_unit?: string | null
          proteins?: number
          source?: string | null
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
      food_journal_entries_backup: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          fats: number | null
          id: string | null
          meal_type: string | null
          name: string | null
          proteins: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fats?: number | null
          id?: string | null
          meal_type?: string | null
          name?: string | null
          proteins?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fats?: number | null
          id?: string | null
          meal_type?: string | null
          name?: string | null
          proteins?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      meal_plans_backup: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string | null
          plan_data: Json | null
          start_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string | null
          plan_data?: Json | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string | null
          plan_data?: Json | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      muscle_measurements: {
        Row: {
          biceps_left_cm: number | null
          biceps_right_cm: number | null
          chest_cm: number | null
          created_at: string
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
          chest_cm?: number | null
          created_at?: string
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
          chest_cm?: number | null
          created_at?: string
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
      muscle_measurements_backup: {
        Row: {
          biceps_left_cm: number | null
          biceps_right_cm: number | null
          calf_left_cm: number | null
          calf_right_cm: number | null
          chest_cm: number | null
          created_at: string | null
          forearm_left_cm: number | null
          forearm_right_cm: number | null
          height_cm: number | null
          hips_cm: number | null
          id: string | null
          measurement_date: string | null
          thigh_left_cm: number | null
          thigh_right_cm: number | null
          updated_at: string | null
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
          created_at?: string | null
          forearm_left_cm?: number | null
          forearm_right_cm?: number | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string | null
          measurement_date?: string | null
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          updated_at?: string | null
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
          created_at?: string | null
          forearm_left_cm?: number | null
          forearm_right_cm?: number | null
          height_cm?: number | null
          hips_cm?: number | null
          id?: string | null
          measurement_date?: string | null
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          updated_at?: string | null
          user_id?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      muscle_recovery: {
        Row: {
          created_at: string | null
          estimated_recovery_hours: number | null
          id: string
          intensity: number | null
          last_trained_at: string | null
          muscle_group: string
          muscle_soreness_level: number | null
          nutrition_status: string | null
          previous_training_intensity: number | null
          recovery_status: string | null
          sleep_quality: number | null
          stress_level: number | null
          training_volume: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_recovery_hours?: number | null
          id?: string
          intensity?: number | null
          last_trained_at?: string | null
          muscle_group: string
          muscle_soreness_level?: number | null
          nutrition_status?: string | null
          previous_training_intensity?: number | null
          recovery_status?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          training_volume?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_recovery_hours?: number | null
          id?: string
          intensity?: number | null
          last_trained_at?: string | null
          muscle_group?: string
          muscle_soreness_level?: number | null
          nutrition_status?: string | null
          previous_training_intensity?: number | null
          recovery_status?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          training_volume?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "muscle_recovery_user_id_fkey"
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
          calories_burned: number | null
          created_at: string
          energy_level: number | null
          id: string
          muscle_groups_worked: string[] | null
          perceived_difficulty: string | null
          rest_time_seconds: number | null
          session_duration_minutes: number
          session_id: string | null
          total_weight_lifted: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          energy_level?: number | null
          id?: string
          muscle_groups_worked?: string[] | null
          perceived_difficulty?: string | null
          rest_time_seconds?: number | null
          session_duration_minutes?: number
          session_id?: string | null
          total_weight_lifted?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          energy_level?: number | null
          id?: string
          muscle_groups_worked?: string[] | null
          perceived_difficulty?: string | null
          rest_time_seconds?: number | null
          session_duration_minutes?: number
          session_id?: string | null
          total_weight_lifted?: number | null
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
      unified_exercises: {
        Row: {
          created_at: string
          difficulty: string[]
          id: string
          image_url: string | null
          is_published: boolean | null
          location: string[] | null
          muscle_group: string
          name: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          difficulty?: string[]
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string[] | null
          muscle_group: string
          name: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          difficulty?: string[]
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string[] | null
          muscle_group?: string
          name?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_exercise_weights: {
        Row: {
          created_at: string
          exercise_name: string
          id: string
          last_used_at: string | null
          last_used_weight: number | null
          notes: string | null
          personal_record: number | null
          progression_goal: number | null
          updated_at: string
          user_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          exercise_name: string
          id?: string
          last_used_at?: string | null
          last_used_weight?: number | null
          notes?: string | null
          personal_record?: number | null
          progression_goal?: number | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          exercise_name?: string
          id?: string
          last_used_at?: string | null
          last_used_weight?: number | null
          notes?: string | null
          personal_record?: number | null
          progression_goal?: number | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_exercise_weights_user_id_fkey"
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
          carbs: number
          category: string
          created_at: string
          fats: number
          id: string
          name: string
          proteins: number
          status: string | null
          updated_at: string
          user_id: string | null
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
          status?: string | null
          updated_at?: string
          user_id?: string | null
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
          total_duration_minutes: number | null
          total_rest_time_seconds: number | null
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
          total_duration_minutes?: number | null
          total_rest_time_seconds?: number | null
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
          total_duration_minutes?: number | null
          total_rest_time_seconds?: number | null
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
      workout_suggestions: {
        Row: {
          created_at: string
          criteria: Json | null
          description: string
          icon_name: string
          id: string
          is_active: boolean | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria?: Json | null
          description: string
          icon_name: string
          id?: string
          is_active?: boolean | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria?: Json | null
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
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
      calculate_calories_by_gender: {
        Args: {
          base_calories: number
          gender: string
          weight_kg?: number
          height_cm?: number
          age?: number
        }
        Returns: number
      }
      calculate_exercise_calories: {
        Args: {
          weight_kg: number
          duration_minutes: number
          intensity: string
          gender: string
        }
        Returns: number
      }
      calculate_macros: {
        Args: {
          base_calories: number
          portion_size: number
          food_type?: string
        }
        Returns: {
          calories: number
          proteins: number
          carbs: number
          fats: number
        }[]
      }
      delete_workout_session: {
        Args: {
          session_id: string
        }
        Returns: undefined
      }
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
      get_date: {
        Args: {
          "": string
        }
        Returns: string
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
