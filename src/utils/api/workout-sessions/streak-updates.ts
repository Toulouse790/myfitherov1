
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { UpdateResult } from "./types";

export async function updateUserStreaks(userId: string): Promise<UpdateResult> {
  try {
    const { data: existingStreak, error: streakCheckError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_type', 'workout');
      
    debugLogger.log("workoutSessions", "Vérification streaks utilisateur: " + JSON.stringify({ data: existingStreak, error: streakCheckError }));
      
    if (streakCheckError) {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification des streaks: " + JSON.stringify(streakCheckError));
      return { success: false, error: streakCheckError };
    }
      
    if (!existingStreak || existingStreak.length === 0) {
      debugLogger.log("workoutSessions", "Streak non trouvé pour l'utilisateur, création d'un nouveau streak");
      
      const { data, error: insertStreakError } = await supabase
        .from('user_streaks')
        .insert([{
          user_id: userId,
          streak_type: 'workout',
          last_activity_date: new Date().toISOString().split('T')[0],
          current_streak: 1,
          longest_streak: 1,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (insertStreakError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création du streak: " + JSON.stringify(insertStreakError));
        return { success: false, error: insertStreakError };
      } else {
        debugLogger.log("workoutSessions", "Streak créé avec succès: " + JSON.stringify(data));
        return { success: true };
      }
    } else {
      const { data, error: streakError } = await supabase
        .from('user_streaks')
        .update({
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', userId)
        .eq('streak_type', 'workout')
        .select();
        
      if (streakError) {
        debugLogger.error("workoutSessions", "Erreur lors de la mise à jour du streak: " + JSON.stringify(streakError));
        return { success: false, error: streakError };
      } else {
        debugLogger.log("workoutSessions", "Streak mis à jour avec succès: " + JSON.stringify(data));
        return { success: true };
      }
    }
  } catch (error) {
    debugLogger.error("workoutSessions", "Exception dans updateUserStreaks: " + JSON.stringify(error));
    return { success: false, error };
  }
}
