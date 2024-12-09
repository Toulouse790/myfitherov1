import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFoodEntries } from "@/hooks/use-food-entries";

interface DayMealsProps {
  meals: Record<string, any>;
  mealTitles: Record<string, any>;
  isTrainingDay?: boolean;
  workoutTime?: 'morning' | 'evening';
  totalCarbs?: number;
  carbsTarget?: number;
  hasMorningSnack?: boolean;
  hasAfternoonSnack?: boolean;
}

export const DayMeals = ({ 
  meals = {}, 
  mealTitles, 
  isTrainingDay = false,
  workoutTime,
  totalCarbs = 0,
  carbsTarget = 0,
  hasMorningSnack = true,
  hasAfternoonSnack = true
}: DayMealsProps) => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [mealStatus, setMealStatus] = useState<Record<string, 'taken' | 'skipped' | null>>({});
  const { toast } = useToast();
  const { refetchEntries } = useFoodEntries();

  console.log("DayMeals - Received props:", {
    meals,
    mealTitles,
    isTrainingDay,
    workoutTime,
    totalCarbs,
    carbsTarget
  });

  const getCarbsStatus = () => {
    const difference = totalCarbs - carbsTarget;
    if (Math.abs(difference) <= 20) return "optimal";
    return difference > 0 ? "high" : "low";
  };

  const getCarbsMessage = () => {
    if (!isTrainingDay) return "Jour de repos";
    return workoutTime === 'morning' 
      ? "Entraînement le matin - Glucides concentrés avant/après l'effort"
      : "Entraînement le soir - Glucides répartis dans la journée";
  };

  const handleMealStatus = async (mealType: string, status: 'taken' | 'skipped') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Si le repas est marqué comme pris, on l'ajoute au journal
      if (status === 'taken' && meals[mealType]) {
        console.log("Saving meal to journal:", meals[mealType]);
        
        const mealEntry = {
          user_id: user.id,
          name: meals[mealType].name,
          calories: meals[mealType].calories,
          proteins: meals[mealType].proteins,
          meal_type: mealType,
          notes: meals[mealType].preparation || ''
        };

        const { error } = await supabase
          .from('food_journal_entries')
          .insert(mealEntry);

        if (error) {
          console.error('Error inserting meal entry:', error);
          throw error;
        }

        // Rafraîchir les entrées du journal alimentaire
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

      setMealStatus(prev => ({
        ...prev,
        [mealType]: status
      }));
    } catch (error) {
      console.error('Error updating meal status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du repas",
        variant: "destructive",
      });
    }
  };

  // Filtrer les types de repas selon les préférences
  const filteredMealTitles = Object.entries(mealTitles).reduce((acc, [key, value]) => {
    if (key === 'morning_snack' && !hasMorningSnack) return acc;
    if (key === 'afternoon_snack' && !hasAfternoonSnack) return acc;
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-4">
      <Alert variant={getCarbsStatus() === "optimal" ? "default" : "destructive"}>
        <AlertDescription>
          {getCarbsMessage()} - 
          Glucides : {totalCarbs}g / {carbsTarget}g recommandés
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        {Object.entries(filteredMealTitles).map(([mealType, { title }]) => {
          const meal = meals[mealType];
          console.log(`Rendering meal ${mealType}:`, meal);

          if (!meal) return null;

          return (
            <Card key={mealType} className="overflow-hidden">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center p-4 h-auto"
                onClick={() => setExpandedMeal(expandedMeal === mealType ? null : mealType)}
              >
                <span className="font-medium">{title}</span>
                {expandedMeal === mealType ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedMeal === mealType && (
                <div className="p-4 pt-0 space-y-4 text-sm">
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-muted-foreground">
                      {meal.calories} kcal | {meal.proteins}g protéines
                    </p>
                    {meal.preparation && (
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        💡 {meal.preparation}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMealStatus(mealType, 'skipped')}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMealStatus(mealType, 'taken')}
                      className="text-green-500 hover:text-green-600 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>

                  {mealStatus[mealType] && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {mealStatus[mealType] === 'taken' ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Pris</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-red-500" />
                          <span>Non pris</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};