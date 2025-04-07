
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutSuggestion } from "../types";
import { defaultSuggestions } from "../defaultSuggestions";
import { databaseSuggestions } from "../databaseSuggestions";
import { useAuth } from "@/hooks/use-auth";

export const useWorkoutSuggestions = () => {
  const [localSuggestions, setLocalSuggestions] = useState<WorkoutSuggestion[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Récupérer les suggestions depuis la base de données
  const { data: dbSuggestions = [], isLoading, error } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('workout_suggestions')
          .select('*')
          .eq('is_active', true)
          .order('suggested_order', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: t("common.error"),
          description: t("workouts.generationErrorDescription"),
          variant: "destructive",
        });
        return [];
      }
    },
    retry: 1,
  });

  // Récupérer l'historique des entraînements pour personnaliser l'ordre des suggestions
  const { data: workoutHistory } = useQuery({
    queryKey: ['workout-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('workout_type, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching workout history:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Récupérer le profil utilisateur pour personnaliser davantage les suggestions
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('experience_level, main_objective, available_equipment')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!user,
  });

  // Récupérer les données de récupération musculaire pour éviter la surcharge
  const { data: muscleRecoveryData } = useQuery({
    queryKey: ['muscle-recovery', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const { data, error } = await supabase
          .from('muscle_recovery')
          .select('muscle_group, recovery_status, last_trained_at')
          .eq('user_id', user.id)
          .order('last_trained_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching muscle recovery data:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Mélanger et prioriser les suggestions en fonction de l'historique d'entraînement et du profil utilisateur
  useEffect(() => {
    // Si nous avons des suggestions de la base de données, utilisez-les, sinon utilisez les suggestions par défaut
    let combinedSuggestions: WorkoutSuggestion[] = [];
    
    if (dbSuggestions && dbSuggestions.length > 0) {
      // Convertir les données de la base de données en format WorkoutSuggestion
      combinedSuggestions = dbSuggestions.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        duration: item.estimated_duration,
        difficulty: Array.isArray(item.difficulty_levels) && item.difficulty_levels.length > 0 
          ? item.difficulty_levels[0] 
          : null,
        muscleGroups: item.muscle_groups || []
      }));
    } else if (databaseSuggestions && databaseSuggestions.length > 0) {
      // Utiliser les suggestions de la base de données locale si l'API échoue
      combinedSuggestions = databaseSuggestions.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        duration: null,
        difficulty: null,
        muscleGroups: []
      }));
    } else {
      // Fallback vers les suggestions par défaut
      combinedSuggestions = [...defaultSuggestions];
    }
    
    // Filtrer les suggestions en fonction du profil utilisateur
    if (userProfile) {
      // Filtrer par niveau d'expérience
      if (userProfile.experience_level) {
        combinedSuggestions = combinedSuggestions.filter(suggestion => {
          if (!suggestion.difficulty) return true;
          
          // Correspondance des niveaux de difficulté avec l'expérience
          const difficultyMapping: Record<string, string[]> = {
            'beginner': ['easy', 'beginner', 'facile', 'débutant'],
            'intermediate': ['moderate', 'intermediate', 'modéré', 'intermédiaire'],
            'advanced': ['challenging', 'advanced', 'difficile', 'avancé', 'intense']
          };
          
          // Vérifier si la difficulté correspond au niveau d'expérience
          return !suggestion.difficulty || 
                 difficultyMapping[userProfile.experience_level]?.includes(suggestion.difficulty.toLowerCase());
        });
      }
      
      // Filtrer par équipement disponible
      if (userProfile.available_equipment && userProfile.available_equipment.length > 0) {
        // Pour l'instant, nous n'avons pas d'informations d'équipement dans les suggestions
        // Cette partie peut être développée quand les données d'équipement seront disponibles
      }
      
      // Adapter en fonction de l'objectif principal
      if (userProfile.main_objective) {
        // Prioriser les types d'entraînement qui correspondent à l'objectif
        const objectiveMapping: Record<string, string[]> = {
          'muscle_gain': ['strength', 'hypertrophy'],
          'weight_loss': ['cardio', 'hiit', 'circuit'],
          'endurance': ['cardio', 'endurance'],
          'general_fitness': ['full_body', 'functional'],
          'sport_specific': ['sport_specific', 'athletic']
        };
        
        // Priorité plus élevée pour les entraînements correspondant à l'objectif
        const targetTypes = objectiveMapping[userProfile.main_objective] || [];
        if (targetTypes.length > 0) {
          combinedSuggestions.sort((a, b) => {
            const aMatchesObjective = targetTypes.includes(a.type);
            const bMatchesObjective = targetTypes.includes(b.type);
            
            if (aMatchesObjective && !bMatchesObjective) return -1;
            if (!aMatchesObjective && bMatchesObjective) return 1;
            return 0;
          });
        }
      }
    }
    
    // Éviter les groupes musculaires récemment entraînés
    if (muscleRecoveryData && muscleRecoveryData.length > 0) {
      // Identifier les groupes musculaires qui ont besoin de récupération
      const recoveringMuscleGroups = muscleRecoveryData
        .filter(m => m.recovery_status === 'recovering')
        .map(m => m.muscle_group);
      
      if (recoveringMuscleGroups.length > 0) {
        // Déplacer les suggestions ciblant ces groupes musculaires vers le bas
        combinedSuggestions.sort((a, b) => {
          const aTargetsRecovering = a.muscleGroups?.some(mg => recoveringMuscleGroups.includes(mg));
          const bTargetsRecovering = b.muscleGroups?.some(mg => recoveringMuscleGroups.includes(mg));
          
          if (aTargetsRecovering && !bTargetsRecovering) return 1;
          if (!aTargetsRecovering && bTargetsRecovering) return -1;
          return 0;
        });
      }
    }
    
    // Personnaliser l'ordre en fonction de l'historique d'entraînement
    if (workoutHistory && workoutHistory.length > 0) {
      // Identifier les types d'entraînement récemment utilisés
      const recentTypes = new Set(workoutHistory.slice(0, 3).map(w => w.workout_type));
      
      // Analyser les types que l'utilisateur n'a pas fait récemment
      const lastTrainingDate = new Map();
      workoutHistory.forEach(w => {
        if (!lastTrainingDate.has(w.workout_type)) {
          lastTrainingDate.set(w.workout_type, new Date(w.created_at));
        }
      });
      
      // Trier les suggestions pour varier l'entraînement
      combinedSuggestions.sort((a, b) => {
        // Obtenir le temps écoulé depuis le dernier entraînement de ce type
        const typeA = a.type;
        const typeB = b.type;
        
        const lastUsedA = lastTrainingDate.get(typeA);
        const lastUsedB = lastTrainingDate.get(typeB);
        
        // Si un type n'a jamais été utilisé, le prioriser
        if (!lastUsedA && lastUsedB) return -1;
        if (lastUsedA && !lastUsedB) return 1;
        if (!lastUsedA && !lastUsedB) return 0;
        
        // Prioriser les types les moins récemment utilisés
        return lastUsedA.getTime() - lastUsedB.getTime();
      });
    } else {
      // Si pas d'historique, mélanger aléatoirement pour varier
      for (let i = combinedSuggestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedSuggestions[i], combinedSuggestions[j]] = [combinedSuggestions[j], combinedSuggestions[i]];
      }
    }
    
    // Limiter le nombre de suggestions "quick" pour éviter de trop afficher cette option
    const quickSuggestions = combinedSuggestions.filter(s => s.type === 'quick');
    if (quickSuggestions.length > 1) {
      const quickIndex = combinedSuggestions.findIndex(s => s.type === 'quick');
      if (quickIndex !== -1) {
        combinedSuggestions.splice(quickIndex, 1);
      }
    }
    
    setLocalSuggestions(combinedSuggestions);
  }, [dbSuggestions, workoutHistory, userProfile, muscleRecoveryData]);

  return {
    localSuggestions,
    isLoading
  };
};
