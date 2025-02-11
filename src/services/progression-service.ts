
import { supabase } from "@/integrations/supabase/client";

export interface UserProgression {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  experience_points: number;
  next_level_threshold: number;
  workout_points: number;
  nutrition_points: number;
  sleep_points: number;
  streak_points: number;
  workout_multiplier: number;
  nutrition_multiplier: number;
  sleep_multiplier: number;
  level_history: any[];
  achievements_count: number;
  current_streak: Record<string, any>;
}

export class ProgressionService {
  static async getUserProgression(): Promise<UserProgression | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_progression')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user progression:', error);
      return null;
    }

    return data;
  }

  static async initializeUserProgression(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_progression')
      .insert([{ user_id: userId }]);

    if (error) {
      console.error('Error initializing user progression:', error);
      throw error;
    }
  }

  static async updateUserMultipliers(
    userId: string,
    workoutMultiplier?: number,
    nutritionMultiplier?: number,
    sleepMultiplier?: number
  ): Promise<void> {
    const updates: Record<string, number> = {};
    
    if (workoutMultiplier !== undefined) updates.workout_multiplier = workoutMultiplier;
    if (nutritionMultiplier !== undefined) updates.nutrition_multiplier = nutritionMultiplier;
    if (sleepMultiplier !== undefined) updates.sleep_multiplier = sleepMultiplier;

    const { error } = await supabase
      .from('user_progression')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating multipliers:', error);
      throw error;
    }
  }

  static calculateLevelProgress(currentPoints: number, nextThreshold: number): number {
    const currentThreshold = Math.pow(Math.floor(Math.sqrt(currentPoints / 100)), 2) * 100;
    const progress = ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  static getRequiredPointsForLevel(level: number): number {
    return Math.pow(level, 2) * 100;
  }

  static async updateAchievementsCount(userId: string, count: number): Promise<void> {
    const { error } = await supabase
      .from('user_progression')
      .update({ achievements_count: count })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating achievements count:', error);
      throw error;
    }
  }
}
