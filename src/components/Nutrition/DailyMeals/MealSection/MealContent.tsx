import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ShoppingBag, X } from "lucide-react";
import { MealContentProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const MealContent = ({ 
  mealEntries, 
  generatedMeal,
  onMealStatus,
  mealType 
}: MealContentProps) => {
  const { data: mealPlan } = useQuery({
    queryKey: ['meal-plan'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading meal plan:', error);
        return null;
      }

      return data;
    }
  });

  const getCurrentDayMeal = () => {
    if (!mealPlan?.plan_data) return generatedMeal;

    const today = new Date();
    const startDate = new Date(mealPlan.start_date);
    const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Handle all plan durations (7, 14, 30 days)
    if (dayDiff < 0 || dayDiff >= mealPlan.plan_data.length) return generatedMeal;

    const dayMeals = mealPlan.plan_data[dayDiff];
    return dayMeals[mealType];
  };

  const currentMeal = getCurrentDayMeal();
  const currentDay = mealPlan ? Math.floor((new Date().getTime() - new Date(mealPlan.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1;

  return (
    <div className="p-4 bg-background/50 rounded-lg space-y-4">
      {/* Existing entries */}
      {mealEntries.length > 0 && (
        <div className="space-y-2">
          {mealEntries.map((entry) => (
            <Card key={entry.id} className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{entry.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {entry.calories} kcal | {entry.proteins}g protéines
                  </p>
                  {entry.components && entry.components.length > 0 && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {entry.components.map((component: { name: string; portion: string }, idx: number) => (
                        <p key={idx}>{component.portion} de {component.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Generated meal suggestion */}
      {currentMeal && (
        <div className="space-y-3">
          <Card className="p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{currentMeal.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentMeal.calories} kcal | {currentMeal.proteins}g protéines
                  </p>
                  {/* Detailed portions */}
                  {currentMeal.quantities && currentMeal.quantities.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground space-y-1">
                      {currentMeal.quantities.map((item, index) => (
                        <p key={index} className="flex items-center gap-2">
                          <span className="text-muted-foreground">•</span>
                          {item.amount} de {item.item}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Shopping list section */}
              {currentMeal.quantities && currentMeal.quantities.length > 0 && (
                <div className="mt-3 border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <h5 className="font-medium text-sm">Liste de courses</h5>
                  </div>
                  <ScrollArea className="h-[100px] w-full">
                    <ul className="space-y-1">
                      {currentMeal.quantities.map((item, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <span className="text-muted-foreground">•</span>
                          {item.item}: {item.amount}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {/* Preparation instructions if available */}
              {currentMeal.preparation && (
                <p className="text-sm text-muted-foreground mt-2">
                  {currentMeal.preparation}
                </p>
              )}

              {/* Plan duration info with support for all durations */}
              {mealPlan && (
                <p className="text-xs text-muted-foreground mt-2">
                  Jour {currentDay} sur {mealPlan.plan_data.length}
                </p>
              )}
            </div>
          </Card>

          {onMealStatus && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onMealStatus('taken')}
              >
                <Check className="h-4 w-4 mr-2" />
                Valider
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onMealStatus('skipped')}
              >
                <X className="h-4 w-4 mr-2" />
                Non pris
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};