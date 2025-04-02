
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutProgressProps {
  progress: number;
  currentExerciseIndex: number;
  exercisesCount: number;
}

export const WorkoutProgress = ({ 
  progress, 
  currentExerciseIndex, 
  exercisesCount 
}: WorkoutProgressProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {t("workouts.exerciseProgress", { 
            current: currentExerciseIndex + 1, 
            total: exercisesCount 
          })}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
