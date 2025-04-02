
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkoutActionsProps {
  onFinishWorkout: () => void;
}

export const WorkoutActions = ({ onFinishWorkout }: WorkoutActionsProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <Button 
      variant="outline" 
      onClick={onFinishWorkout}
      className="gap-2 w-full sm:w-auto"
      size={isMobile ? "lg" : "default"}
    >
      <Timer className="w-4 h-4" />
      {t("workouts.completeWorkout") || "Terminer la séance"}
    </Button>
  );
};
