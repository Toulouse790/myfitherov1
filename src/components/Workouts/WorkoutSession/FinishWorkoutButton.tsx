
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FinishWorkoutButtonProps {
  onCompleteWorkout: () => Promise<void>;
}

export const FinishWorkoutButton = ({ onCompleteWorkout }: FinishWorkoutButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-8">
      <Button 
        onClick={onCompleteWorkout}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <CheckCircle className="h-5 w-5" />
        {t("workouts.finishWorkout")}
      </Button>
    </div>
  );
};
