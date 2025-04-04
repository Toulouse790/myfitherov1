
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { allSportPrograms } from "@/data/sportPrograms";

export interface Sport {
  id: string;
  name: string;
}

export interface SportPosition {
  id: string;
  name: string;
  sport_id: string;
}

export interface SportProgram {
  id: string;
  name: string;
  description: string;
  sport_id: string;
  position_id: string;
  difficulty: string; // amateur, semi-pro ou pro
  duration: number;
  sessionsPerWeek: number;
  exercises: any[];
}

export const fetchSports = async (): Promise<{ data: Sport[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sports')
      .select('id, name')
      .order('name');
      
    debugLogger.log("sportProgramsApi", "Sports chargés: " + (data?.length || 0));
    
    if (!data || data.length === 0) {
      const demoSports = [
        { id: 'football', name: 'Football' },
        { id: 'basketball', name: 'Basketball' },
        { id: 'volleyball', name: 'Volleyball' },
        { id: 'tennis', name: 'Tennis' },
        { id: 'natation', name: 'Natation' },
        { id: 'running', name: 'Course à pied' }
      ];
      return { data: demoSports, error: null };
    }
    
    return { data, error };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors du chargement des sports:", error);
    return { data: null, error };
  }
};

export const fetchPositions = async (sportId: string): Promise<{ data: SportPosition[] | null; error: any }> => {
  if (!sportId) return { data: [], error: null };
  
  try {
    const { data, error } = await supabase
      .from('sport_positions')
      .select('id, name, sport_id')
      .eq('sport_id', sportId)
      .order('name');
      
    debugLogger.log("sportProgramsApi", "Positions chargées pour le sport " + sportId + ": " + (data?.length || 0));
    
    if (!data || data.length === 0) {
      let demoPositions: SportPosition[] = [];
      
      switch (sportId) {
        case 'football':
          demoPositions = [
            { id: 'gardien', name: 'Gardien', sport_id: sportId },
            { id: 'défenseur', name: 'Défenseur', sport_id: sportId },
            { id: 'milieu', name: 'Milieu', sport_id: sportId },
            { id: 'attaquant', name: 'Attaquant', sport_id: sportId }
          ];
          break;
        case 'basketball':
          demoPositions = [
            { id: 'meneur', name: 'Meneur', sport_id: sportId },
            { id: 'ailier', name: 'Ailier', sport_id: sportId },
            { id: 'pivot', name: 'Pivot', sport_id: sportId }
          ];
          break;
        case 'volleyball':
          demoPositions = [
            { id: 'passeur', name: 'Passeur', sport_id: sportId },
            { id: 'attaquant', name: 'Attaquant', sport_id: sportId },
            { id: 'libero', name: 'Libéro', sport_id: sportId }
          ];
          break;
        case 'natation':
          demoPositions = [
            { id: 'sprint', name: 'Sprint', sport_id: sportId },
            { id: 'endurance', name: 'Endurance', sport_id: sportId }
          ];
          break;
        default:
          demoPositions = [
            { id: 'general', name: 'Général', sport_id: sportId }
          ];
      }
      
      return { data: demoPositions, error: null };
    }
    
    return { data, error };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors du chargement des positions:", error);
    return { data: null, error };
  }
};

