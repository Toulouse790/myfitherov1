import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MealPlanGenerator = () => {
  const { toast } = useToast();
  const {
    isGenerating,
    durationDays,
    maxBudget,
    generatedPlan,
    setDurationDays,
    setMaxBudget,
    generateMealPlan,
  } = useMealPlanGenerator();

  const saveMealPlanToJournal = async (plan: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Supprimer les anciens repas pour aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await supabase
        .from('food_journal_entries')
        .delete()
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      // Ajouter les nouveaux repas
      const entries = Object.entries(plan).map(([mealType, meal]: [string, any]) => ({
        user_id: user.id,
        name: meal.name,
        calories: meal.calories,
        proteins: meal.proteins,
        meal_type: mealType,
      }));

      const { error } = await supabase
        .from('food_journal_entries')
        .insert(entries);

      if (error) throw error;

      toast({
        title: "Plan de repas enregistré",
        description: "Les repas ont été ajoutés à votre journal alimentaire",
      });
    } catch (error) {
      console.error('Error saving meal plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le plan de repas",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMealPlan = async () => {
    await generateMealPlan();
    if (generatedPlan?.[0]?.meals) {
      await saveMealPlanToJournal(generatedPlan[0].meals);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Générer un plan alimentaire personnalisé</CardTitle>
            <Lock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">(Premium - Mode démo)</span>
          </div>
        </CardHeader>
        <CardContent>
          <MealPlanForm
            durationDays={durationDays}
            maxBudget={maxBudget}
            isGenerating={isGenerating}
            onDurationChange={setDurationDays}
            onBudgetChange={setMaxBudget}
            onGenerate={handleGenerateMealPlan}
          />
        </CardContent>
      </Card>

      {generatedPlan && (
        <GeneratedPlanDisplay 
          generatedPlan={generatedPlan}
          durationDays={durationDays}
        />
      )}
    </div>
  );
};