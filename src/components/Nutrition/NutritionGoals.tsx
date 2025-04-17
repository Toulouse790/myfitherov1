
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
          setProfileData({
            ...profile,
            questionnaire
          });
        } else {
          setProfileData(profile);
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

  // Calculer les objectifs caloriques basés sur le profil si disponible
  const getTargets = () => {
    // Si les dailyTargets sont déjà calculés par le hook, les utiliser
    if (dailyTargets?.calories > 0) {
      return dailyTargets;
    }

    // Sinon, calculer les objectifs basés sur le profil si disponible
    if (profileData) {
      const weight = profileData.weight_kg || 70;
      const height = profileData.height_cm || 170;
      const age = profileData.age || 30;
      const gender = profileData.gender || 'male';
      const objective = profileData.main_objective || (profileData.questionnaire?.objective || 'maintenance');
      const activityLevel = profileData.experience_level || (profileData.questionnaire?.experience_level || 'moderately_active');

      // Calculer les besoins caloriques quotidiens
      const bmr = calculateBMR(weight, height, age, gender);
      const activityMultiplier = getActivityMultiplier(activityLevel);
      const objectiveMultiplier = getObjectiveMultiplier(objective);
      const dailyCalories = Math.round(bmr * activityMultiplier * objectiveMultiplier);

      // Calculer les macros
      let proteinMultiplier = 2;
      if (objective === 'weight_loss') {
        proteinMultiplier = 2.2;
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
    }

    // Valeurs par défaut si aucun profil n'est disponible
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
