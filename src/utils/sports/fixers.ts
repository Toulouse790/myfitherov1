
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { validateSportPositions } from "./validators";

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
 * Fixe le problème spécifique entre "Rugby" et "Rugby à XV"
 * Cette fonction recherche toutes les positions liées au rugby et les associe au sport "Rugby à XV"
 */
export const fixRugbyPositions = async (): Promise<{
  success: boolean;
  fixedCount: number;
  message: string;
}> => {
  try {
    debugLogger.log('SportValidator', 'Démarrage de la correction des positions Rugby');
    
    // 1. Trouver l'ID du sport "Rugby à XV" dans la base de données
    const { data: rugbyXVSports, error: sportError } = await supabase
      .from('sports')
      .select('id, name')
      .ilike('name', '%rugby%xv%');

    if (sportError || !rugbyXVSports || rugbyXVSports.length === 0) {
      debugLogger.error('SportValidator', "Erreur lors de la recherche du sport Rugby à XV", sportError || "Aucun résultat");
      return {
        success: false,
        fixedCount: 0,
        message: "Impossible de trouver le sport Rugby à XV dans la base de données"
      };
    }

    const rugbyXVSport = rugbyXVSports[0];
    debugLogger.log('SportValidator', `Sport Rugby à XV trouvé: ${rugbyXVSport.id} (${rugbyXVSport.name})`);

    // 2. Trouver tous les sports de type rugby (pour couvrir toutes les variantes possibles)
    const { data: allRugbySports, error: allRugbyError } = await supabase
      .from('sports')
      .select('id, name')
      .ilike('name', '%rugby%')
      .neq('id', rugbyXVSport.id);  // Exclure le Rugby à XV que nous avons déjà trouvé

    if (allRugbyError) {
      debugLogger.error('SportValidator', "Erreur lors de la recherche des sports de rugby", allRugbyError);
    }

    const rugbyVariantIds = allRugbySports?.map(sport => sport.id) || [];
    debugLogger.log('SportValidator', `Variantes de rugby trouvées: ${allRugbySports?.length || 0}`, 
      allRugbySports?.map(s => `${s.id}: ${s.name}`) || []);

    // 3. Trouver toutes les positions de rugby qui pourraient être mal associées
    const rugbyPositionNames = [
      "Pilier", "Talonneur", "Seconde ligne", "Troisième ligne aile", 
      "Troisième ligne centre", "Demi de mêlée", "Demi d'ouverture", 
      "Centre", "Ailier", "Arrière", "Troisième ligne", "Deuxième ligne",
      "Première ligne"
    ];

    // Pour la requête OR complexe
    let orConditions = rugbyVariantIds.map(id => `sport_id.eq.${id}`).join(',');
    if (orConditions) {
      orConditions = `sport_id.is.null,${orConditions}`;
    } else {
      orConditions = 'sport_id.is.null';
    }

    const { data: allPositions, error: positionsError } = await supabase
      .from('sport_positions')
      .select('id, name, sport_id');

    if (positionsError) {
      debugLogger.error('SportValidator', "Erreur lors de la recherche des positions", positionsError);
      return {
        success: false,
        fixedCount: 0,
        message: "Erreur lors de la recherche des positions de rugby"
      };
    }

    // Filtrer les positions de rugby par nom
    const rugbyPositionsToUpdate = allPositions.filter(pos => 
      // Soit position avec un nom de rugby
      rugbyPositionNames.some(rp => 
        pos.name.toLowerCase().includes(rp.toLowerCase()) || 
        rugbyPositionNames.some(rpn => rpn.toLowerCase() === pos.name.toLowerCase())
      ) ||
      // Soit position associée à une variante de rugby
      rugbyVariantIds.includes(pos.sport_id) ||
      // Soit position sans sport qui contient le mot "rugby"
      (pos.sport_id === null && pos.name.toLowerCase().includes('rugby'))
    );

    debugLogger.log('SportValidator', `Positions de Rugby à corriger trouvées: ${rugbyPositionsToUpdate.length}`);
    rugbyPositionsToUpdate.forEach(pos => {
      debugLogger.log('SportValidator', `Position: ${pos.id} ${pos.name} (sport_id: ${pos.sport_id || 'null'})`);
    });

    if (rugbyPositionsToUpdate.length === 0) {
      return {
        success: true,
        fixedCount: 0,
        message: "Aucune position de Rugby à corriger"
      };
    }

    // 4. Mettre à jour les positions de rugby avec l'ID correct de Rugby à XV
    const { error: updateError, count } = await supabase
      .from('sport_positions')
      .update({ sport_id: rugbyXVSport.id })
      .in('id', rugbyPositionsToUpdate.map(p => p.id));

    if (updateError) {
      debugLogger.error('SportValidator', "Erreur lors de la mise à jour des positions de Rugby", updateError);
      return {
        success: false,
        fixedCount: 0,
        message: "Erreur lors de la correction des positions de Rugby"
      };
    }

    return {
      success: true,
      fixedCount: count || 0,
      message: `${count || 0} positions de Rugby ont été correctement associées à Rugby à XV`
    };
  } catch (error) {
    debugLogger.error('SportValidator', "Erreur lors de la correction des positions de Rugby", error);
    return {
      success: false,
      fixedCount: 0,
      message: "Erreur lors de la correction des positions de Rugby"
    };
  }
};
