
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useExerciseTranslation = () => {
  const { t } = useLanguage();

  // Traduction d'un groupe musculaire unique
  const translateMuscleGroup = (muscleGroup: string): string => {
    if (!muscleGroup) return '';
    
    try {
      // Normaliser la clé en minuscules pour la recherche
      const normalizedKey = muscleGroup.toLowerCase();
      
      // Essayer de traduire avec le chemin complet
      const fullPathTranslation = t(`muscleGroups.${normalizedKey}`, { fallback: '' });
      if (fullPathTranslation) return fullPathTranslation;
      
      // Essayer de traduire avec le chemin raccourci (pour la rétrocompatibilité)
      const shortPathTranslation = t(`workouts.muscleGroups.${normalizedKey}`, { fallback: '' });
      if (shortPathTranslation) return shortPathTranslation;
      
      // Fallback au texte d'origine
      return muscleGroup;
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction du groupe musculaire:', error);
      return muscleGroup;
    }
  };

  // Traduction d'un tableau de groupes musculaires
  const translateMuscleGroups = (groups: string[] = []): string[] => {
    try {
      return groups.map(group => translateMuscleGroup(group));
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction des groupes musculaires:', error);
      return groups;
    }
  };

  // Traduction des niveaux de difficulté
  const translateDifficulty = (difficulty: string): string => {
    if (!difficulty) return '';
    
    try {
      // Normaliser la clé en minuscules pour la recherche
      const normalizedKey = difficulty.toLowerCase();
      
      // Essayer de traduire directement
      const translated = t(`difficulty.${normalizedKey}`, { fallback: '' });
      if (translated) return translated;
      
      // Gérer les cas spécifiques
      if (normalizedKey === 'beginner') return t('difficulty.beginner', { fallback: difficulty });
      if (normalizedKey === 'intermediate') return t('difficulty.intermediate', { fallback: difficulty });
      if (normalizedKey === 'advanced') return t('difficulty.advanced', { fallback: difficulty });
      
      // Fallback au texte d'origine
      return difficulty;
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction de la difficulté:', error);
      return difficulty;
    }
  };

  // Traduction des lieux d'entraînement
  const translateLocation = (location: string): string => {
    if (!location) return '';
    
    try {
      // Normaliser la clé en minuscules pour la recherche
      const normalizedKey = location.toLowerCase();
      
      // Essayer de traduire
      return t(`locations.${normalizedKey}`, { fallback: location });
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction du lieu:', error);
      return location;
    }
  };

  // Traduction des éléments spécifiques aux entraînements
  const translateWorkoutElement = (key: string): string => {
    if (!key) return '';
    
    try {
      return t(`workouts.${key}`, { fallback: key });
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction de l\'élément d\'entraînement:', error);
      return key;
    }
  };

  return {
    translateMuscleGroup,
    translateMuscleGroups,
    translateDifficulty,
    translateLocation,
    translateWorkoutElement
  };
};
