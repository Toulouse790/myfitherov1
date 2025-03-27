
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

/**
 * Récupère tous les sports et postes pour affichage dans le dashboard
 */
export const getSportsAndPositions = async (): Promise<{
  sports: any[];
  positions: any[];
  error?: string;
}> => {
  try {
    // Récupérer tous les sports
    const { data: sports, error: sportsError } = await supabase
      .from('sports')
      .select('id, name, type, category')
      .order('name');

    if (sportsError) throw sportsError;

    // Récupérer tous les postes avec le nom du sport associé
    const { data: positions, error: positionsError } = await supabase
      .from('sport_positions')
      .select(`
        id, 
        name, 
        sport_id,
        sports:sport_id (name)
      `)
      .order('name');

    if (positionsError) throw positionsError;

    return {
      sports,
      positions
    };
  } catch (error) {
    debugLogger.error('SportValidator', "Erreur lors de la récupération des sports et positions", error);
    return {
      sports: [],
      positions: [],
      error: "Erreur lors de la récupération des données"
    };
  }
};
