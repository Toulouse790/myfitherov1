
import { Button } from "@/components/ui/button";

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
  if (currentStep === totalSteps) {
    return null;
  }

  return (
    <div className="flex justify-between mt-6 w-full">
      {currentStep > 1 ? (
        <Button
          variant="outline"
          onClick={onBack}
        >
          Retour
        </Button>
      ) : (
        <div></div>
      )}

      <Button
        onClick={onNext}
        className="px-5 py-2"
        disabled={isNextDisabled}
      >
        {currentStep === totalSteps - 1 ? "Lancer la séance" : "Suivant"}
      </Button>
    </div>
  );
};
