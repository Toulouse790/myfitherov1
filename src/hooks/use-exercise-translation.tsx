
import { useLanguage } from "@/contexts/LanguageContext";

export const useExerciseTranslation = () => {
  const { t } = useLanguage();

  // Traduction des niveaux de difficulté
  const translateDifficulty = (difficulty: string): string => {
    if (!difficulty) return '';
    
    // Normaliser la clé en minuscules pour la recherche
    const normalizedKey = difficulty.toLowerCase();
    
    return t(`difficulty.${normalizedKey}`, { fallback: difficulty });
  };

  // Traduction des groupes musculaires
  const translateMuscleGroup = (muscleGroup: string): string => {
    if (!muscleGroup) return '';
    
    // Normaliser la clé en minuscules pour la recherche
    const normalizedKey = muscleGroup.toLowerCase();
    
    return t(`muscleGroups.${normalizedKey}`, { fallback: muscleGroup });
  };

  // Traduction des lieux d'entraînement
  const translateLocation = (location: string): string => {
    if (!location) return '';
    
    // Normaliser la clé en minuscules pour la recherche
    const normalizedKey = location.toLowerCase();
    
    return t(`locations.${normalizedKey}`, { fallback: location });
  };

  // Traduction des éléments spécifiques aux entraînements
  const translateWorkoutElement = (key: string): string => {
    if (!key) return '';
    
    return t(`workouts.${key}`, { fallback: key });
  };

  return {
    translateDifficulty,
    translateMuscleGroup,
    translateLocation,
    translateWorkoutElement
  };
};
