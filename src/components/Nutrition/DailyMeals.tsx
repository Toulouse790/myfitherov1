import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pizza } from "lucide-react";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { CheatMealDialog } from "./DailyMeals/CheatMealDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [isCheatMealOpen, setIsCheatMealOpen] = useState(false);
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType, refetchEntries } = useFoodEntries();
  const { toast } = useToast();

  useEffect(() => {
    const checkMealValidations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('meal_validation_times, meal_validation_notifications')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!preferences?.meal_validation_notifications) return;

      const validationTimes = preferences.meal_validation_times || {};
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      Object.entries(validationTimes).forEach(([mealType, timeStr]) => {
        const [hours, minutes] = (timeStr as string).split(':').map(Number);
        const mealEntries = entriesByMealType[mealType] || [];
        const mealInfo = mealPlan[mealType];

        if (mealInfo && mealEntries.length === 0) {
          if (currentHour === hours && currentMinutes === 0) {
            toast({
              title: "Rappel de repas",
              description: `N'oubliez pas de valider votre ${mealTypes[mealType]} !`,
              duration: 10000,
            });
          }
        }
      });
    };

    const interval = setInterval(checkMealValidations, 60000);
    checkMealValidations();

    return () => clearInterval(interval);
  }, [mealPlan, entriesByMealType, toast]);

  const handleCheatMealDialogChange = (open: boolean) => {
    console.log("CheatMeal dialog state changed:", open);
    setIsCheatMealOpen(open);
    if (!open) {
      refetchEntries();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base">Repas du jour</CardTitle>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsCheatMealOpen(true)}>
          <Pizza className="w-4 h-4" />
          <span className="hidden sm:inline">Cheat Meal</span>
        </Button>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {Object.entries(mealTypes).map(([type, label]) => (
            <MealSection
              key={type}
              type={type}
              label={label}
              mealEntries={entriesByMealType[type] || []}
              generatedMeal={mealPlan[type] ? {
                name: mealPlan[type].name || 'Repas suggéré',
                calories: mealPlan[type].calories,
                proteins: mealPlan[type].proteins,
              } : undefined}
              isExpanded={expandedMeal === type}
              onToggle={() => setExpandedMeal(expandedMeal === type ? null : type)}
            />
          ))}
        </div>
      </CardContent>

      <CheatMealDialog 
        isOpen={isCheatMealOpen}
        onOpenChange={handleCheatMealDialogChange}
      />
    </Card>
  );
};