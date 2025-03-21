
import { useToast } from "@/hooks/use-toast";

// Fonction utilitaire pour valider les valeurs numériques
export const validateNumericInput = (value: number | string, fieldName: string): { isValid: boolean; value: number; message?: string } => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return { isValid: false, value: 0, message: `La valeur de ${fieldName} n'est pas un nombre valide` };
  }
  
  if (numValue < 0) {
    return { isValid: false, value: 0, message: `La valeur de ${fieldName} ne peut pas être négative` };
  }
  
  return { isValid: true, value: numValue };
};

export const useFoodValidation = () => {
  const { toast } = useToast();

  const validateFoodEntry = (
    newFood: string,
    calories: number | string,
    proteins: number | string,
    carbs: number | string,
    fats: number | string
  ): boolean => {
    // Validation de base
    if (!newFood || newFood.trim() === "") {
      toast({
        title: "Erreur de validation",
        description: "Le nom de l'aliment est requis",
        variant: "destructive",
      });
      return false;
    }

    // Validation des valeurs numériques
    const caloriesValidation = validateNumericInput(calories, "calories");
    const proteinsValidation = validateNumericInput(proteins, "protéines");
    const carbsValidation = validateNumericInput(carbs, "glucides");
    const fatsValidation = validateNumericInput(fats, "lipides");

    // Si une des validations échoue, afficher l'erreur et arrêter
    if (!caloriesValidation.isValid) {
      toast({
        title: "Erreur de validation",
        description: caloriesValidation.message,
        variant: "destructive",
      });
      return false;
    }

    if (!proteinsValidation.isValid) {
      toast({
        title: "Erreur de validation",
        description: proteinsValidation.message,
        variant: "destructive",
      });
      return false;
    }

    if (!carbsValidation.isValid) {
      toast({
        title: "Erreur de validation",
        description: carbsValidation.message,
        variant: "destructive",
      });
      return false;
    }

    if (!fatsValidation.isValid) {
      toast({
        title: "Erreur de validation",
        description: fatsValidation.message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    validateFoodEntry,
    validateNumericInput
  };
};
