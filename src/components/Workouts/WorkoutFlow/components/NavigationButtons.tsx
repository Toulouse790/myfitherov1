
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export const NavigationButtons = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
}: NavigationButtonsProps) => {
  // On n'affiche pas les boutons de navigation sur la dernière étape
  // car un bouton principal est déjà présent dans StartWorkoutStep
  if (currentStep === totalSteps) {
    return null; // Ne rien afficher sur la dernière étape
  }

  // On n'affiche que le bouton "Valider" sur la première étape
  // et rien sur les autres étapes (car on a déjà la navigation en haut)
  return (
    <div className="flex justify-end mt-6 w-full">
      {currentStep === 1 && (
        <Button
          onClick={onNext}
          className="px-5 py-2 h-12"
          disabled={isNextDisabled}
        >
          Valider
          <Check className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
