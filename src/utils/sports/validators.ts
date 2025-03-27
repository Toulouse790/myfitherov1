
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

/**
 * Vérifie que tous les postes sont associés à des sports valides
 * et retourne un rapport de validation
 */
export const validateSportPositions = async (): Promise<{
  valid: boolean;
  invalidPositions: any[];
  message: string;
  sportsMappings?: {[key: string]: string};
  sportsData?: any[];
}> => {
  try {
    // 1. Récupérer tous les sports
    const { data: sports, error: sportsError } = await supabase
      .from('sports')
      .select('id, name, type, category');

    if (sportsError) {
      throw sportsError;
    }

    debugLogger.log('SportValidator', `${sports.length} sports trouvés dans la base de données`);
    debugLogger.log('SportValidator', 'Liste des sports:', sports.map(s => `${s.id}: ${s.name} (${s.type})`));

    // 2. Récupérer tous les postes
    const { data: positions, error: positionsError } = await supabase
      .from('sport_positions')
      .select('id, name, sport_id');

    if (positionsError) {
      throw positionsError;
    }

    debugLogger.log('SportValidator', `${positions.length} postes trouvés dans la base de données`);

    // Créer un mapping des IDs de sports vers leurs noms pour faciliter le diagnostic
    const sportsMappings = sports.reduce((acc, sport) => {
      acc[sport.id] = sport.name;
      return acc;
    }, {});

    // 3. Vérifier les associations
    const validSportIds = sports.map(sport => sport.id);
    const invalidPositions = positions.filter(position => 
      !position.sport_id || !validSportIds.includes(position.sport_id)
    );

    if (invalidPositions.length > 0) {
      debugLogger.log('SportValidator', 'Positions avec problèmes:', invalidPositions);
    }

    const valid = invalidPositions.length === 0;
    const message = valid 
      ? "Tous les postes sont correctement associés à des sports valides" 
      : `${invalidPositions.length} postes ont des associations de sport invalides`;

    debugLogger.log('SportValidator', message, {
      totalSports: sports.length,
      totalPositions: positions.length,
      invalidCount: invalidPositions.length,
      sportsList: sports.map(s => `${s.id}: ${s.name}`).join(', ')
    });

    return {
      valid,
      invalidPositions,
      message,
      sportsMappings,
      sportsData: sports // Transmettre la liste complète des sports pour plus de contexte
    };
  } catch (error) {
    debugLogger.error('SportValidator', "Erreur lors de la validation sport-positions", error);
    return {
      valid: false,
      invalidPositions: [],
      message: "Erreur lors de la validation des associations sport-position"
    };
  }
};
