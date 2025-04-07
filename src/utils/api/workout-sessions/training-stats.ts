
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { UpdateResult } from "./types";

export async function createTrainingStats(userId: string, sessionId: string): Promise<UpdateResult> {
  debugLogger.log("workoutSessions", "Début de création des statistiques d'entraînement pour UserId: " + userId + ", SessionId: " + sessionId);
  
  try {
    // Vérification si des stats existent déjà pour cette session
    const { data: existingStats, error: checkError } = await supabase
      .from('training_stats')
      .select('*')
      .eq('session_id', sessionId);
      
    debugLogger.log("workoutSessions", "Vérification stats existantes: " + JSON.stringify({ existingStats, error: checkError }));
    
    if (checkError) {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification des stats existantes: " + JSON.stringify(checkError));
      return { success: false, error: checkError };
    }
    
    // Si pas de stats, on en crée
    if (!existingStats || existingStats.length === 0) {
      const { data: createdStats, error: statsError } = await supabase
        .from('training_stats')
        .insert([{
          user_id: userId,
          session_id: sessionId,
          session_duration_minutes: 45, // Valeur par défaut
          calories_burned: 450, // Estimation moyenne
          muscle_groups_worked: ['jambes', 'bras', 'core'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
        
      if (statsError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création des statistiques d'entraînement: " + JSON.stringify(statsError));
        return { success: false, error: statsError };
      } else {
        debugLogger.log("workoutSessions", "Statistiques d'entraînement créées avec succès: " + JSON.stringify(createdStats));
        return { success: true };
      }
    } else {
      debugLogger.log("workoutSessions", "Les statistiques d'entraînement existent déjà pour cette session");
      return { success: true };
    }
  } catch (error) {
    debugLogger.error("workoutSessions", "Exception lors de la création des statistiques d'entraînement: " + JSON.stringify(error));
    return { success: false, error };
  }
}
