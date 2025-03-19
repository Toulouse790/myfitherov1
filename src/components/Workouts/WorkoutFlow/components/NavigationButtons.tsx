
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    return (
      <div className="flex justify-start mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      {currentStep !== 1 && (
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
        >
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
