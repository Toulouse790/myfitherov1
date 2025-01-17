import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, CalendarCheck } from "lucide-react";
import { MealPlanForm } from "./MealPlan/MealPlanForm";
import { GeneratedPlanDisplay } from "./MealPlan/GeneratedPlanDisplay";
import { ActiveMealPlans } from "./MealPlan/ActiveMealPlans";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";
import { useMealPlanSave } from "@/hooks/use-meal-plan-save";
import { useState } from "react";

interface MealPlanPreferences {
  duration: string;
  dietType: string;
}

export const MealPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generatedPlan, generateMealPlan } = useMealPlanGenerator();
  const { saveMealPlanToJournal } = useMealPlanSave();
  const [selectedDuration, setSelectedDuration] = useState(7);

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
        onClick={() => {
          // Trigger shopping list generation with selected duration
          console.log("Generating shopping list for", selectedDuration, "days");
        }}
      >
        Générer ta liste de courses
      </Button>

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