export const fetchPrograms = async (
  sportId: string, 
  positionId?: string
): Promise<{ data: SportProgram[] | null; error: any }> => {
  if (!sportId) return { data: [], error: null };
  
  try {
    let query = supabase.from('sport_programs').select('*');
    
    if (sportId) {
      query = query.eq('sport_id', sportId);
    }
    
    if (positionId) {
      query = query.eq('position_id', positionId);
    }
    
    const { data, error } = await query.order('name');
    
    debugLogger.log("sportProgramsApi", "Programmes chargés: " + (data?.length || 0));

    if (!data || data.length === 0) {
      const filteredPrograms = allSportPrograms.filter(program => {
        let matches = program.sport_id === sportId;
        if (positionId) {
          matches = matches && program.position_id === positionId;
        }
        return matches;
      });
      
      return { data: filteredPrograms, error: null };
    }

    let hasAmateur = false;
    let hasSemiPro = false;
    let hasPro = false;

    data.forEach(program => {
      if (program.difficulty === 'amateur') hasAmateur = true;
      if (program.difficulty === 'semi-pro') hasSemiPro = true;
      if (program.difficulty === 'pro') hasPro = true;
    });

    const additionalPrograms = [];
    
    if (!hasAmateur || !hasSemiPro || !hasPro) {
      const template = data[0];
      
      if (!hasAmateur) {
        additionalPrograms.push({
          ...template,
          id: `${template.id}-amateur`,
          name: `${template.name} - Amateur`,
          difficulty: 'amateur',
          description: `Version adaptée pour débutants de ${template.name}`,
          duration: 8,
          sessionsPerWeek: 2
        });
      }
      
      if (!hasSemiPro) {
        additionalPrograms.push({
          ...template,
          id: `${template.id}-semi-pro`,
          name: `${template.name} - Semi-Pro`,
          difficulty: 'semi-pro',
          description: `Version intermédiaire de ${template.name}`,
          duration: 10,
          sessionsPerWeek: 3
        });
      }
      
      if (!hasPro) {
        additionalPrograms.push({
          ...template,
          id: `${template.id}-pro`,
          name: `${template.name} - Pro`,
          difficulty: 'pro',
          description: `Version avancée de ${template.name} pour athlètes expérimentés`,
          duration: 12,
          sessionsPerWeek: 4
        });
      }
    }
    
    return { data: [...data, ...additionalPrograms], error };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors du chargement des programmes:", error);
    
    const filteredPrograms = allSportPrograms.filter(program => {
      let matches = program.sport_id === sportId;
      if (positionId) {
        matches = matches && program.position_id === positionId;
      }
      return matches;
    });
    
    return { data: filteredPrograms, error: null };
  }
};

export const fetchActivePrograms = async (): Promise<{ data: SportProgram[] | null; error: any }> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("Utilisateur non connecté");
    
    const { data: sessions, error } = await supabase
      .from('workout_sessions')
      .select('program_id')
      .eq('user_id', user.user.id)
      .not('program_id', 'is', null)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!sessions || sessions.length === 0) {
      return { data: [], error: null };
    }
    
    const programIds = [...new Set(sessions.map(s => s.program_id))];
    
    const { data: programs, error: programsError } = await supabase
      .from('sport_programs')
      .select('*')
      .in('id', programIds);
      
    if (programsError) throw programsError;
    
    return { data: programs || [], error: null };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors du chargement des programmes actifs:", error);
    return { data: null, error };
  }
};

