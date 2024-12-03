import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";

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
  const {
    isGenerating,
    durationDays,
    maxBudget,
    generatedPlan,
    setDurationDays,
    setMaxBudget,
    generateMealPlan,
  } = useMealPlanGenerator({
    workoutsPerWeek,
    goal,
    weight,
    height,
    age,
  });

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
            onGenerate={generateMealPlan}
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