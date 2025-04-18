
import { Card } from "@/components/ui/card";
import { MealContent } from "./MealContent";
import { MealHeader } from "./MealHeader";
import { MealSectionProps } from "./types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { useLanguage } from "@/contexts/LanguageContext";

export const MealSection = ({
  type,
  label,
  mealEntries,
  generatedMeal,
  isExpanded,
  onToggle
}: MealSectionProps) => {
  const [mealStatus, setMealStatus] = useState<'taken' | 'skipped' | null>(null);
  const { toast } = useToast();
  const { refetchEntries } = useFoodEntries();
  const { t } = useLanguage();

  const handleMealStatus = async (status: 'taken' | 'skipped') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (status === 'taken' && generatedMeal) {
        console.log("Saving meal to journal:", generatedMeal);
        
        const mealEntry = {
          user_id: user.id,
          name: generatedMeal.name,
          calories: generatedMeal.calories,
          proteins: generatedMeal.proteins,
          meal_type: type,
          notes: generatedMeal.notes || ''
        };

        if (generatedMeal.quantities && generatedMeal.quantities.length > 0) {
          const ingredientsList = generatedMeal.quantities
            .map(q => `${q.item}: ${q.amount}`)
            .join('\n');
          mealEntry.notes = `${mealEntry.notes}\n\n${t("nutrition.dietary.ingredients", { fallback: "Ingrédients" })}:\n${ingredientsList}`;
        }

        console.log("Inserting meal entry:", mealEntry);
        const { data, error } = await supabase
          .from('food_journal_entries')
          .insert(mealEntry)
          .select();

        if (error) {
          console.error('Error inserting meal entry:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          throw new Error(t("nutrition.errors.noDataReturned"));
        }

        await refetchEntries();

        toast({
          title: t("nutrition.mealValidated"),
          description: t("nutrition.mealAddedToJournal"),
        });
      } else if (status === 'skipped') {
        toast({
          title: t("nutrition.mealSkipped"),
          description: t("nutrition.mealMarkedAsSkipped"),
        });
      }

      setMealStatus(status);
    } catch (error) {
      console.error('Error updating meal status:', error);
      toast({
        title: t("common.error"),
        description: t("nutrition.errorUpdatingMealStatus"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <MealHeader
        label={label}
        mealStatus={mealEntries.length > 0 ? 'taken' : mealStatus}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <MealContent
          mealEntries={mealEntries}
          generatedMeal={generatedMeal}
          onMealStatus={handleMealStatus}
          mealType={type}
        />
      )}
    </Card>
  );
}
