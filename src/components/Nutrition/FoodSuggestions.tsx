
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { Button } from "@/components/ui/button";
import { Utensils, Info } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FoodEntry } from "@/types/food";
import { useLanguage } from "@/contexts/LanguageContext";

interface FoodSuggestionsProps {
  onSelectFood: (food: FoodEntry) => void;
}

export const FoodSuggestions = ({ onSelectFood }: FoodSuggestionsProps) => {
  const { dailyTargets, mealPlan, consumedNutrients } = useDailyTargets();
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Calculer les calories restantes pour la journée
  const remainingCalories = dailyTargets.calories - consumedNutrients.calories;
  const remainingProteins = dailyTargets.proteins - consumedNutrients.proteins;
  const remainingCarbs = dailyTargets.carbs - consumedNutrients.carbs;
  const remainingFats = dailyTargets.fats - consumedNutrients.fats;
  
  // Liste des types de repas disponibles
  const mealTypes = [
    { id: "breakfast", label: t("nutrition.mealTypes.breakfast", { fallback: "Petit déjeuner" }) },
    { id: "morning_snack", label: t("nutrition.mealTypes.morning_snack", { fallback: "Collation matin" }) },
    { id: "lunch", label: t("nutrition.mealTypes.lunch", { fallback: "Déjeuner" }) },
    { id: "afternoon_snack", label: t("nutrition.mealTypes.afternoon_snack", { fallback: "Goûter" }) },
    { id: "dinner", label: t("nutrition.mealTypes.dinner", { fallback: "Dîner" }) }
  ];
  
  // Obtenir le ratio de distribution selon le type de repas
  const getMealRatio = (mealType: string | null) => {
    switch(mealType) {
      case 'breakfast': return 0.25; // 25% des calories
      case 'lunch': return 0.35; // 35% des calories
      case 'dinner': return 0.30; // 30% des calories
      case 'morning_snack': return 0.05; // 5% des calories
      case 'afternoon_snack': return 0.05; // 5% des calories
      default: return 0.25; // Proportion par défaut (petit repas)
    }
  };
  
  // Fonction pour générer des suggestions cohérentes avec les besoins
  const generateSuggestions = (): FoodEntry[] => {
    const mealRatio = getMealRatio(selectedMealType);
    
    // Si on manque de calories restantes, on propose des repas légers
    const targetCalories = Math.max(remainingCalories * mealRatio, 150);
    const targetProteins = Math.max(remainingProteins * mealRatio, 10);
    const targetCarbs = Math.max(remainingCarbs * mealRatio, 15);
    const targetFats = Math.max(remainingFats * mealRatio, 5);
    
    // Varier les proportions pour obtenir différentes suggestions
    return [
      {
        id: "suggestion-1",
        name: "Bol de quinoa au poulet",
        calories: Math.round(targetCalories),
        proteins: Math.round(targetProteins),
        carbs: Math.round(targetCarbs * 1.2),
        fats: Math.round(targetFats * 0.8),
        mealType: selectedMealType || undefined,
        description: "Bol de quinoa, poulet grillé, légumes de saison"
      },
      {
        id: "suggestion-2",
        name: "Salade grecque",
        calories: Math.round(targetCalories * 0.9),
        proteins: Math.round(targetProteins * 0.8),
        carbs: Math.round(targetCarbs * 0.6),
        fats: Math.round(targetFats * 1.3),
        mealType: selectedMealType || undefined,
        description: "Tomates, concombre, feta, olives, huile d'olive"
      },
      {
        id: "suggestion-3",
        name: "Wrap au saumon",
        calories: Math.round(targetCalories * 1.1),
        proteins: Math.round(targetProteins * 1.2),
        carbs: Math.round(targetCarbs * 0.9),
        fats: Math.round(targetFats * 1.1),
        mealType: selectedMealType || undefined,
        description: "Wrap complet, saumon fumé, avocat, salade"
      }
    ];
  };
  
  const suggestions = generateSuggestions();
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span>{t("nutrition.suggestedMeal", { fallback: "Suggestions adaptées" })}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("nutrition.remainingCaloriesInfo", { fallback: "Suggestions basées sur vos objectifs caloriques restants" })}: {remainingCalories} kcal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant="outline" className="font-normal">
            {remainingCalories} {t("nutrition.remaining", { fallback: "kcal restantes" })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {mealTypes.map(type => (
              <Badge 
                key={type.id}
                variant={selectedMealType === type.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedMealType(type.id)}
              >
                {type.label}
              </Badge>
            ))}
            {selectedMealType && (
              <Badge 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedMealType(null)}
              >
                {t("common.reset", { fallback: "Réinitialiser" })}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {suggestions.map(suggestion => (
              <Card key={suggestion.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{suggestion.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                  <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground mb-3">
                    <span>{suggestion.calories} kcal</span>
                    <span>{suggestion.proteins}g {t("nutrition.proteins", { fallback: "protéines" })}</span>
                    {suggestion.carbs > 0 && <span>{suggestion.carbs}g {t("nutrition.carbs", { fallback: "glucides" })}</span>}
                    {suggestion.fats > 0 && <span>{suggestion.fats}g {t("nutrition.fats", { fallback: "lipides" })}</span>}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onSelectFood(suggestion)}
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    {t("nutrition.addMeal", { fallback: "Ajouter" })}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
