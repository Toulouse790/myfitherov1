
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { calculateBMR, getActivityMultiplier, getObjectiveMultiplier } from "./nutrition/use-bmr-calculation";
import { calculateExerciseCalories, calculateTotalDailyCalories } from "@/utils/calorieCalculation";
import { muscleRecoveryData, calculateRecoveryNeeds } from "@/utils/workoutPlanning";

interface PhysiologicalData {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: string;
  objective: string;
}

export const usePhysiologicalMetrics = () => {
  const { user } = useAuth();

  const fetchUserPhysiologicalData = useCallback(async () => {
    if (!user) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('age, weight_kg, height_cm, gender, experience_level, main_objective')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        age: profile.age || 30, // Valeur par défaut
        weight: profile.weight_kg || 70,
        height: profile.height_cm || 170,
        gender: profile.gender || 'male',
        activityLevel: profile.experience_level || 'moderately_active',
        objective: profile.main_objective || 'maintenance'
      } as PhysiologicalData;
    } catch (error) {
      console.error("Erreur lors de la récupération des données physiologiques:", error);
      return null;
    }
  }, [user]);

  const calculateDailyCalories = useCallback(async (data: PhysiologicalData) => {
    // Calculer le BMR de base
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
    
    // Appliquer les multiplicateurs d'activité et d'objectif
    const activityMultiplier = getActivityMultiplier(data.activityLevel);
    const objectiveMultiplier = getObjectiveMultiplier(data.objective);
    
    // Appeler la fonction RPC pour obtenir un calcul plus précis basé sur le genre
    const { data: adjustedCalories, error } = await supabase
      .rpc('calculate_calories_by_gender', {
        base_calories: bmr,
        gender: data.gender,
        weight_kg: data.weight,
        height_cm: data.height,
        age: data.age
      });

    if (error) {
      console.error("Erreur lors du calcul des calories:", error);
      // Fallback sur le calcul local si l'appel à la base de données échoue
      return Math.round(bmr * activityMultiplier * objectiveMultiplier);
    }

    // Appliquer le multiplicateur d'objectif au résultat ajusté
    return Math.round(adjustedCalories * objectiveMultiplier);
  }, []);

  const calculateExerciseRecommendations = useCallback(async (data: PhysiologicalData) => {
    // Récupérer l'historique des entraînements de l'utilisateur
    const { data: workoutHistory, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Erreur lors de la récupération de l'historique d'entraînement:", error);
      return {
        recommendedIntensity: data.activityLevel === 'beginner' ? 0.7 : 0.8,
        recommendedVolume: data.activityLevel === 'beginner' ? 12 : 16,
        musclesNeedingRest: []
      };
    }

    // Identifier les muscles qui ont besoin de repos
    const musclesNeedingRest = new Set<string>();
    const now = new Date();

    workoutHistory.forEach(session => {
      if (!session.muscle_groups_worked) return;
      
      session.muscle_groups_worked.forEach((muscleGroup: string) => {
        const sessionDate = new Date(session.created_at);
        const hoursSince = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);
        
        // Récupérer les données de récupération pour ce groupe musculaire
        const recoveryData = muscleRecoveryData[muscleGroup];
        if (!recoveryData) return;
        
        // Vérifier si le muscle a besoin de repos
        if (hoursSince < recoveryData.recoveryTime) {
          musclesNeedingRest.add(muscleGroup);
          
          // Ajouter les muscles synergistes
          recoveryData.synergistMuscles.forEach(synergist => {
            musclesNeedingRest.add(synergist);
          });
        }
      });
    });

    // Déterminer l'intensité et le volume recommandés
    let recommendedIntensity = 0.8;
    let recommendedVolume = 16;

    switch (data.activityLevel) {
      case 'beginner':
        recommendedIntensity = 0.6;
        recommendedVolume = 12;
        break;
      case 'intermediate':
        recommendedIntensity = 0.75;
        recommendedVolume = 16;
        break;
      case 'advanced':
        recommendedIntensity = 0.85;
        recommendedVolume = 20;
        break;
    }

    // Ajuster en fonction de l'objectif
    if (data.objective === 'muscle_gain') {
      recommendedIntensity += 0.05;
      recommendedVolume += 4;
    } else if (data.objective === 'weight_loss') {
      recommendedIntensity -= 0.05;
      recommendedVolume += 2; // Plus de répétitions pour brûler plus de calories
    }

    return {
      recommendedIntensity: Math.min(recommendedIntensity, 0.95), // Cap à 0.95
      recommendedVolume: recommendedVolume,
      musclesNeedingRest: Array.from(musclesNeedingRest)
    };
  }, [user]);

  const calculateNutrientTargets = useCallback(async (data: PhysiologicalData) => {
    const dailyCalories = await calculateDailyCalories(data);
    
    // Calculer les macros en fonction de l'objectif
    let proteinPerKg = 1.6; // g/kg de poids corporel
    let fatPercentage = 0.25; // 25% des calories
    let carbPercentage = 0.55; // 55% des calories
    
    if (data.objective === 'muscle_gain') {
      proteinPerKg = 2.0;
      fatPercentage = 0.25;
      carbPercentage = 0.55;
    } else if (data.objective === 'weight_loss') {
      proteinPerKg = 2.2; // Augmenter pour préserver la masse musculaire
      fatPercentage = 0.3; // Légèrement plus de gras pour la satiété
      carbPercentage = 0.45; // Réduire les glucides
    }
    
    const proteinGrams = Math.round(data.weight * proteinPerKg);
    const fatGrams = Math.round((dailyCalories * fatPercentage) / 9); // 9 calories par gramme de lipides
    const carbGrams = Math.round((dailyCalories * carbPercentage) / 4); // 4 calories par gramme de glucides
    
    return {
      calories: dailyCalories,
      proteins: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      fiber: Math.round(data.weight * 0.25), // Recommandation générale: 25g par 1000 kcal
      water: Math.round(data.weight * 0.033) // 33ml par kg de poids corporel
    };
  }, [calculateDailyCalories]);

  // Correction: transformons cette fonction pour gérer correctement la promesse
  const calculateCaloriesBurned = useCallback(async (duration: number, intensity: string, gender: string) => {
    try {
      const physiologicalData = await fetchUserPhysiologicalData();
      if (!physiologicalData) return 0;
      
      return calculateExerciseCalories(
        physiologicalData.weight,
        duration,
        intensity as 'low' | 'moderate' | 'high',
        gender as 'male' | 'female'
      );
    } catch (error) {
      console.error("Erreur lors du calcul des calories brûlées:", error);
      return 0;
    }
  }, [fetchUserPhysiologicalData]);

  return {
    fetchUserPhysiologicalData,
    calculateDailyCalories,
    calculateExerciseRecommendations,
    calculateNutrientTargets,
    calculateCaloriesBurned
  };
};
