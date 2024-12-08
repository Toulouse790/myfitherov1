import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FoodEntry } from "@/types/food";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MealSectionProps {
  type: string;
  label: string;
  mealEntries: FoodEntry[];
  generatedMeal: {
    name: string;
    calories: number;
    proteins: number;
    notes?: string;
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

      const { error } = await supabase
        .from('food_journal_entries')
        .upsert({
          user_id: user.id,
          name: `${label} - ${status === 'taken' ? 'Pris' : 'Non pris'}`,
          calories: status === 'taken' ? generatedMeal.calories : 0,
          proteins: status === 'taken' ? generatedMeal.proteins : 0,
          meal_type: type
        });

      if (error) throw error;

      setMealStatus(status);
      toast({
        title: status === 'taken' ? "Repas validé" : "Repas non pris",
        description: status === 'taken' 
          ? "Le repas a été ajouté à vos objectifs journaliers"
          : "Le repas a été marqué comme non pris",
      });
    } catch (error) {
      console.error('Error updating meal status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du repas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-2">
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto"
        onClick={onToggle}
      >
        <div className="text-left flex items-center gap-2">
          <div>
            <div className="font-medium">{label}</div>
            {(mealEntries.length > 0 || generatedMeal) && (
              <div className="text-sm text-muted-foreground">
                {generatedMeal.calories} kcal • {generatedMeal.proteins}g protéines
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {mealStatus === 'taken' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {mealStatus === 'skipped' && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="pl-4 pr-2 py-2 space-y-2">
          {mealEntries.length > 0 ? (
            mealEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-lg bg-muted/50"
              >
                <div className="font-medium">{entry.name}</div>
                <div className="text-sm text-muted-foreground">
                  {entry.calories} kcal • {entry.proteins}g protéines
                </div>
              </div>
            ))
          ) : generatedMeal ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="font-medium">{generatedMeal.name}</div>
                <div className="text-sm text-muted-foreground">
                  {generatedMeal.calories} kcal • {generatedMeal.proteins}g protéines
                </div>
                {generatedMeal.notes && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {generatedMeal.notes}
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleMealStatus('skipped')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Non pris
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                  onClick={() => handleMealStatus('taken')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Valider
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-2">
              Aucun aliment enregistré
            </div>
          )}
        </div>
      )}
    </div>
  );
};