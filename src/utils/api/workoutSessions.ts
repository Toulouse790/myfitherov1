import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { SportProgram } from "./programs";

export const createWorkoutFromProgram = async (program: SportProgram) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("Utilisateur non connecté");
    
    debugLogger.log("workoutSessions", "Création d'une session d'entraînement à partir du programme: " + program.name);
    
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert([
        { 
          user_id: user.user.id,
          exercises: program.exercises.map(ex => typeof ex === 'string' ? ex : ex.name || ex),
          status: 'in_progress',
          workout_type: 'sport_specific',
          total_duration_minutes: program.duration * 60 || 45,
          metadata: {
            program_name: program.name,
            program_difficulty: program.difficulty,
            sport_id: program.sport_id,
            position_id: program.position_id
          }
        }
      ])
      .select();
      
    debugLogger.log("workoutSessions", "Résultat de la création de session: " + (data ? "Succès" : "Échec") + (error ? (" - " + JSON.stringify(error)) : ""));
    
    if (data && data.length > 0) {
      await updateUserData(user.user.id, data[0].id);
      
      // Vérifions explicitement que tout a été créé correctement
      await verifyUserTables(user.user.id, data[0].id);
    }
    
    return { data: data && data.length > 0 ? data[0] : null, error };
  } catch (error) {
    debugLogger.error("workoutSessions", "Erreur lors de la création de la session: " + JSON.stringify(error));
    return { data: null, error };
  }
};

async function updateUserData(userId: string, sessionId: string) {
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

async function updateUserProfile(userId: string): Promise<{success: boolean, error?: any, data?: any}> {
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

async function updateUserProgression(userId: string): Promise<{success: boolean, error?: any}> {
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

async function updateUserPreferences(userId: string): Promise<{success: boolean, error?: any}> {
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

async function updateUserStreaks(userId: string): Promise<{success: boolean, error?: any}> {
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

async function createTrainingStats(userId: string, sessionId: string): Promise<{success: boolean, error?: any}> {
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

async function verifyUserTables(userId: string, sessionId: string) {
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
        debugLogger.log("workoutSessions", `Table ${table.name} - OK - ${JSON.stringify(data)}`);
      }
    } catch (error) {
      debugLogger.error("workoutSessions", `Exception lors de la vérification de ${table.name}: ${JSON.stringify(error)}`);
    }
  }
}
