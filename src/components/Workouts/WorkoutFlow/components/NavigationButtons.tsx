
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, ArrowRight } from "lucide-react";

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
    return null;
  }

  return (
    <div className="flex justify-between mt-6 w-full">
      {currentStep > 1 ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      ) : (
        <div></div> // Espace réservé pour l'alignement
      )}

      <Button
        onClick={onNext}
        className="px-5 py-2"
        disabled={isNextDisabled}
      >
        {currentStep === totalSteps - 1 ? (
          <>
            Lancer la séance
            <Play className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            Suivant
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
