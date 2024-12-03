import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

      const response = await fetch(
        'https://ipuvsaxyhzezuuhhmwcu.supabase.co/functions/v1/generate-meal-plan',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            durationDays: parseInt(durationDays),
            maxBudget: parseInt(maxBudget),
            calorieTarget: dailyCalories,
            dietaryRestrictions: allergies,
          }),
        }
      );

      const { mealPlan, error } = await response.json();

      if (error) throw new Error(error);

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

      // Save individual meals
      const mealItems = mealPlan.flatMap((day: any, index: number) => {
        return Object.entries(day.meals).map(([mealType, meal]: [string, any]) => ({
          meal_plan_id: planData.id,
          day_number: index + 1,
          meal_type: mealType,
          name: meal.name,
          calories: meal.calories,
          proteins: meal.proteins,
          carbs: meal.carbs,
          fats: meal.fats,
          estimated_cost: meal.estimated_cost,
          is_cheat_meal: meal.is_cheat_meal || false,
        }));
      });

      const { error: itemsError } = await supabase
        .from('meal_plan_items')
        .insert(mealItems);

      if (itemsError) throw itemsError;

      setGeneratedPlan(mealPlan);
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée du plan</Label>
              <Select value={durationDays} onValueChange={setDurationDays}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="14">14 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget maximum (€)</Label>
              <Input
                id="budget"
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Budget en euros"
              />
            </div>
          </div>

          <Button
            onClick={generateMealPlan}
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer un nouveau plan"
            )}
          </Button>
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
                  <div className="space-y-4">
                    {Object.entries(day.meals).map(([mealType, meal]: [string, any]) => (
                      <div key={mealType} className="p-4 rounded-lg bg-muted">
                        <h3 className="font-medium capitalize mb-2">{mealType}</h3>
                        <div className="space-y-1 text-sm">
                          <p>{meal.name}</p>
                          <p className="text-muted-foreground">
                            {meal.calories} kcal | {meal.proteins}g protéines | {meal.carbs}g glucides | {meal.fats}g lipides
                          </p>
                          <p className="text-primary">Coût estimé: {meal.estimated_cost}€</p>
                          {meal.is_cheat_meal && (
                            <p className="text-primary font-medium">Cheat meal 🎉</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};