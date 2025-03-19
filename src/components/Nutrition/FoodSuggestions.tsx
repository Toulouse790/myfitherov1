
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { Button } from "@/components/ui/button";
import { Utensils, Info } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FoodEntry } from "@/types/food";

interface FoodSuggestionsProps {
  onSelectFood: (food: FoodEntry) => void;
}

export const FoodSuggestions = ({ onSelectFood }: FoodSuggestionsProps) => {
  const { dailyTargets, mealPlan, consumedNutrients } = useDailyTargets();
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  
  // Calculer les calories restantes pour la journée
  const remainingCalories = dailyTargets.calories - consumedNutrients.calories;
  
  // Liste des types de repas disponibles
  const mealTypes = [
    { id: "breakfast", label: "Petit déjeuner" },
    { id: "morning_snack", label: "Collation matin" },
    { id: "lunch", label: "Déjeuner" },
    { id: "afternoon_snack", label: "Goûter" },
    { id: "dinner", label: "Dîner" }
  ];
  
  // Suggestions de repas basées sur les calories restantes
  const suggestions: FoodEntry[] = [
    {
      id: "suggestion-1",
      name: "Bol de quinoa au poulet",
      calories: Math.round(remainingCalories * 0.3),
      proteins: Math.round(dailyTargets.proteins * 0.2),
      carbs: Math.round(dailyTargets.carbs * 0.3),
      fats: Math.round(dailyTargets.fats * 0.25),
      mealType: selectedMealType || undefined,
      description: "Bol de quinoa, poulet grillé, légumes de saison"
    },
    {
      id: "suggestion-2",
      name: "Salade grecque",
      calories: Math.round(remainingCalories * 0.25),
      proteins: Math.round(dailyTargets.proteins * 0.15),
      carbs: Math.round(dailyTargets.carbs * 0.1),
      fats: Math.round(dailyTargets.fats * 0.2),
      mealType: selectedMealType || undefined,
      description: "Tomates, concombre, feta, olives, huile d'olive"
    },
    {
      id: "suggestion-3",
      name: "Wrap au saumon",
      calories: Math.round(remainingCalories * 0.35),
      proteins: Math.round(dailyTargets.proteins * 0.25),
      carbs: Math.round(dailyTargets.carbs * 0.2),
      fats: Math.round(dailyTargets.fats * 0.3),
      mealType: selectedMealType || undefined,
      description: "Wrap complet, saumon fumé, avocat, salade"
    }
  ];
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span>Suggestions adaptées</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Suggestions basées sur vos objectifs caloriques restants: {remainingCalories} kcal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant="outline" className="font-normal">
            {remainingCalories} kcal restantes
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
                Réinitialiser
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
                    <span>{suggestion.proteins}g protéines</span>
                    {suggestion.carbs > 0 && <span>{suggestion.carbs}g glucides</span>}
                    {suggestion.fats > 0 && <span>{suggestion.fats}g lipides</span>}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onSelectFood(suggestion)}
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    Ajouter
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
