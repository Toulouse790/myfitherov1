
import { useLanguage } from "@/contexts/LanguageContext";

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

export const mealTypes: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  morning_snack: "Collation du matin",
  lunch: "Déjeuner",
  afternoon_snack: "Collation de l'après-midi",
  dinner: "Dîner"
};
