
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";
import { getSportsAndPositions } from "./fetchers";

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
