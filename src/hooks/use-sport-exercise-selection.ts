
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";
import { sportScienceRecommendations } from "@/utils/sport-specific-training/sportScienceData";

export const useSportExerciseSelection = (sportId?: string, positionId?: string) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sportData, setSportData] = useState<{
    sportName?: string;
    positionName?: string;
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchSportAndPositionDetails = async () => {
      if (!sportId || !positionId) return;
      
      try {
        const { data: sportData, error: sportError } = await supabase
          .from('sports')
          .select('name')
          .eq('id', sportId)
          .single();
        
        if (sportError) throw sportError;
        
        const { data: positionData, error: positionError } = await supabase
          .from('sport_positions')
          .select('name')
          .eq('id', positionId)
          .single();
        
        if (positionError) throw positionError;
        
        setSportData({
          sportName: sportData?.name?.toLowerCase(),
          positionName: positionData?.name?.toLowerCase()
        });
        
      } catch (error) {
        console.error("Erreur lors de la récupération des détails sport/position:", error);
      }
    };
    
    fetchSportAndPositionDetails();
  }, [sportId, positionId]);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!sportId || !positionId) {
        setExercises([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        debugLogger.log("SportExerciseSelection", "Chargement des exercices pour le sport:", sportId, "et le poste:", positionId);

        // Récupérer d'abord les exercices depuis Supabase
        const { data, error } = await supabase
          .from('sport_exercises_recommendations')
          .select(`
            *,
            exercise:unified_exercises(id, name)
          `)
          .eq('sport_id', sportId)
          .eq('position_id', positionId);

        if (error) {
          console.error("Erreur lors de la requête Supabase:", error);
          throw error;
        }

        debugLogger.log("SportExerciseSelection", "Données reçues de Supabase:", data);
        
        let exerciseNames: string[] = [];
        
        // Utiliser les données Supabase si disponibles
        if (data && data.length > 0) {
          exerciseNames = data.map(item => item.exercise.name);
        }
        // Sinon, essayer d'utiliser les données scientifiques
        else if (sportData.sportName && sportData.positionName) {
          const sportName = sportData.sportName;
          const positionName = sportData.positionName;
          
          // Normaliser le nom de position pour les ailiers (rugby vs autres sports)
          const normalizedPosition = positionName === 'ailier' && sportName === 'rugby' 
            ? 'ailier_rugby' 
            : positionName;
          
          // Récupérer les recommandations scientifiques
          const recommendations = 
            sportScienceRecommendations[sportName]?.[normalizedPosition] ||
            sportScienceRecommendations[sportName]?.['general'];
          
          if (recommendations) {
            exerciseNames = [
              ...recommendations.primaryExercises,
              ...recommendations.secondaryExercises
            ];
            
            debugLogger.log("SportExerciseSelection", "Utilisation des recommandations scientifiques:", exerciseNames);
          } else {
            // Fallback sur des exercices génériques
            exerciseNames = getFallbackExercises();
          }
        } else {
          // Si aucune donnée disponible, utiliser des exercices de secours
          exerciseNames = getFallbackExercises();
        }
        
        debugLogger.log("SportExerciseSelection", "Exercices finaux:", exerciseNames);
        setExercises(exerciseNames);

      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices spécifiques à ce sport",
          variant: "destructive",
        });
        
        // Utiliser des exercices de secours en cas d'erreur
        const fallbackExercises = getFallbackExercises();
        setExercises(fallbackExercises);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [sportId, positionId, sportData, toast]);

  // Fonction qui retourne des exercices de secours génériques
  const getFallbackExercises = (): string[] => {
    return [
      "Squat", 
      "Développé couché", 
      "Tractions", 
      "Fentes", 
      "Soulevé de terre",
      "Gainage", 
      "Sprint", 
      "Burpees"
    ];
  };

  // Retourne également les recommandations scientifiques complètes si disponibles
  const getScientificRecommendations = () => {
    if (!sportData.sportName || !sportData.positionName) return null;
    
    const sportName = sportData.sportName;
    const positionName = sportData.positionName;
    
    // Normaliser le nom de position pour les ailiers (rugby vs autres sports)
    const normalizedPosition = positionName === 'ailier' && sportName === 'rugby' 
      ? 'ailier_rugby' 
      : positionName;
    
    return sportScienceRecommendations[sportName]?.[normalizedPosition] ||
           sportScienceRecommendations[sportName]?.['general'] ||
           null;
  };

  return { 
    exercises, 
    isLoading,
    scientificRecommendations: getScientificRecommendations()
  };
};
