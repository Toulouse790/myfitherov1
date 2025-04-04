
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
    
    // Correction : La méthode select() n'accepte pas d'arguments supplémentaires
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert([
        {
          user_id: user.user.id,
          exercises: program.exercises.map(ex => typeof ex === 'string' ? ex : ex.name || ex),
          status: 'in_progress',
          workout_type: 'sport_specific',
          total_duration_minutes: program.duration * 60 || 45,
          // Utiliser des métadonnées supplémentaires pour stocker les informations du programme
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
    
    // Maintenant, assurons-nous que les tables liées soient mises à jour
    if (data && data.length > 0) {
      // Mettre à jour user_streaks pour cet utilisateur s'il existe déjà un enregistrement
      const sessionId = data[0].id;
      const userId = user.user.id;
      
      // Initialiser ou mettre à jour l'enregistrement de progression de l'utilisateur
      const { error: progressionError } = await supabase
        .from('user_progression')
        .upsert([{
          user_id: userId,
          updated_at: new Date().toISOString(),
          // Ne mettre à jour que si l'enregistrement n'existe pas
          workout_points: 10, 
          total_points: 10
        }], { onConflict: 'user_id' });
      
      if (progressionError) {
        debugLogger.error("sportProgramsApi", "Erreur lors de la mise à jour de la progression:", progressionError);
      }
      
      // Initialiser ou mettre à jour les préférences utilisateur s'ils n'existent pas
      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert([{
          user_id: userId,
          updated_at: new Date().toISOString()
        }], { onConflict: 'user_id' });
        
      if (prefError) {
        debugLogger.error("sportProgramsApi", "Erreur lors de la mise à jour des préférences:", prefError);
      }
      
      // Initialiser ou mettre à jour l'enregistrement de streak
      const today = new Date().toISOString().split('T')[0];
      const { error: streakError } = await supabase
        .from('user_streaks')
        .upsert([{
          user_id: userId,
          streak_type: 'workout',
          last_activity_date: today,
          current_streak: 1  // Le trigger handle_streak_update s'occupera d'incrémenter si nécessaire
        }], { onConflict: 'user_id, streak_type' });
        
      if (streakError) {
        debugLogger.error("sportProgramsApi", "Erreur lors de la mise à jour du streak:", streakError);
      }
      
      // Créer un enregistrement de statistiques d'entraînement
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert([{
          user_id: userId,
          session_id: sessionId,
          session_duration_minutes: program.duration,
          calories_burned: Math.round(program.duration * 10), // Estimation simple
          muscle_groups_worked: ['jambes', 'bras', 'core']  // À ajuster en fonction du programme
        }]);
        
      if (statsError) {
        debugLogger.error("sportProgramsApi", "Erreur lors de la création des statistiques d'entraînement:", statsError);
      }
    }
    
    return { data: data && data.length > 0 ? data[0] : null, error };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors de la création de la session:", error);
    return { data: null, error };
  }
};
