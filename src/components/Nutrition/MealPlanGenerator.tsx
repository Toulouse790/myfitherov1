import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, CalendarCheck, Dumbbell, Apple } from "lucide-react";
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
      console.log("Saving meal plan to journal:", plan);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Supprimer les anciens repas pour aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { error: deleteError } = await supabase
        .from('food_journal_entries')
        .delete()
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (deleteError) {
        console.error('Error deleting old entries:', deleteError);
        throw deleteError;
      }

      // Transformer le plan en entrées de journal
      const entries = [];

      // Ajouter le petit-déjeuner
      if (plan.breakfast) {
        entries.push({
          user_id: user.id,
          name: plan.breakfast.name,
          calories: plan.breakfast.calories,
          proteins: plan.breakfast.proteins,
          meal_type: 'breakfast',
          notes: plan.breakfast.preparation || ''
        });
      }

      // Ajouter le déjeuner
      if (plan.lunch) {
        entries.push({
          user_id: user.id,
          name: plan.lunch.name,
          calories: plan.lunch.calories,
          proteins: plan.lunch.proteins,
          meal_type: 'lunch',
          notes: plan.lunch.preparation || ''
        });
      }

      // Ajouter le dîner
      if (plan.dinner) {
        entries.push({
          user_id: user.id,
          name: plan.dinner.name,
          calories: plan.dinner.calories,
          proteins: plan.dinner.proteins,
          meal_type: 'dinner',
          notes: plan.dinner.preparation || ''
        });
      }

      // Ajouter la collation
      if (plan.snack) {
        entries.push({
          user_id: user.id,
          name: plan.snack.name,
          calories: plan.snack.calories,
          proteins: plan.snack.proteins,
          meal_type: 'snack',
          notes: plan.snack.preparation || ''
        });
      }

      console.log("Inserting entries:", entries);
      const { error: insertError } = await supabase
        .from('food_journal_entries')
        .insert(entries);

      if (insertError) {
        console.error('Error inserting entries:', insertError);
        throw insertError;
      }

      // Sauvegarder le plan complet dans la table meal_plans
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(durationDays) - 1);

      const { error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          plan_data: generatedPlan
        });

      if (planError) {
        console.error('Error saving meal plan:', planError);
        throw planError;
      }

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
    const plan = await generateMealPlan();
    if (plan?.[0]) {
      console.log("Generated plan to save:", plan[0]);
      await saveMealPlanToJournal(plan[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Générer un plan alimentaire personnalisé
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>(Premium - Mode démo)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span>Adapté à vos objectifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Apple className="h-4 w-4" />
                <span>Basé sur vos préférences</span>
              </div>
            </div>

            <MealPlanForm
              durationDays={durationDays}
              maxBudget={maxBudget}
              isGenerating={isGenerating}
              onDurationChange={setDurationDays}
              onBudgetChange={setMaxBudget}
              onGenerate={handleGenerateMealPlan}
            />
          </div>
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