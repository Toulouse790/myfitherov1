
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

/**
 * Vérifie et initialise l'intégrité des données utilisateur
 * Cette fonction s'assure que toutes les tables nécessaires pour l'utilisateur existent
 * et sont correctement initialisées
 */
export async function verifyUserDataIntegrity(userId: string): Promise<boolean> {
  if (!userId) {
    debugLogger.error("UserDataIntegrity", "Impossible de vérifier l'intégrité des données: userId manquant");
    return false;
  }

  debugLogger.log("UserDataIntegrity", `Vérification de l'intégrité des données pour l'utilisateur: ${userId}`);
  
  try {
    // Vérification du profil utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      if (profileError.code === 'PGRST116') { // Code Postgrest pour "No rows found"
        debugLogger.warn("UserDataIntegrity", "Profil utilisateur non trouvé, création...");
        await initializeUserProfile(userId);
      } else {
        debugLogger.error("UserDataIntegrity", `Erreur lors de la vérification du profil: ${profileError.message}`);
        return false;
      }
    }
    
    // Vérification des préférences utilisateur
    const { data: preferencesData, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (preferencesError || !preferencesData) {
      if (preferencesError?.code === 'PGRST116' || !preferencesData) {
        debugLogger.warn("UserDataIntegrity", "Préférences utilisateur non trouvées, création...");
        await initializeUserPreferences(userId);
      } else {
        debugLogger.error("UserDataIntegrity", `Erreur lors de la vérification des préférences: ${preferencesError.message}`);
      }
    }
    
    // Vérification de la progression utilisateur
    const { data: progressionData, error: progressionError } = await supabase
      .from('user_progression')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (progressionError || !progressionData) {
      if (progressionError?.code === 'PGRST116' || !progressionData) {
        debugLogger.warn("UserDataIntegrity", "Progression utilisateur non trouvée, création...");
        await initializeUserProgression(userId);
      } else {
        debugLogger.error("UserDataIntegrity", `Erreur lors de la vérification de la progression: ${progressionError.message}`);
      }
    }
    
    // Vérification des streaks utilisateur
    const { data: streaksData, error: streaksError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (streaksError || !streaksData) {
      if (streaksError?.code === 'PGRST116' || !streaksData) {
        debugLogger.warn("UserDataIntegrity", "Streaks utilisateur non trouvés, création...");
        await initializeUserStreaks(userId);
      } else {
        debugLogger.error("UserDataIntegrity", `Erreur lors de la vérification des streaks: ${streaksError.message}`);
      }
    }
    
    debugLogger.log("UserDataIntegrity", "Vérification de l'intégrité des données terminée avec succès");
    return true;
    
  } catch (error) {
    debugLogger.error("UserDataIntegrity", `Erreur lors de la vérification de l'intégrité des données: ${error}`);
    return false;
  }
}

/**
 * Initialise le profil utilisateur
 */
async function initializeUserProfile(userId: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData && userData.user) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          username: userData.user.email?.split('@')[0] || `user_${Date.now()}`,
          email: userData.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          level: 1,
          points: 0
        }])
        .select();
        
      if (error) {
        debugLogger.error("UserDataIntegrity", `Erreur lors de la création du profil: ${error.message}`);
        return false;
      }
      
      debugLogger.log("UserDataIntegrity", "Profil utilisateur créé avec succès");
      return true;
    }
    
    debugLogger.error("UserDataIntegrity", "Impossible de récupérer les informations utilisateur");
    return false;
  } catch (error) {
    debugLogger.error("UserDataIntegrity", `Erreur lors de l'initialisation du profil: ${error}`);
    return false;
  }
}

/**
 * Initialise les préférences utilisateur
 */
async function initializeUserPreferences(userId: string): Promise<boolean> {
  try {
    // Récupérer la langue stockée dans localStorage 
    let defaultLanguage = 'fr';
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('userLanguage');
      if (storedLanguage && ['fr', 'en', 'es', 'de'].includes(storedLanguage)) {
        defaultLanguage = storedLanguage;
      }
    }

    // Récupérer le thème stocké dans localStorage
    let defaultTheme = 'system';
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        defaultTheme = storedTheme;
      }
    }
    
    const { error } = await supabase
      .from('user_preferences')
      .insert([{
        user_id: userId,
        notifications_enabled: true,
        measurement_unit: 'metric',
        theme: defaultTheme,
        language: defaultLanguage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
      
    if (error) {
      debugLogger.error("UserDataIntegrity", `Erreur lors de la création des préférences: ${error.message}`);
      return false;
    }
    
    debugLogger.log("UserDataIntegrity", "Préférences utilisateur créées avec succès");
    return true;
  } catch (error) {
    debugLogger.error("UserDataIntegrity", `Erreur lors de l'initialisation des préférences: ${error}`);
    return false;
  }
}

/**
 * Initialise la progression utilisateur
 */
async function initializeUserProgression(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_progression')
      .insert([{
        user_id: userId,
        total_points: 10,
        current_level: 1,
        workout_points: 0,
        nutrition_points: 0,
        sleep_points: 0,
        next_level_threshold: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
      
    if (error) {
      debugLogger.error("UserDataIntegrity", `Erreur lors de la création de la progression: ${error.message}`);
      return false;
    }
    
    debugLogger.log("UserDataIntegrity", "Progression utilisateur créée avec succès");
    return true;
  } catch (error) {
    debugLogger.error("UserDataIntegrity", `Erreur lors de l'initialisation de la progression: ${error}`);
    return false;
  }
}

/**
 * Initialise les streaks utilisateur
 */
async function initializeUserStreaks(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_streaks')
      .insert([{
        user_id: userId,
        streak_type: 'workout',
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString()
      }]);
      
    if (error) {
      debugLogger.error("UserDataIntegrity", `Erreur lors de la création des streaks: ${error.message}`);
      return false;
    }
    
    debugLogger.log("UserDataIntegrity", "Streaks utilisateur créés avec succès");
    return true;
  } catch (error) {
    debugLogger.error("UserDataIntegrity", `Erreur lors de l'initialisation des streaks: ${error}`);
    return false;
  }
}
