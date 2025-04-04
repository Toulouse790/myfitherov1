
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { SportProgram } from "./programs";

export const createWorkoutFromProgram = async (program: SportProgram) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("Utilisateur non connecté");
    
    debugLogger.log("workoutSessions", "Création d'une session d'entraînement à partir du programme:", program.name);
    
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
      .select(); // Correction ici: suppression des arguments superflus
      
    debugLogger.log("workoutSessions", "Résultat de la création de session:", data ? "Succès" : "Échec", error);
    
    if (data && data.length > 0) {
      await updateUserData(user.user.id, data[0].id);
    }
    
    return { data: data && data.length > 0 ? data[0] : null, error };
  } catch (error) {
    debugLogger.error("workoutSessions", "Erreur lors de la création de la session:", error);
    return { data: null, error };
  }
};

async function updateUserData(userId: string, sessionId: string) {
  await updateUserProfile(userId);
  await updateUserProgression(userId);
  await updateUserPreferences(userId);
  await updateUserStreaks(userId);
  await createTrainingStats(userId, sessionId);
  
  // Vérification des tables après création de session
  await verifyUserTables(userId, sessionId);
}

async function updateUserProfile(userId: string) {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    debugLogger.error("workoutSessions", "Erreur lors de la récupération du profil:", profileError);
  } else {
    debugLogger.log("workoutSessions", "Profil trouvé:", profileData);
  }
}

async function updateUserProgression(userId: string) {
  const { data: existingProgression, error: checkError } = await supabase
    .from('user_progression')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (checkError) {
    if (checkError.code === 'PGRST116') {
      debugLogger.log("workoutSessions", "Utilisateur non trouvé dans user_progression, création d'un nouveau profil");
      
      const { error: insertError } = await supabase
        .from('user_progression')
        .insert([{
          user_id: userId,
          workout_points: 10,
          nutrition_points: 0,
          sleep_points: 0,
          total_points: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (insertError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création du profil de progression:", insertError);
      }
    } else {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification de progression:", checkError);
    }
  } else if (existingProgression) {
    const workoutPoints = (existingProgression.workout_points || 0) + 10;
    const totalPoints = (existingProgression.total_points || 0) + 10;
    
    const { error: progressionError } = await supabase
      .from('user_progression')
      .update({
        workout_points: workoutPoints,
        total_points: totalPoints,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (progressionError) {
      debugLogger.error("workoutSessions", "Erreur lors de la mise à jour de la progression:", progressionError);
    }
  }
}

async function updateUserPreferences(userId: string) {
  const { data: existingPrefs, error: prefCheckError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (prefCheckError) {
    if (prefCheckError.code === 'PGRST116') {
      debugLogger.log("workoutSessions", "Utilisateur non trouvé dans user_preferences, création d'un nouveau profil de préférences");
      
      const { error: insertPrefError } = await supabase
        .from('user_preferences')
        .insert([{
          user_id: userId,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }]);
      
      if (insertPrefError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création des préférences:", insertPrefError);
      }
    } else {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification des préférences:", prefCheckError);
    }
  } else {
    const { error: prefError } = await supabase
      .from('user_preferences')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    if (prefError) {
      debugLogger.error("workoutSessions", "Erreur lors de la mise à jour des préférences:", prefError);
    }
  }
}

async function updateUserStreaks(userId: string) {
  const { data: existingStreak, error: streakCheckError } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('streak_type', 'workout')
    .single();
    
  if (streakCheckError) {
    if (streakCheckError.code === 'PGRST116') {
      debugLogger.log("workoutSessions", "Streak non trouvé pour l'utilisateur, création d'un nouveau streak");
      
      const { error: insertStreakError } = await supabase
        .from('user_streaks')
        .insert([{
          user_id: userId,
          streak_type: 'workout',
          last_activity_date: new Date().toISOString().split('T')[0],
          current_streak: 1,
          longest_streak: 1,
          created_at: new Date().toISOString()
        }]);
      
      if (insertStreakError) {
        debugLogger.error("workoutSessions", "Erreur lors de la création du streak:", insertStreakError);
      }
    } else {
      debugLogger.error("workoutSessions", "Erreur lors de la vérification du streak:", streakCheckError);
    }
  } else {
    const { error: streakError } = await supabase
      .from('user_streaks')
      .update({
        last_activity_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('streak_type', 'workout');
      
    if (streakError) {
      debugLogger.error("workoutSessions", "Erreur lors de la mise à jour du streak:", streakError);
    }
  }
}

async function createTrainingStats(userId: string, sessionId: string) {
  const { error: statsError } = await supabase
    .from('training_stats')
    .insert([{
      user_id: userId,
      session_id: sessionId,
      session_duration_minutes: 45, // Valeur par défaut
      calories_burned: 450, // Estimation moyenne
      muscle_groups_worked: ['jambes', 'bras', 'core'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
    
  if (statsError) {
    debugLogger.error("workoutSessions", "Erreur lors de la création des statistiques d'entraînement:", statsError);
  }
}

async function verifyUserTables(userId: string, sessionId: string) {
  debugLogger.log("workoutSessions", "Vérification des tables après création de session pour l'utilisateur:", userId);
  
  const { data: progressionData } = await supabase
    .from('user_progression')
    .select('*')
    .eq('user_id', userId);
  debugLogger.log("workoutSessions", "État de user_progression:", progressionData);
  
  const { data: streaksData } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId);
  debugLogger.log("workoutSessions", "État de user_streaks:", streaksData);
  
  const { data: preferencesData } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId);
  debugLogger.log("workoutSessions", "État de user_preferences:", preferencesData);
  
  const { data: statsData } = await supabase
    .from('training_stats')
    .select('*')
    .eq('session_id', sessionId);
  debugLogger.log("workoutSessions", "État de training_stats pour la session:", statsData);
}
