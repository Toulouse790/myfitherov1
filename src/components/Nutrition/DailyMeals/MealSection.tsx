import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getPreparationInstructions } from "../MealPlan/PreparationInstructions";

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

  const handleMealStatus = async (status: 'taken' | 'skipped') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Si le repas est marqué comme pris, on ajoute les détails au journal
      if (status === 'taken' && generatedMeal) {
        console.log("Saving meal to journal:", generatedMeal);
        
        // Créer une entrée pour le repas principal
        const mealEntry = {
          user_id: user.id,
          name: generatedMeal.name,
          calories: generatedMeal.calories,
          proteins: generatedMeal.proteins,
          meal_type: type,
          notes: getPreparationInstructions(generatedMeal.name) || ''
        };

        // Ajouter les ingrédients comme note si disponibles
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

  // Récupérer les instructions de préparation pour le repas généré
  const preparation = generatedMeal ? getPreparationInstructions(generatedMeal.name) : null;

  return (
    <div className="mb-2">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto hover:bg-gray-100/50 transition-colors"
        onClick={onToggle}
      >
        <div className="text-left flex items-center gap-2">
          <div>
            <div className="font-medium text-gray-900">{label}</div>
            {mealStatus && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {mealStatus === 'taken' ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <X className="h-3 w-3 text-red-500" />
                )}
                {mealStatus === 'taken' ? 'Pris' : 'Non pris'}
              </div>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </Button>

      {isExpanded && (
        <div className="pl-4 pr-2 py-2 space-y-2">
          {mealEntries.length > 0 ? (
            mealEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors"
              >
                <div className="font-medium text-gray-800">{entry.name}</div>
                <div className="text-sm text-muted-foreground">
                  {entry.calories} kcal | {entry.proteins}g protéines
                </div>
                {entry.notes && (
                  <p className="mt-2 text-sm text-muted-foreground italic">
                    {entry.notes}
                  </p>
                )}
              </div>
            ))
          ) : generatedMeal ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="font-medium text-gray-800">{generatedMeal.name}</div>
                <div className="text-sm text-muted-foreground">
                  {generatedMeal.calories} kcal | {generatedMeal.proteins}g protéines
                </div>
                {generatedMeal.quantities && generatedMeal.quantities.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-700">Ingrédients :</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                      {generatedMeal.quantities.map((item, index) => (
                        <li key={index}>
                          {item.item}: {item.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {preparation && preparation !== "Aucune instruction disponible" && (
                  <p className="mt-2 text-sm text-muted-foreground italic">
                    💡 {preparation}
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMealStatus('skipped')}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMealStatus('taken')}
                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-2">
              Aucun repas suggéré
            </div>
          )}
        </div>
      )}
    </div>
  );
};