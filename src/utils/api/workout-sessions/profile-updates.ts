
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { UpdateResult } from "./types";

export async function updateUserProfile(userId: string): Promise<UpdateResult> {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      debugLogger.error("workoutSessions", "Erreur lors de la récupération du profil: " + JSON.stringify(profileError));
      
      // Si le profil n'existe pas, on le crée
      if (profileError.code === 'PGRST116') {
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              username: userData.user.email?.split('@')[0] || `user_${Date.now()}`,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }])
            .select();
          
          if (insertError) {
            debugLogger.error("workoutSessions", "Erreur lors de la création du profil: " + JSON.stringify(insertError));
            return { success: false, error: insertError };
          } else {
            debugLogger.log("workoutSessions", "Profil créé avec succès pour userId: " + userId);
            return { success: true, data: insertedProfile };
          }
        }
        return { success: false, error: "Utilisateur non trouvé" };
      }
      return { success: false, error: profileError };
    } else {
      debugLogger.log("workoutSessions", "Profil trouvé: " + JSON.stringify(profileData));
      return { success: true, data: profileData };
    }
  } catch (error) {
    debugLogger.error("workoutSessions", "Exception lors de la mise à jour du profil: " + JSON.stringify(error));
    return { success: false, error };
  }
}
