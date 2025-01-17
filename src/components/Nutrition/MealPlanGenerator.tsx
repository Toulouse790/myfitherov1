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
        await handleGenerateShoppingList(preferences.dietType);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const adjustQuantitiesForDietType = (items: Map<string, { amount: number; unit: string }>, dietType: string) => {
    const adjustedItems = new Map(items);
    
    switch (dietType) {
      case "highProtein":
        // Augmenter les protéines pour la prise de masse
        adjustedItems.forEach((details, item) => {
          if (item.toLowerCase().includes("poulet") || 
              item.toLowerCase().includes("boeuf") || 
              item.toLowerCase().includes("poisson") ||
              item.toLowerCase().includes("oeuf") ||
              item.toLowerCase().includes("protéine")) {
            details.amount = Math.round(details.amount * 1.5); // +50% de protéines
          }
        });
        break;
      case "lowCarb":
        // Réduire les glucides pour la sèche extrême
        adjustedItems.forEach((details, item) => {
          if (item.toLowerCase().includes("riz") || 
              item.toLowerCase().includes("pâtes") || 
              item.toLowerCase().includes("pain") ||
              item.toLowerCase().includes("pomme de terre")) {
            details.amount = Math.round(details.amount * 0.5); // -50% de glucides
          }
          if (item.toLowerCase().includes("poulet") || 
              item.toLowerCase().includes("poisson")) {
            details.amount = Math.round(details.amount * 1.2); // +20% de protéines maigres
          }
        });
        break;
      // Le cas "balanced" reste inchangé
    }
    
    return adjustedItems;
  };

  const handleGenerateShoppingList = async (dietType: string = 'balanced') => {
    try {
      console.log("Generating shopping list for", selectedDuration, "days with diet type:", dietType);
      
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

      const daysToProcess = Math.min(selectedDuration, planData.length);

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

      // Ajuster les quantités en fonction du type de régime
      const adjustedShoppingList = adjustQuantitiesForDietType(shoppingList, dietType);

      const formattedList = Array.from(adjustedShoppingList.entries())
        .map(([item, details]) => `${item}: ${details.amount}${details.unit}`);

      setShoppingList(formattedList);

      toast({
        title: "Liste de courses générée",
        description: `Liste générée pour ${selectedDuration} jours (${dietType})`,
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