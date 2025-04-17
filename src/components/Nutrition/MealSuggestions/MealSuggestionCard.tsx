
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  image_url?: string;
  meal_type: string;
}

interface MealSuggestionCardProps {
  suggestion: MealSuggestion;
}

export const MealSuggestionCard = ({ suggestion }: MealSuggestionCardProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAddToMealPlan = () => {
    // Cette fonctionnalité sera implémentée plus tard
    toast({
      title: t("common.success"),
      description: t("nutrition.addedToMealPlan", { fallback: "Ajouté au plan de repas" }),
    });
  };

  const handleAddToFoodJournal = () => {
    // Cette fonctionnalité sera implémentée plus tard
    toast({
      title: t("common.success"),
      description: t("nutrition.addedToFoodJournal", { fallback: "Ajouté au journal alimentaire" }),
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {suggestion.image_url && (
        <div 
          className="aspect-video w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${suggestion.image_url})` }}
        />
      )}
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold mb-1 line-clamp-1">{suggestion.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {suggestion.description || t("nutrition.noDescription", { fallback: "Pas de description disponible" })}
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-primary/10 p-2 rounded-md">
            <p className="font-medium">{suggestion.calories}</p>
            <p className="text-muted-foreground">{t("nutrition.calories")}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            <p className="font-medium">{suggestion.proteins}g</p>
            <p className="text-muted-foreground">{t("nutrition.proteins")}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            <p className="font-medium">{suggestion.carbs}g</p>
            <p className="text-muted-foreground">{t("nutrition.carbs")}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleAddToMealPlan}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t("nutrition.mealPlan", { fallback: "Plan" })}
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={handleAddToFoodJournal}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t("nutrition.addMeal", { fallback: "Ajouter" })}
        </Button>
      </CardFooter>
    </Card>
  );
};
