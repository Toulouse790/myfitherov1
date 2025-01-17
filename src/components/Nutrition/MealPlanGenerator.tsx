import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, CalendarCheck, Dumbbell, Apple } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { ActiveMealPlans } from "./MealPlan/ActiveMealPlans";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";
import { useMealPlanSave } from "@/hooks/use-meal-plan-save";
import { useState } from "react";

export const MealPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generatedPlan, generateMealPlan } = useMealPlanGenerator();
  const { saveMealPlanToJournal } = useMealPlanSave();

  const handleGenerateMealPlan = async (preferences: { duration: string, dietType: string }) => {
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan(preferences);
      if (plan?.[0]) {
        console.log("Generated plan to save:", plan[0]);
        await saveMealPlanToJournal(plan[0], parseInt(preferences.duration));
      }
    } finally {
      setIsGenerating(false);
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

            <MealPlanForm onGenerate={handleGenerateMealPlan} />
          </div>
        </CardContent>
      </Card>

      {generatedPlan && (
        <GeneratedPlanDisplay 
          generatedPlan={generatedPlan}
          durationDays={parseInt(generatedPlan[0]?.duration || "7")}
        />
      )}
    </div>
  );
};