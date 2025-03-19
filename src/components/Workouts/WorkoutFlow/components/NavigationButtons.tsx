
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

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
          {currentStep === totalSteps ? (
            <>
              Commencer
              <Play className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
