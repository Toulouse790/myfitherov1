
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { SportProgram } from "../programs";
import { updateUserData } from "./user-updates";
import { verifyUserTables } from "./verification";
import { WorkoutCreateResult } from "./types";

export const createWorkoutFromProgram = async (program: SportProgram): Promise<WorkoutCreateResult> => {
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
