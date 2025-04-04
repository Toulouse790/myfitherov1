
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

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
  exercises: any[];
}

export const fetchSports = async (): Promise<{ data: Sport[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('sports')
      .select('id, name')
      .order('name');
      
    debugLogger.log("sportProgramsApi", "Sports chargés: " + (data?.length || 0));
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

    // Si des données sont retournées mais avec tous les mêmes niveaux, ajoutons des exemples pour tous les niveaux
    if (data && data.length > 0) {
      let hasAmateur = false;
      let hasSemiPro = false;
      let hasPro = false;

      // Vérifier les niveaux existants
      data.forEach(program => {
        if (program.difficulty === 'amateur') hasAmateur = true;
        if (program.difficulty === 'semi-pro') hasSemiPro = true;
        if (program.difficulty === 'pro') hasPro = true;
      });

      // Si tous les programmes sont du même niveau, créons des exemples pour les autres niveaux
      const samplePrograms = [];
      
      if (!hasAmateur) {
        samplePrograms.push({
          ...data[0],
          id: `${data[0].id}-amateur`,
          name: `${data[0].name} - Amateur`,
          difficulty: 'amateur',
          description: `Version adaptée pour débutants de ${data[0].name}`
        });
      }
      
      if (!hasSemiPro) {
        samplePrograms.push({
          ...data[0],
          id: `${data[0].id}-semi-pro`,
          name: `${data[0].name} - Semi-Pro`,
          difficulty: 'semi-pro',
          description: `Version intermédiaire de ${data[0].name}`
        });
      }
      
      if (!hasPro) {
        samplePrograms.push({
          ...data[0],
          id: `${data[0].id}-pro`,
          name: `${data[0].name} - Pro`,
          difficulty: 'pro',
          description: `Version avancée de ${data[0].name} pour athlètes expérimentés`
        });
      }

      return { data: [...data, ...samplePrograms], error };
    }
    
    return { data, error };
  } catch (error) {
    debugLogger.error("sportProgramsApi", "Erreur lors du chargement des programmes:", error);
    return { data: null, error };
  }
};

export const createWorkoutFromProgram = async (program: SportProgram) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("Utilisateur non connecté");
    
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert([
        {
          user_id: user.user.id,
          exercises: program.exercises.map(ex => ex.name || ex),
          status: 'in_progress',
          workout_type: 'sport_specific',
          total_duration_minutes: program.duration || 45
        }
      ])
      .select()
      .single();
      
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
