import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FoodEntry } from "@/types/food";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MealContentProps {
  mealEntries: FoodEntry[];
  onAddFood?: () => void;
  type: string;
}

export const MealContent = ({ mealEntries, onAddFood, type }: MealContentProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteEntry = async (id: string) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('food_journal_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: t("nutrition.deletedSuccessfully"),
        description: t("nutrition.foodEntryRemoved"),
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast({
        title: t("common.error"),
        description: t("nutrition.errorDeletingEntry"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-4 p-3">
      {mealEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t("nutrition.noMealsAdded")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <div 
              key={entry.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <h4 className="font-medium">{entry.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {entry.calories} kcal | {entry.proteins}g {t("nutrition.proteins")}
                  {entry.carbs !== undefined && ` | ${entry.carbs}g ${t("nutrition.carbs")}`}
                  {entry.fats !== undefined && ` | ${entry.fats}g ${t("nutrition.fats")}`}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteEntry(entry.id)}
                disabled={isDeleting}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t("common.delete")}</span>
              </Button>
            </div>
          ))}
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 w-full"
              onClick={onAddFood}
              type="button"
            >
              <Plus className="h-4 w-4" />
              {t("nutrition.addAnotherFood")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
