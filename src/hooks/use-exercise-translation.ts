
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useExerciseTranslation = () => {
  const { t } = useLanguage();

  const translateMuscleGroups = (groups: string[] = []): string[] => {
    try {
      return groups.map(group => {
        const translated = t(`muscleGroups.${group.toLowerCase()}`, { fallback: '' });
        if (translated) {
          return translated;
        }
        
        // Fallback pour les anciens formats
        if (group === "fullBody") return t('muscleGroups.full_body', { fallback: 'Corps complet' });
        if (group === "upperBody") return t('muscleGroups.upper_body', { fallback: 'Haut du corps' });
        if (group === "lowerBody") return t('muscleGroups.lower_body', { fallback: 'Bas du corps' });
        
        return group; // Si aucune traduction n'est trouvée, retourne la clé originale
      }).filter(Boolean); // Supprime les chaînes vides
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction des groupes musculaires:', error);
      return groups;
    }
  };

  const translateDifficulty = (difficulty: string = ''): string => {
    try {
      if (!difficulty) return '';
      
      // Essayer de traduire la difficulté directement
      const translated = t(`difficulty.${difficulty.toLowerCase()}`, { fallback: '' });
      if (translated) return translated;
      
      // Fallbacks pour gérer les cas spéciaux
      switch (difficulty.toLowerCase()) {
        case 'beginner': return t('difficulty.beginner', { fallback: 'Débutant' });
        case 'intermediate': return t('difficulty.intermediate', { fallback: 'Intermédiaire' });
        case 'advanced': return t('difficulty.advanced', { fallback: 'Avancé' });
        case 'easy': return t('difficulty.easy', { fallback: 'Facile' });
        case 'moderate': return t('difficulty.moderate', { fallback: 'Modéré' });
        case 'hard': return t('difficulty.hard', { fallback: 'Difficile' });
        default: return difficulty;
      }
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction de la difficulté:', error);
      return difficulty;
    }
  };

  const translateLocation = (location: string = ''): string => {
    try {
      if (!location) return '';
      
      return t(`locations.${location.toLowerCase()}`, { fallback: location });
    } catch (error) {
      debugLogger.error('ExerciseTranslation', 'Erreur lors de la traduction de l\'emplacement:', error);
      return location;
    }
  };

  return {
    translateMuscleGroups,
    translateDifficulty,
    translateLocation
  };
};
