
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

export interface SportPosition {
  id: string;
  name: string;
  sport_id: string;
}

export const fetchPositions = async (sportId: string): Promise<{ data: SportPosition[] | null; error: any }> => {
  if (!sportId) return { data: [], error: null };
  
  try {
    const { data, error } = await supabase
      .from('sport_positions')
      .select('id, name, sport_id')
      .eq('sport_id', sportId)
      .order('name');
      
    debugLogger.log("positions", "Positions chargées pour le sport " + sportId + ": " + (data?.length || 0));
    
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
    debugLogger.error("positions", "Erreur lors du chargement des positions:", error);
    return { data: null, error };
  }
};
