import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { DayMeals } from "./MealPlan/DayMeals";

interface MealPlanGeneratorProps {
  workoutsPerWeek: number;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  weight: number;
  height: number;
  age: number;
  allergies: string[];
}

export const MealPlanGenerator = ({
  workoutsPerWeek,
  goal,
  weight,
  height,
  age,
  allergies,
}: MealPlanGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [durationDays, setDurationDays] = useState("7");
  const [maxBudget, setMaxBudget] = useState("100");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const calculateDailyCalories = () => {
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    const activityFactor = 1.2 + (workoutsPerWeek * 0.1);
    let totalCalories = bmr * activityFactor;

    switch (goal) {
      case "weight_loss":
        totalCalories *= 0.85;
        break;
      case "muscle_gain":
        totalCalories *= 1.15;
        break;
      case "maintenance":
        break;
    }

    return Math.round(totalCalories);
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const dailyCalories = calculateDailyCalories();

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          durationDays: parseInt(durationDays),
          maxBudget: parseInt(maxBudget),
          calorieTarget: dailyCalories,
          dietaryRestrictions: allergies,
        },
      });

      if (error) throw error;

      // Save to Supabase
      const { data: planData, error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          start_date: new Date().toISOString(),
          duration_days: parseInt(durationDays),
          budget_max: parseInt(maxBudget),
          cheat_meal_day: 7, // Default to Sunday
        })
        .select()
        .single();

      if (planError) throw planError;

      setGeneratedPlan(data.mealPlan);
      toast({
        title: "Plan alimentaire généré",
        description: `Plan sur ${durationDays} jours avec un budget de ${maxBudget}€`,
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le plan alimentaire",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Générer un plan alimentaire personnalisé</CardTitle>
        </CardHeader>
        <CardContent>
          <MealPlanForm
            durationDays={durationDays}
            maxBudget={maxBudget}
            isGenerating={isGenerating}
            onDurationChange={setDurationDays}
            onBudgetChange={setMaxBudget}
            onGenerate={generateMealPlan}
          />
        </CardContent>
      </Card>

      {generatedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Votre plan alimentaire</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="w-full flex-wrap h-auto">
                {Array.from({ length: parseInt(durationDays) }, (_, i) => (
                  <TabsTrigger key={i + 1} value={(i + 1).toString()} className="flex-1">
                    Jour {i + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {generatedPlan.map((day: any, index: number) => (
                <TabsContent key={index} value={(index + 1).toString()}>
                  <DayMeals meals={day.meals} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};