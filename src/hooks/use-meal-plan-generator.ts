import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { defaultMeals } from "@/data/meals";

interface UseMealPlanGeneratorProps {
  workoutsPerWeek: number;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  weight: number;
  height: number;
  age: number;
}

export const useMealPlanGenerator = ({
  workoutsPerWeek,
  goal,
  weight,
  height,
  age,
}: UseMealPlanGeneratorProps) => {
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
      const mockPlan = Array.from({ length: parseInt(durationDays) }, (_, dayIndex) => ({
        meals: {
          breakfast: {
            ...defaultMeals.breakfast.meal,
          },
          lunch: {
            ...defaultMeals.lunch.meal,
          },
          dinner: {
            ...defaultMeals.dinner.meal,
          },
          snack: {
            ...defaultMeals.snack.meal,
          }
        }
      }));

      setGeneratedPlan(mockPlan);
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

  return {
    isGenerating,
    durationDays,
    maxBudget,
    generatedPlan,
    setDurationDays,
    setMaxBudget,
    generateMealPlan,
  };
};