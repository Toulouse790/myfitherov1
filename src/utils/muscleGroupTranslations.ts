
import { useLanguage } from "@/contexts/LanguageContext";

export const translateMuscleGroup = (muscleGroup: string): string => {
  if (!muscleGroup) return '';
  
  // Map de traduction des noms affichés vers les identifiants utilisés en BDD
  const translationMap: { [key: string]: string } = {
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps', 
    'abs': 'abdominaux',
    'core': 'gainage',
    'full_body': 'corps complet',
    'upper_body': 'haut du corps',
    'lower_body': 'bas du corps',
    'quads': 'quadriceps',
    'hamstrings': 'ischio-jambiers',
    'glutes': 'fessiers',
    'calves': 'mollets'
  };

  return translationMap[muscleGroup.toLowerCase()] || muscleGroup.toLowerCase();
};

export const translateMuscleGroupWithContext = (muscleGroup: string): string => {
  // Cette fonction est destinée à être utilisée lorsque le hook useLanguage est disponible
  const useLanguageContext = () => {
    try {
      // Essayer d'utiliser le contexte LanguageContext
      const { t } = useLanguage();
      return t(`muscleGroups.${muscleGroup}`, { fallback: translateMuscleGroup(muscleGroup) });
    } catch (error) {
      // Fallback si le contexte n'est pas disponible
      return translateMuscleGroup(muscleGroup);
    }
  };
  
  return useLanguageContext();
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'pectoraux': 'chest',
    'dos': 'back',
    'jambes': 'legs',
    'épaules': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abdominaux': 'abs',
    'gainage': 'core',
    'corps complet': 'full_body',
    'haut du corps': 'upper_body',
    'bas du corps': 'lower_body',
    'quadriceps': 'quads',
    'ischio-jambiers': 'hamstrings',
    'fessiers': 'glutes',
    'mollets': 'calves'
  };

  const key = muscleGroup.toLowerCase();
  return translations[key] || muscleGroup;
};
