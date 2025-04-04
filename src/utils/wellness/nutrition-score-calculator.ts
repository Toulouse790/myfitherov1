
import { FoodItem } from "@/types/nutrition";

/**
 * Calcule le score nutritionnel en fonction des données alimentaires récentes
 * 
 * @param nutritionData Données alimentaires des 7 derniers jours
 * @returns Score nutritionnel entre 0 et 100
 */
export function calculateNutritionScore(nutritionData: FoodItem[]): number {
  if (nutritionData.length === 0) return 50;
  
  // Logique de calcul du score nutritionnel
  let balanceScore = 0;
  let consistencyScore = 0;
  let diversityScore = 0;
  
  // Évaluer l'équilibre des macros
  const entries = nutritionData.length;
  const daysWithEntries = new Set(nutritionData.map(entry => new Date(entry.id).toDateString())).size;
  
  // Calculer les moyennes de macronutriments
  const totalProteins = nutritionData.reduce((sum, entry) => sum + (entry.proteins || 0), 0);
  const totalCarbs = nutritionData.reduce((sum, entry) => sum + (entry.calories || 0), 0); // Approximation pour les carbs
  const totalFats = nutritionData.reduce((sum, entry) => sum + (0), 0); // Pas de données de gras, approximation
  
  // Vérifier l'équilibre des macros (ratio protéines/glucides/lipides idéal approx. 30/40/30)
  const totalMacros = totalProteins + totalCarbs + totalFats;
  if (totalMacros > 0) {
    const proteinRatio = totalProteins / totalMacros;
    const carbRatio = totalCarbs / totalMacros;
    const fatRatio = totalFats / totalMacros;
    
    // Calculer l'écart par rapport aux ratios idéaux
    const proteinDiff = Math.abs(proteinRatio - 0.3);
    const carbDiff = Math.abs(carbRatio - 0.4);
    const fatDiff = Math.abs(fatRatio - 0.3);
    
    balanceScore = 50 * (1 - ((proteinDiff + carbDiff + fatDiff) / 1.2));
  }
  
  // Évaluer la consistance des repas
  consistencyScore = Math.min(25, (daysWithEntries / 7) * 25);
  
  // Évaluer la diversité des aliments
  const mealTypes = new Set(nutritionData.map(entry => entry.unit)).size;
  diversityScore = Math.min(25, (mealTypes / 5) * 25); // 5 repas possibles
  
  const calculatedScore = balanceScore + consistencyScore + diversityScore;
  return Math.min(100, Math.max(0, calculatedScore));
}
