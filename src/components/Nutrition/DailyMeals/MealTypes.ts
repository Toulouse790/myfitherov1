
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hook pour obtenir les types de repas traduits selon la langue actuelle
 * @returns Un objet contenant les types de repas traduits
 */
export const useMealTypes = () => {
  const { t } = useLanguage();
  
  return {
    breakfast: t("nutrition.mealTypes.breakfast"),
    morning_snack: t("nutrition.mealTypes.morning_snack"),
    lunch: t("nutrition.mealTypes.lunch"),
    afternoon_snack: t("nutrition.mealTypes.afternoon_snack"),
    dinner: t("nutrition.mealTypes.dinner")
  };
};

/**
 * Objet constant contenant les types de repas en français (à utiliser uniquement pour la rétrocompatibilité)
 * @deprecated Utiliser le hook useMealTypes à la place pour un support multilingue
 */
export const mealTypes: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  morning_snack: "Collation du matin",
  lunch: "Déjeuner",
  afternoon_snack: "Collation de l'après-midi",
  dinner: "Dîner"
};

/**
 * Fonction pour obtenir les clés des types de repas
 * @returns Un tableau des clés des types de repas
 */
export const getMealTypeKeys = (): string[] => {
  return ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner"];
};
