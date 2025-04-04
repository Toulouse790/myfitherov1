
import { FoodItem } from "@/types/nutrition";

/**
 * Calcule le score nutritionnel en fonction des entrées du journal alimentaire
 * 
 * @param nutritionData Données nutritionnelles des 7 derniers jours
 * @returns Score nutritionnel entre 0 et 100
 */
export function calculateNutritionScore(nutritionData: FoodItem[]): number {
  if (nutritionData.length === 0) return 50;
  
  // Logique de calcul du score nutritionnel
  let balanceScore = 0;
  let consistencyScore = 0;
  let qualityScore = 0;
  
  // Évaluer l'équilibre macronutriments
  const totalProteins = nutritionData.reduce((sum, item) => sum + (item.proteins || 0), 0);
  const totalCarbs = nutritionData.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFats = nutritionData.reduce((sum, item) => sum + (item.fats || 0), 0);
  const totalCalories = nutritionData.reduce((sum, item) => sum + (item.calories || 0), 0);
  
  // Calculer les pourcentages de macronutriments
  const totalMacros = totalProteins + totalCarbs + totalFats;
  
  if (totalMacros > 0) {
    const proteinPercent = (totalProteins / totalMacros) * 100;
    const carbsPercent = (totalCarbs / totalMacros) * 100;
    const fatsPercent = (totalFats / totalMacros) * 100;
    
    // Idéal: 30% protéines, 40% glucides, 30% lipides (simplifié)
    const proteinBalance = Math.abs(proteinPercent - 30);
    const carbsBalance = Math.abs(carbsPercent - 40);
    const fatsBalance = Math.abs(fatsPercent - 30);
    
    // Plus la valeur est basse, plus on est équilibré
    const balanceDeviation = (proteinBalance + carbsBalance + fatsBalance) / 3;
    balanceScore = Math.max(0, 40 - balanceDeviation);
  } else {
    balanceScore = 20; // Score par défaut
  }
  
  // Évaluer la cohérence des repas (présence régulière d'entrées)
  const uniqueDays = new Set(
    nutritionData.map(item => new Date(item.created_at || '').toDateString())
  );
  consistencyScore = Math.min(30, (uniqueDays.size / 7) * 30);
  
  // Évaluer la qualité (simplifié)
  const avgCaloriesPerDay = totalCalories / (uniqueDays.size || 1);
  const recommendedCalories = 2000; // Valeur moyenne simplifiée
  const calorieDeviation = Math.abs(avgCaloriesPerDay - recommendedCalories);
  qualityScore = Math.max(0, 30 - (calorieDeviation / 100));
  
  const calculatedScore = balanceScore + consistencyScore + qualityScore;
  return Math.min(100, Math.max(0, calculatedScore));
}
