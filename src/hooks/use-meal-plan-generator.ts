import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { defaultMeals, generateVariedMealPlan } from "@/data/meals/mealPlanGenerator";
import { supabase } from "@/integrations/supabase/client";

interface QuestionnaireData {
  objective: string;
  training_frequency: string;
  experience_level: string;
  diet_type: string;
}

export const useMealPlanGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [durationDays, setDurationDays] = useState("7");
  const [maxBudget, setMaxBudget] = useState("100");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);

  useEffect(() => {
    fetchQuestionnaireData();
  }, []);

  const fetchQuestionnaireData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('objective, training_frequency, experience_level, diet_type')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching questionnaire data:', error);
      return;
    }

    if (data) {
      setQuestionnaire(data);
    }
  };

  const calculateDailyCalories = () => {
    if (!questionnaire) return 2000; // Default value if no questionnaire data

    const baseCalories = 2000; // Base calories
    let multiplier = 1;

    // Adjust based on objective
    switch (questionnaire.objective) {
      case "weight_loss":
        multiplier *= 0.85;
        break;
      case "muscle_gain":
        multiplier *= 1.15;
        break;
      case "maintenance":
        break;
    }

    // Adjust based on training frequency
    const frequency = parseInt(questionnaire.training_frequency) || 3;
    multiplier *= (1 + (frequency * 0.05));

    // Adjust based on experience level
    switch (questionnaire.experience_level) {
      case "beginner":
        multiplier *= 0.95;
        break;
      case "intermediate":
        multiplier *= 1;
        break;
      case "advanced":
        multiplier *= 1.05;
        break;
    }

    return Math.round(baseCalories * multiplier);
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

      if (!questionnaire) {
        toast({
          title: "Erreur",
          description: "Veuillez d'abord remplir le questionnaire initial",
          variant: "destructive",
        });
        return;
      }

      // Get user preferences
      let { data: preferences, error: fetchError } = await supabase
        .from('user_nutrition_preferences')
        .select('allergies, intolerances, excluded_foods')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no preferences exist, create default ones
      if (!preferences) {
        const { data: newPreferences, error: insertError } = await supabase
          .from('user_nutrition_preferences')
          .insert({
            user_id: user.id,
            allergies: [],
            intolerances: [],
            excluded_foods: []
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating preferences:', insertError);
          toast({
            title: "Erreur",
            description: "Impossible de créer vos préférences alimentaires",
            variant: "destructive",
          });
          return;
        }
        preferences = newPreferences;
      }

      const userPreferences = preferences || {
        allergies: [],
        intolerances: [],
        excluded_foods: []
      };

      const dailyCalories = calculateDailyCalories();
      console.log("Generating meal plan with calories:", dailyCalories);
      console.log("User questionnaire data:", questionnaire);

      const mockPlan = generateVariedMealPlan(
        parseInt(durationDays),
        userPreferences.excluded_foods,
        userPreferences.allergies,
        userPreferences.intolerances,
        dailyCalories,
        questionnaire.diet_type
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