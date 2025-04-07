
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { UpdateResult } from "./types";

export async function updateUserProgression(userId: string): Promise<UpdateResult> {
  try {
    const { data: existingProgression, error: checkError } = await supabase
      .from('user_progression')
      .select('*')
      .eq('user_id', userId);
      
    debugLogger.log("workoutSessions", "Vérification progression utilisateur: " + JSON.stringify({ data: existingProgression, error: checkError }));
      
    if (checkError) {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification de la progression: " + JSON.stringify(checkError));
      return { success: false, error: checkError };
    }
      
    if (!existingProgression || existingProgression.length === 0) {
      debugLogger.log("workoutSessions", "Utilisateur non trouvé dans user_progression, création d'un nouveau profil");
      
      const { data, error: insertError } = await supabase
        .from('user_progression')
        .insert([{
          user_id: userId,
          workout_points: 10,
          nutrition_points: 0,
          sleep_points: 0,
          total_points: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (insertError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création du profil de progression: " + JSON.stringify(insertError));
        return { success: false, error: insertError };
      } else {
        debugLogger.log("workoutSessions", "Profil de progression créé avec succès: " + JSON.stringify(data));
        return { success: true };
      }
    } else {
      const existingData = existingProgression[0];
      const workoutPoints = (existingData.workout_points || 0) + 10;
      const totalPoints = (existingData.total_points || 0) + 10;
      
      const { data, error: progressionError } = await supabase
        .from('user_progression')
        .update({
          workout_points: workoutPoints,
          total_points: totalPoints,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
      
      if (progressionError) {
        debugLogger.error("workoutSessions", "Erreur lors de la mise à jour de la progression: " + JSON.stringify(progressionError));
        return { success: false, error: progressionError };
      } else {
        debugLogger.log("workoutSessions", "Progression mise à jour avec succès: " + JSON.stringify(data));
        return { success: true };
      }
    }
  } catch (error) {
    debugLogger.error("workoutSessions", "Exception dans updateUserProgression: " + JSON.stringify(error));
    return { success: false, error };
  }
}
