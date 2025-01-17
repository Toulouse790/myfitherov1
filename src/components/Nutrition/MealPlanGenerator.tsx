import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { ActiveMealPlans } from "./MealPlan/ActiveMealPlans";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";
import { useMealPlanSave } from "@/hooks/use-meal-plan-save";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [showShoppingList, setShowShoppingList] = useState(false);

  const handleGenerateMealPlan = async (preferences: MealPlanPreferences) => {
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan();
      if (plan?.[0]) {
        console.log("Generated plan to save:", plan[0]);
        await saveMealPlanToJournal(plan[0], preferences.duration);
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

      const today = new Date();
      const { data: plans, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .gte('end_date', today.toISOString())
        .order('start_date', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

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

      planData.forEach(day => {
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
      });

      const formattedList = Array.from(shoppingList.entries())
        .map(([item, details]) => `${item}: ${details.amount}${details.unit}`);

      setShoppingList(formattedList);
      setShowShoppingList(true);

      toast({
        title: "Liste de courses générée",
        description: "Votre liste de courses est prête !",
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

      <Button 
        className="w-full"
        variant="outline"
        onClick={handleGenerateShoppingList}
      >
        Générer ta liste de courses
      </Button>

      <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Liste de courses</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] p-4">
            <ul className="space-y-2">
              {shoppingList.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ActiveMealPlans />

      {generatedPlan && (
        <GeneratedPlanDisplay 
          generatedPlan={generatedPlan}
          durationDays={generatedPlan[0]?.duration || "7"}
        />
      )}
    </div>
  );
};