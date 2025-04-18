
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
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
          {t("common.back")}
        </Button>
      ) : (
        <div></div>
      )}

      <Button
        onClick={onNext}
        className="px-5 py-2"
        disabled={isNextDisabled}
      >
        {currentStep === totalSteps - 1 ? t("workouts.startSession") : t("common.next")}
      </Button>
    </div>
  );
};