export const createWorkoutFromProgram = async (program: SportProgram) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("Utilisateur non connecté");
    
    debugLogger.log("sportProgramsApi", "Création d'une session d'entraînement à partir du programme:", program.name);
    
    // Corriger l'appel à select() - en retirant les arguments supplémentaires
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
      
    debugLogger.log("sportProgramsApi", "Résultat de la création de session:", data ? "Succès" : "Échec", error);
    
    if (data && data.length > 0) {
      const sessionId = data[0].id;
      const userId = user.user.id;
      
      // Vérifier si l'utilisateur existe dans user_progression avant d'essayer de le mettre à jour
      const { data: existingProgression, error: checkError } = await supabase
        .from('user_progression')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (checkError) {
        if (checkError.code === 'PGRST116') {
          // Si l'utilisateur n'existe pas dans user_progression, le créer
          debugLogger.log("sportProgramsApi", "Utilisateur non trouvé dans user_progression, création d'un nouveau profil");
          
          const { error: insertError } = await supabase
            .from('user_progression')
            .insert([{
              user_id: userId,
              workout_points: 10,
              nutrition_points: 0,
              sleep_points: 0,
              total_points: 10
            }]);
          
          if (insertError) {
            debugLogger.error("sportProgramsApi", "Erreur lors de la création du profil de progression:", insertError);
          }
        } else {
          debugLogger.error("sportProgramsApi", "Erreur lors de la vérification de progression:", checkError);
        }
      } else {
        // Si l'utilisateur existe, mettre à jour les points
        const { error: progressionError } = await supabase
          .from('user_progression')
          .update({
            workout_points: existingProgression.workout_points ? existingProgression.workout_points + 10 : 10,
            total_points: existingProgression.total_points ? existingProgression.total_points + 10 : 10,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (progressionError) {
          debugLogger.error("sportProgramsApi", "Erreur lors de la mise à jour de la progression:", progressionError);
        }
      }
      
      // Vérifier et créer/mettre à jour user_preferences si nécessaire
      const { data: existingPrefs, error: prefCheckError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (prefCheckError) {
        if (prefCheckError.code === 'PGRST116') {
          // Si l'utilisateur n'existe pas dans user_preferences, le créer
          debugLogger.log("sportProgramsApi", "Utilisateur non trouvé dans user_preferences, création d'un nouveau profil de préférences");
          
          const { error: insertPrefError } = await supabase
            .from('user_preferences')
            .insert([{
              user_id: userId,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }]);
          
          if (insertPrefError) {
            debugLogger.error("sportProgramsApi", "Erreur lors de la création des préférences:", insertPrefError);
          }
        } else {
          debugLogger.error("sportProgramsApi", "Erreur lors de la vérification des préférences:", prefCheckError);
        }
      } else {
        // Si l'utilisateur existe, mettre à jour les préférences
        const { error: prefError } = await supabase
          .from('user_preferences')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (prefError) {
          debugLogger.error("sportProgramsApi", "Erreur lors de la mise à jour des préférences:", prefError);
        }
      }
      
      // Vérifier et créer/mettre à jour user_streaks si nécessaire
      const { data: existingStreak, error: streakCheckError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('streak_type', 'workout')
        .single();
        
      if (streakCheckError) {
        if (streakCheckError.code === 'PGRST116') {
          // Si l'utilisateur n'a pas de streak, en créer un
          debugLogger.log("sportProgramsApi", "Streak non trouvé pour l'utilisateur, création d'un nouveau streak");
          
          const { error: insertStreakError } = await supabase
            .from('user_streaks')
            .insert([{
              user_id: userId,
              streak_type: 'workout',
              last_activity_date: new Date().toISOString().split('T')[0],
              current_streak: 1,
              longest_streak: 1
            }]);
          
          if (insertStreakError) {
            debugLogger.error("sportProgramsApi", "Erreur lors de la création du streak:", insertStreakError);
          }
        } else {
          debugLogger.error("sportProgramsApi", "Erreur lors de la vérification du streak:", streakCheckError);
        }
      } else {
        // Si le streak existe, le mettre à jour
        const { error: streakError } = await supabase
          .from('user_streaks')
          .update({
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', userId)
          .eq('streak_type', 'workout');
          
        if (streakError) {
          debugLogger.error("sportProgramsApi", "Erreur lors de la mise à jour du streak:", streakError);
        }
      }
      
      // Créer les statistiques d'entraînement
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert([{
          user_id: userId,
          session_id: sessionId,
          session_duration_minutes: program.duration,
          calories_burned: Math.round(program.duration * 10),
          muscle_groups_worked: ['jambes', 'bras', 'core'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (statsError) {
        debugLogger.error("sportProgramsApi", "Erreur lors de la création des statistiques d'entraînement:", statsError);
      }

      // Vérification des tables après création de session
      debugLogger.log("sportProgramsApi", "Vérification des tables après création de session pour l'utilisateur:", userId);
      
      const { data: progressionData } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', userId);
      debugLogger.log("sportProgramsApi", "État de user_progression:", progressionData);
      
      const { data: streaksData } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId);
      debugLogger.log("sportProgramsApi", "État de user_streaks:", streaksData);
      
      const { data: preferencesData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);
      debugLogger.log("sportProgramsApi", "État de user_preferences:", preferencesData);
      
      const { data: statsData } = await supabase
        .from('training_stats')
        .select('*')
        .eq('session_id', sessionId);
      debugLogger.log("sportProgramsApi", "État de training_stats pour la session:", statsData);
    }
    
    return { data: data && data.length > 0 ? data[0] : null, error };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors de la création de la session:", error);
    return { data: null, error };
  }
};
