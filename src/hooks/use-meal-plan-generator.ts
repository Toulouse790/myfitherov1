import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateVariedMealPlan } from "@/data/meals/mealPlanGenerator";

export const useMealPlanGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [durationDays, setDurationDays] = useState("7");
  const [maxBudget, setMaxBudget] = useState("100");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);

  // Fetch user preferences and questionnaire responses on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user preferences
      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserPreferences(preferences);

      // Fetch questionnaire responses
      const { data: questionnaireData } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setQuestionnaire(questionnaireData);
    };

    fetchUserData();
  }, []);

  const generateMealPlan = useCallback(async () => {
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

      // Calculate target calories based on objective
      const targetCalories = questionnaire?.objective === 'weight_loss' ? 1800 : 
        questionnaire?.objective === 'muscle_gain' ? 2500 : 2000;

      const plan = generateVariedMealPlan(
        parseInt(durationDays),
        userPreferences?.excluded_foods || [],
        userPreferences?.allergies || [],
        userPreferences?.intolerances || [],
        targetCalories,
        questionnaire?.diet_type || 'omnivore'
      );

      setGeneratedPlan(plan);
      toast({
        title: "Plan généré",
        description: "Votre plan alimentaire a été généré avec succès",
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du plan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [durationDays, maxBudget, toast, userPreferences, questionnaire]);

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