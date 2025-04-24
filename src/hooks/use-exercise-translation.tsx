
import { useLanguage } from "@/contexts/LanguageContext";

export const useExerciseTranslation = () => {
  const { t } = useLanguage();

  // Traduction des niveaux de difficulté
  const translateDifficulty = (difficulty: string): string => {
    return t(`difficulty.${difficulty}`, { fallback: difficulty });
  };

  // Traduction des groupes musculaires
  const translateMuscleGroup = (muscleGroup: string): string => {
    return t(`muscleGroups.${muscleGroup}`, { fallback: muscleGroup });
  };

  // Traduction des lieux d'entraînement
  const translateLocation = (location: string): string => {
    return t(`locations.${location}`, { fallback: location });
  };

  return {
    translateDifficulty,
    translateMuscleGroup,
    translateLocation
  };
};
