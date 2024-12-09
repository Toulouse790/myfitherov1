import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, CalendarCheck, Dumbbell, Apple } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { ActiveMealPlans } from "./MealPlan/ActiveMealPlans";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";
import { useMealPlanSave } from "@/hooks/use-meal-plan-save";

export const MealPlanGenerator = () => {
  const {
    isGenerating,
    durationDays,
    maxBudget,
    generatedPlan,
    setDurationDays,
    setMaxBudget,
    generateMealPlan,
  } = useMealPlanGenerator();

  const { saveMealPlanToJournal } = useMealPlanSave();

  const handleGenerateMealPlan = async () => {
    const plan = await generateMealPlan();
    if (plan?.[0]) {
      console.log("Generated plan to save:", plan[0]);
      await saveMealPlanToJournal(plan[0], durationDays);
    }
  };

  return (
    <div className="space-y-4">
      <ActiveMealPlans />

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