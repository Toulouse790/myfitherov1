
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { UpdateResult } from "./types";

export async function updateUserPreferences(userId: string): Promise<UpdateResult> {
  try {
    const { data: existingPrefs, error: prefCheckError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId);
      
    debugLogger.log("workoutSessions", "Vérification préférences utilisateur: " + JSON.stringify({ data: existingPrefs, error: prefCheckError }));
      
    if (prefCheckError) {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification des préférences: " + JSON.stringify(prefCheckError));
      return { success: false, error: prefCheckError };
    }
      
    if (!existingPrefs || existingPrefs.length === 0) {
      debugLogger.log("workoutSessions", "Utilisateur non trouvé dans user_preferences, création d'un nouveau profil de préférences");
      
      const { data, error: insertPrefError } = await supabase
        .from('user_preferences')
        .insert([{
          user_id: userId,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (insertPrefError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création des préférences: " + JSON.stringify(insertPrefError));
        return { success: false, error: insertPrefError };
      } else {
        debugLogger.log("workoutSessions", "Préférences créées avec succès: " + JSON.stringify(data));
        return { success: true };
      }
    } else {
      const { data, error: prefError } = await supabase
        .from('user_preferences')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
        
      if (prefError) {
        debugLogger.error("workoutSessions", "Erreur lors de la mise à jour des préférences: " + JSON.stringify(prefError));
        return { success: false, error: prefError };
      } else {
        debugLogger.log("workoutSessions", "Préférences mises à jour avec succès: " + JSON.stringify(data));
        return { success: true };
      }
    }
  } catch (error) {
    debugLogger.error("workoutSessions", "Exception dans updateUserPreferences: " + JSON.stringify(error));
    return { success: false, error };
  }
}
