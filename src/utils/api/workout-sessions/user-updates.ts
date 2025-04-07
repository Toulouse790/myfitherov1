
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { updateUserProfile } from "./profile-updates";
import { updateUserProgression } from "./progression-updates";
import { updateUserPreferences } from "./preferences-updates";
import { updateUserStreaks } from "./streak-updates";
import { createTrainingStats } from "./training-stats";

export async function updateUserData(userId: string, sessionId: string) {
  debugLogger.log("workoutSessions", "Début de la mise à jour des données utilisateur pour UserId: " + userId + ", SessionId: " + sessionId);
  
  try {
    // Création structurée et séquentielle des données utilisateur
    // Assurons-nous d'abord que le profil existe
    const profileResult = await updateUserProfile(userId);
    debugLogger.log("workoutSessions", "Résultat création/mise à jour profil: " + (profileResult.success ? "Succès" : "Échec"));
    
    if (!profileResult.success) {
      debugLogger.error("workoutSessions", "Impossible de créer/mettre à jour le profil - arrêt de la propagation");
      return;
    }
    
    // Maintenant, mettons à jour les autres tables dans un ordre précis
    const progressionResult = await updateUserProgression(userId);
    debugLogger.log("workoutSessions", "Résultat mise à jour progression: " + (progressionResult.success ? "Succès" : "Échec"));
    
    const preferencesResult = await updateUserPreferences(userId);
    debugLogger.log("workoutSessions", "Résultat mise à jour préférences: " + (preferencesResult.success ? "Succès" : "Échec"));
    
    const streaksResult = await updateUserStreaks(userId);
    debugLogger.log("workoutSessions", "Résultat mise à jour streaks: " + (streaksResult.success ? "Succès" : "Échec"));
    
    const statsResult = await createTrainingStats(userId, sessionId);
    debugLogger.log("workoutSessions", "Résultat création stats: " + (statsResult.success ? "Succès" : "Échec"));
    
  } catch (error) {
    debugLogger.error("workoutSessions", "Erreur lors de la mise à jour des données utilisateur: " + JSON.stringify(error));
  }
}
