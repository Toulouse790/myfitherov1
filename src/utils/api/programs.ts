
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { allSportPrograms } from "@/data/sportPrograms";

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
    
    debugLogger.log("programs", "Programmes chargés: " + (data?.length || 0));

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
    debugLogger.error("programs", "Erreur lors du chargement des programmes:", error);
    
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
    debugLogger.error("programs", "Erreur lors du chargement des programmes actifs:", error);
    return { data: null, error };
  }
};
