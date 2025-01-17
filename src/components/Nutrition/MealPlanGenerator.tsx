import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { ActiveMealPlans } from "./MealPlan/ActiveMealPlans";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";
import { useMealPlanSave } from "@/hooks/use-meal-plan-save";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingList } from "./MealPlan/ShoppingList";
import { GenerateShoppingListButton } from "./MealPlan/GenerateShoppingListButton";

interface MealPlanPreferences {
  duration: string;
  dietType: string;
}

export const MealPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generatedPlan, generateMealPlan } = useMealPlanGenerator();
  const { saveMealPlanToJournal } = useMealPlanSave();
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateMealPlan = async (preferences: MealPlanPreferences) => {
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan(selectedDuration);
      if (plan?.[0]) {
        console.log("Generated plan to save:", plan[0]);
        await saveMealPlanToJournal(plan[0], preferences.duration);
        // Generate shopping list automatically after plan generation
        await handleGenerateShoppingList();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateShoppingList = async () => {
    try {
      console.log("Generating shopping list for", selectedDuration, "days");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour générer une liste de courses",
          variant: "destructive",
        });
        return;
      }

      const { data: plans, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!plans || plans.length === 0) {
        toast({
          title: "Aucun plan actif",
          description: "Générez d'abord un plan de repas pour obtenir une liste de courses",
          variant: "destructive",
        });
        return;
      }

      const planData = plans[0].plan_data;
      const shoppingList = new Map();

      // Calculer le nombre de jours à prendre en compte
      const daysToProcess = Math.min(selectedDuration, planData.length);

      // Ne traiter que le nombre de jours sélectionné
      for (let i = 0; i < daysToProcess; i++) {
        const day = planData[i];
        Object.values(day).forEach((meal: any) => {
          if (meal.quantities) {
            meal.quantities.forEach((item: any) => {
              const [amount, unit] = item.amount.split(' ');
              const numAmount = parseFloat(amount);
              
              if (shoppingList.has(item.item)) {
                shoppingList.set(item.item, {
                  amount: shoppingList.get(item.item).amount + numAmount,
                  unit: unit || 'g'
                });
              } else {
                shoppingList.set(item.item, {
                  amount: numAmount,
                  unit: unit || 'g'
                });
              }
            });
          }
        });
      }

      const formattedList = Array.from(shoppingList.entries())
        .map(([item, details]) => `${item}: ${details.amount}${details.unit}`);

      setShoppingList(formattedList);

      toast({
        title: "Liste de courses générée",
        description: `Liste générée pour ${selectedDuration} jours`,
      });

    } catch (error) {
      console.error("Error generating shopping list:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la liste de courses pour le moment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>
              Plan alimentaire personnalisé
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>(Premium - Mode démo)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex justify-center gap-2 mb-4">
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant={selectedDuration === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDuration(days)}
                >
                  {days} jours
                </Button>
              ))}
            </div>

            <MealPlanForm onGenerate={handleGenerateMealPlan} />
          </div>
        </CardContent>
      </Card>

      {shoppingList.length > 0 && (
        <ShoppingList items={shoppingList} />
      )}

      <ActiveMealPlans shoppingList={shoppingList} />

      {generatedPlan && (
        <GeneratedPlanDisplay 
          generatedPlan={generatedPlan}
          durationDays={selectedDuration.toString()}
        />
      )}
    </div>
  );
};