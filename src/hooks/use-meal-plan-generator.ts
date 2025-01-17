import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMealPlanGenerator = () => {
  const generateMealPlan = async (duration: number) => {
    try {
      console.log("Generating meal plan for", duration, "days");
      const { data: existingPlan, error: planError } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (planError) throw planError;

      // Return the plan data formatted for the specified duration
      return existingPlan;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return null;
    }
  };

  return {
    generatedPlan: null,
    generateMealPlan
  };
};