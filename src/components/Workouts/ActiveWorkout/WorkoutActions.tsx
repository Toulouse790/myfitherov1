
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutActionsProps {
  handleFinishWorkout: () => void;
  handleNextExercise: () => void;
  currentExerciseIndex: number;
  exercisesLength: number;
}

export const WorkoutActions = ({ 
  handleFinishWorkout, 
  handleNextExercise, 
  currentExerciseIndex, 
  exercisesLength 
}: WorkoutActionsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        onClick={handleFinishWorkout}
        className="w-full"
      >
        <XCircle className="mr-2 h-4 w-4" />
        {t("workouts.finish")}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleNextExercise}
        className="w-full"
        disabled={currentExerciseIndex >= exercisesLength - 1}
      >
        {t("workouts.nextExercise")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
