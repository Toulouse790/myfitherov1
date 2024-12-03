import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { defaultMeals, generateVariedMealPlan } from "@/data/meals";
import { supabase } from "@/integrations/supabase/client";

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
    // Formule de Harris-Benedict pour le métabolisme de base
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    
    // Facteur d'activité basé sur le nombre d'entraînements
    const activityFactor = 1.2 + (workoutsPerWeek * 0.1);
    
    // Calories totales avec ajustement selon l'objectif
    let totalCalories = bmr * activityFactor;

    switch (goal) {
      case "weight_loss":
        totalCalories *= 0.85; // Déficit calorique de 15%
        break;
      case "muscle_gain":
        totalCalories *= 1.15; // Surplus calorique de 15%
        break;
      case "maintenance":
        break;
    }

    return Math.round(totalCalories);
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour générer un plan",
          variant: "destructive",
        });
        return;
      }

      // Récupérer les préférences de l'utilisateur
      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('allergies, intolerances, excluded_foods')
        .eq('user_id', user.id)
        .single();

      const dailyCalories = calculateDailyCalories();
      const mockPlan = generateVariedMealPlan(
        parseInt(durationDays),
        preferences?.excluded_foods || [],
        preferences?.allergies || [],
        preferences?.intolerances || [],
        dailyCalories
      );

      setGeneratedPlan(mockPlan);
      toast({
        title: "Plan alimentaire généré",
        description: `Plan personnalisé sur ${durationDays} jours avec un budget de ${maxBudget}€`,
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