
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

/**
 * Corrige automatiquement les postes avec des associations de sport invalides
 * en leur affectant un sport par défaut
 */
export const fixInvalidSportPositions = async (defaultSportId?: string): Promise<{
  success: boolean;
  fixedCount: number;
  message: string;
}> => {
  try {
    // D'abord on vérifie s'il y a des problèmes
    const validation = await validateSportPositions();
    
    if (validation.valid) {
      return {
        success: true,
        fixedCount: 0,
        message: "Aucune correction nécessaire"
      };
    }

    // Si aucun sport par défaut n'est fourni, on prend le premier sport disponible
    if (!defaultSportId) {
      const { data: firstSport } = await supabase
        .from('sports')
        .select('id')
        .limit(1)
        .single();
      
      if (firstSport) {
        defaultSportId = firstSport.id;
      }
    }

    if (!defaultSportId) {
      return {
        success: false,
        fixedCount: 0,
        message: "Impossible de trouver un sport par défaut pour la correction"
      };
    }

    debugLogger.log('SportValidator', `Correction avec le sport par défaut ID: ${defaultSportId}, Positions invalides: ${validation.invalidPositions.length}`);

    // Corriger les postes invalides
    const invalidIds = validation.invalidPositions.map(p => p.id);
    
    // Afficher des informations sur chaque position à corriger
    validation.invalidPositions.forEach(pos => {
      debugLogger.log('SportValidator', `Correction de la position: ${pos.id} (${pos.name}), sport_id actuel: ${pos.sport_id}`);
    });
    
    const { error, count } = await supabase
      .from('sport_positions')
      .update({ sport_id: defaultSportId })
      .in('id', invalidIds);

    if (error) {
      debugLogger.error('SportValidator', "Erreur lors de la mise à jour", error);
      throw error;
    }

    // Vérifier à nouveau après correction
    const postValidation = await validateSportPositions();
    debugLogger.log('SportValidator', `État après correction: ${postValidation.valid ? 'Valide' : 'Toujours des problèmes'}`);

    return {
      success: true,
      fixedCount: count || 0,
      message: `${count || 0} postes ont été corrigés avec succès`
    };
  } catch (error) {
    debugLogger.error('SportValidator', "Erreur lors de la correction des positions", error);
    return {
      success: false,
      fixedCount: 0,
      message: "Erreur lors de la correction des associations sport-position"
    };
  }
};

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

/**
 * Analyse et corrige les divergences entre noms d'interface et noms de base de données
 */
export const analyzeSportNameDiscrepancies = async (): Promise<{
  discrepancies: any[];
  suggestions: {[key: string]: string[]};
}> => {
  try {
    const { sports, positions } = await getSportsAndPositions();
    
    // Créer un dictionnaire des sports pour vérifier les variations de noms
    const sportVariations: {[key: string]: string[]} = {};
    
    sports.forEach(sport => {
      // Convertir en minuscules et enlever les caractères spéciaux pour la comparaison
      const simplifiedName = sport.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (!sportVariations[simplifiedName]) {
        sportVariations[simplifiedName] = [];
      }
      sportVariations[simplifiedName].push(sport.name);
    });
    
    // Vérifier les sports qui ont plusieurs variantes de noms
    const discrepancies = Object.entries(sportVariations)
      .filter(([_, names]) => names.length > 1)
      .map(([base, names]) => ({
        baseForm: base,
        variations: names
      }));
    
    return {
      discrepancies,
      suggestions: sportVariations
    };
  } catch (error) {
    debugLogger.error('SportValidator', "Erreur lors de l'analyse des noms de sports", error);
    return {
      discrepancies: [],
      suggestions: {}
    };
  }
};
