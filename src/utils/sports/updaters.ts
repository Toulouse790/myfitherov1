
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

/**
 * Met à jour le nom d'un sport dans la base de données
 */
export const updateSportName = async (
  sportId: string,
  newName: string,
  sportType: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    // Vérifier si le nouveau nom n'est pas déjà utilisé par un autre sport
    const { data: existingSport, error: checkError } = await supabase
      .from('sports')
      .select('id')
      .eq('name', newName)
      .neq('id', sportId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // Une erreur s'est produite lors de la vérification
      throw checkError;
    }

    if (existingSport) {
      return {
        success: false,
        message: `Un sport avec le nom "${newName}" existe déjà`
      };
    }

    // Mettre à jour le nom du sport
    const { error: updateError } = await supabase
      .from('sports')
      .update({ 
        name: newName,
        type: sportType
      })
      .eq('id', sportId);

    if (updateError) {
      throw updateError;
    }

    debugLogger.log('SportUpdater', `Sport mis à jour avec succès: ID ${sportId}, nouveau nom: ${newName}`);
    
    return {
      success: true,
      message: 'Sport mis à jour avec succès'
    };
  } catch (error) {
    debugLogger.error('SportUpdater', "Erreur lors de la mise à jour du nom du sport", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du sport"
    };
  }
};

/**
 * Fixe le problème spécifique Rugby/Rugby à XV
 */
export const fixRugbyPositions = async (): Promise<{
  success: boolean;
  message: string;
  fixedCount: number;
}> => {
  try {
    // Chercher l'ID du sport "Rugby"
    const { data: rugbySport, error: rugbyError } = await supabase
      .from('sports')
      .select('id, name')
      .eq('name', 'Rugby')
      .single();

    if (rugbyError) {
      throw new Error("Le sport 'Rugby' n'a pas été trouvé");
    }

    // Chercher l'ID du sport "Rugby à XV" s'il existe
    const { data: rugbyXVSport, error: rugbyXVError } = await supabase
      .from('sports')
      .select('id, name')
      .eq('name', 'Rugby à XV')
      .single();

    // Si Rugby à XV n'existe pas, créer une entrée
    let rugbyXVId;
    if (rugbyXVError && rugbyXVError.code === 'PGRST116') {
      const { data: newRugbyXV, error: createError } = await supabase
        .from('sports')
        .insert({
          name: 'Rugby à XV',
          type: 'team',
          category: rugbySport.category
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      
      rugbyXVId = newRugbyXV.id;
      debugLogger.log('SportFixer', `Sport "Rugby à XV" créé avec ID: ${rugbyXVId}`);
    } else if (!rugbyXVError) {
      rugbyXVId = rugbyXVSport.id;
    } else {
      throw rugbyXVError;
    }

    // Récupérer les positions de rugby qui doivent être corrigées
    const { data: rugbyPositions, error: positionsError } = await supabase
      .from('sport_positions')
      .select('id, name, sport_id')
      .eq('sport_id', rugbySport.id)
      .or(`name.ilike.%XV%,name.ilike.%quinze%`);

    if (positionsError) {
      throw positionsError;
    }

    if (rugbyPositions.length === 0) {
      return {
        success: true,
        message: "Aucune position de Rugby à XV n'a été trouvée associée au sport Rugby",
        fixedCount: 0
      };
    }

    // Mettre à jour les positions pour les associer à Rugby à XV
    const { data: updated, error: updateError } = await supabase
      .from('sport_positions')
      .update({ sport_id: rugbyXVId })
      .in('id', rugbyPositions.map(pos => pos.id))
      .select();

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      message: `${rugbyPositions.length} position(s) ont été correctement associées à Rugby à XV`,
      fixedCount: rugbyPositions.length
    };
  } catch (error) {
    debugLogger.error('SportFixer', "Erreur lors de la correction des positions de Rugby", error);
    return {
      success: false,
      message: `Erreur: ${error instanceof Error ? error.message : String(error)}`,
      fixedCount: 0
    };
  }
};

/**
 * Corrige les positions qui ont un sport_id invalide
 */
export const fixInvalidSportPositions = async (defaultSportId: string): Promise<{
  success: boolean;
  message: string;
  fixedCount: number;
}> => {
  try {
    // Récupérer les positions avec des sport_id invalides
    const { data: invalidPositions, error: queryError } = await supabase
      .from('sport_positions')
      .select('id, name, sport_id')
      .is('sport_id', null);

    if (queryError) {
      throw queryError;
    }

    if (invalidPositions.length === 0) {
      return {
        success: true,
        message: "Aucune position avec sport_id invalide n'a été trouvée",
        fixedCount: 0
      };
    }

    // Mettre à jour les positions avec le sport par défaut
    const { data: updated, error: updateError } = await supabase
      .from('sport_positions')
      .update({ sport_id: defaultSportId })
      .in('id', invalidPositions.map(pos => pos.id))
      .select();

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      message: `${invalidPositions.length} position(s) ont été correctement associées au sport par défaut`,
      fixedCount: invalidPositions.length
    };
  } catch (error) {
    debugLogger.error('SportFixer', "Erreur lors de la correction des positions invalides", error);
    return {
      success: false,
      message: `Erreur: ${error instanceof Error ? error.message : String(error)}`,
      fixedCount: 0
    };
  }
};
