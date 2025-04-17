
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { calculateBMR, getActivityMultiplier, getObjectiveMultiplier } from "@/hooks/nutrition/use-bmr-calculation";

export const NutritionGoals = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [calculatedTargets, setCalculatedTargets] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer les données de profil de l'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Récupérer les réponses au questionnaire les plus récentes
        const { data: questionnaire, error: questionnaireError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (questionnaire) {
          console.log("Données du questionnaire:", questionnaire);
          
          // Conversion explicite des valeurs en nombres
          if (questionnaire.weight) questionnaire.weight = Number(questionnaire.weight);
          if (questionnaire.height) questionnaire.height = Number(questionnaire.height);
          if (questionnaire.age) questionnaire.age = Number(questionnaire.age);
          
          const combinedData = {
            ...profile,
            questionnaire
          };
          
          setProfileData(combinedData);
          setCalculatedTargets(calculateTargets(combinedData));
        } else {
          console.log("Pas de données de questionnaire trouvées");
          setProfileData(profile);
          setCalculatedTargets(calculateTargets(profile));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, [user]);

  const calculateProgress = (consumed: number = 0, target: number = 0) => {
    if (!target) return 0;
    return Math.min(Math.round((consumed / target) * 100), 100);
  };

  // Fonction pour calculer les objectifs caloriques basés sur le profil
  const calculateTargets = (data: any) => {
    if (!data) return null;

    const weight = data.weight_kg || (data.questionnaire?.weight ? Number(data.questionnaire.weight) : 70);
    const height = data.height_cm || (data.questionnaire?.height ? Number(data.questionnaire.height) : 170);
    const age = data.age || (data.questionnaire?.age ? Number(data.questionnaire.age) : 30);
    const gender = data.gender || (data.questionnaire?.gender || 'male');
    const objective = data.main_objective || (data.questionnaire?.objective || 'maintenance');
    const activityLevel = data.experience_level || (data.questionnaire?.experience_level || 'moderately_active');

    console.log("Calcul des besoins caloriques avec:", {
      weight, height, age, gender, objective, activityLevel
    });

    // Calculer les besoins caloriques quotidiens
    const bmr = calculateBMR(weight, height, age, gender);
    const activityMultiplier = getActivityMultiplier(activityLevel);
    const objectiveMultiplier = getObjectiveMultiplier(objective);
    const dailyCalories = Math.round(bmr * activityMultiplier * objectiveMultiplier);

    console.log("BMR calculé:", bmr);
    console.log("Après multiplicateurs:", dailyCalories);

    // Calculer les macros
    let proteinMultiplier = 2; // g/kg de poids corporel
    if (objective === 'weight_loss') {
      proteinMultiplier = 2.2; // Plus de protéines pour préserver la masse musculaire
    } else if (objective === 'muscle_gain') {
      proteinMultiplier = 2;
    }
    
    const dailyProteins = Math.round(weight * proteinMultiplier);
    const dailyCarbs = Math.round((dailyCalories * 0.45) / 4); // 45% des calories proviennent des glucides
    const dailyFats = Math.round((dailyCalories * 0.25) / 9); // 25% des calories proviennent des lipides

    return {
      calories: dailyCalories,
      proteins: dailyProteins,
      carbs: dailyCarbs,
      fats: dailyFats
    };
  };

  // Utiliser les objectifs calculés ou les objectifs du hook, ou des valeurs par défaut
  const getTargets = () => {
    // Priorité 1: Objectifs du hook dailyTargets
    if (dailyTargets?.calories && dailyTargets.calories > 0) {
      console.log("Utilisation des objectifs du hook:", dailyTargets);
      return dailyTargets;
    }
    
    // Priorité 2: Objectifs calculés localement à partir des données du profil
    if (calculatedTargets?.calories && calculatedTargets.calories > 0) {
      console.log("Utilisation des objectifs calculés localement:", calculatedTargets);
      return calculatedTargets;
    }
    
    // Valeurs par défaut en dernier recours
    console.log("Utilisation des valeurs par défaut");
    return {
      calories: 2000,
      proteins: 80,
      carbs: 250,
      fats: 65
    };
  };

  const targets = getTargets();
  
  const consumed = consumedNutrients || {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  };

  if (loading) {
    return (
      <Card className="p-4 sm:p-6 bg-[#F1F0FB] border border-[#D6BCFA]/20 rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{t("nutrition.goals")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-[#F1F0FB] border border-[#D6BCFA]/20 rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{t("nutrition.goals")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>{t("nutrition.calories")}</span>
            <span>{consumed.calories} / {targets.calories} cal</span>
          </div>
          <Progress value={calculateProgress(consumed.calories, targets.calories)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>{t("nutrition.proteins")}</span>
            <span>{consumed.proteins} / {targets.proteins}g</span>
          </div>
          <Progress value={calculateProgress(consumed.proteins, targets.proteins)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>{t("nutrition.carbs")}</span>
            <span>{consumed.carbs} / {targets.carbs}g</span>
          </div>
          <Progress value={calculateProgress(consumed.carbs, targets.carbs)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>{t("nutrition.fats")}</span>
            <span>{consumed.fats} / {targets.fats}g</span>
          </div>
          <Progress value={calculateProgress(consumed.fats, targets.fats)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
