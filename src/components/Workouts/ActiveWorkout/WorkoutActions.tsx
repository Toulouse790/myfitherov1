
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, ChevronRight } from "lucide-react";

interface WorkoutActionsProps {
  onFinishWorkout: () => void;
  onNextExercise: () => void;
  currentExerciseIndex: number;
  exercisesLength: number;
}

export const WorkoutActions = ({
  onFinishWorkout,
  onNextExercise,
  currentExerciseIndex,
  exercisesLength
}: WorkoutActionsProps) => {
  const { t } = useLanguage();
  
  const isLastExercise = currentExerciseIndex === exercisesLength - 1;
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      {!isLastExercise && (
        <Button 
          variant="outline" 
          className="flex-1 gap-2" 
          onClick={onNextExercise}
        >
          <span>{t("workouts.nextExercise")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        variant={isLastExercise ? "default" : "secondary"}
        className="flex-1 gap-2" 
        onClick={onFinishWorkout}
      >
        <CheckCircle className="h-4 w-4" />
        <span>{t("workouts.completeWorkout")}</span>
      </Button>
    </div>
  );
};
