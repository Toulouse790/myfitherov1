import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getPreparationInstructions } from "../MealPlan/PreparationInstructions";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { MealHeader } from "./MealSection/MealHeader";
import { MealContent } from "./MealSection/MealContent";

interface MealSectionProps {
  type: string;
  label: string;
  mealEntries: any[];
  generatedMeal?: {
    name: string;
    calories: number;
    proteins: number;
    notes?: string;
    quantities?: Array<{ item: string; amount: string; }>;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export const MealSection = ({
  type,
  label,
  mealEntries,
  generatedMeal,
  isExpanded,
  onToggle,
}: MealSectionProps) => {
  const [mealStatus, setMealStatus] = useState<'taken' | 'skipped' | null>(null);
  const { toast } = useToast();
  const { refetchEntries } = useFoodEntries();

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
          notes: getPreparationInstructions(generatedMeal.name) || ''
        };

        if (generatedMeal.quantities && generatedMeal.quantities.length > 0) {
          const ingredientsList = generatedMeal.quantities
            .map(q => `${q.item}: ${q.amount}`)
            .join('\n');
          mealEntry.notes = `${mealEntry.notes}\n\nIngrédients:\n${ingredientsList}`;
        }

        console.log("Inserting meal entry:", mealEntry);
        const { error } = await supabase
          .from('food_journal_entries')
          .insert(mealEntry);

        if (error) {
          console.error('Error inserting meal entry:', error);
          throw error;
        }

        await refetchEntries();

        toast({
          title: "Repas validé",
          description: "Le repas a été ajouté à votre journal et vos objectifs ont été mis à jour",
        });
      } else if (status === 'skipped') {
        toast({
          title: "Repas non pris",
          description: "Le repas a été marqué comme non pris",
        });
      }

      setMealStatus(status);
    } catch (error) {
      console.error('Error updating meal status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du repas",
        variant: "destructive",
      });
    }
  };

  const preparation = generatedMeal ? getPreparationInstructions(generatedMeal.name) : null;

  return (
    <div className="mb-2">
      <MealHeader
        label={label}
        mealStatus={mealStatus}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />

      {isExpanded && (
        <MealContent
          mealEntries={mealEntries}
          generatedMeal={generatedMeal}
          preparation={preparation}
          onMealStatus={handleMealStatus}
        />
      )}
    </div>
  );
};