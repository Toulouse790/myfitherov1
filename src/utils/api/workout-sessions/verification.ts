
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { updateUserProfile } from "./profile-updates";

export async function verifyUserTables(userId: string, sessionId: string) {
  debugLogger.log("workoutSessions", "Vérification complète des tables après création de session pour l'utilisateur: " + userId);
  
  const tables = [
    { name: 'profiles', query: supabase.from('profiles').select('*').eq('id', userId) },
    { name: 'user_progression', query: supabase.from('user_progression').select('*').eq('user_id', userId) },
    { name: 'user_streaks', query: supabase.from('user_streaks').select('*').eq('user_id', userId) },
    { name: 'user_preferences', query: supabase.from('user_preferences').select('*').eq('user_id', userId) },
    { name: 'training_stats', query: supabase.from('training_stats').select('*').eq('session_id', sessionId) }
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await table.query;
      if (error) {
        debugLogger.error("workoutSessions", `Erreur lors de la vérification de ${table.name}: ${JSON.stringify(error)}`);
      } else if (!data || data.length === 0) {
        debugLogger.error("workoutSessions", `Table ${table.name} - AUCUNE DONNÉE TROUVÉE!`);
        
        // Si c'est la table profiles qui est vide, recréons-la immédiatement
        if (table.name === 'profiles') {
          debugLogger.log("workoutSessions", "Tentative de recréation du profil...");
          await updateUserProfile(userId);
        }
      } else {
        debugLogger.log("workoutSessions", `Table ${table.name} - OK - ${data.length} entrées trouvées`);
      }
    } catch (error) {
      debugLogger.error("workoutSessions", `Exception lors de la vérification de ${table.name}: ${JSON.stringify(error)}`);
    }
  }
}
