
import { CheckCircle2, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

interface ExerciseListProps {
  exercises: string[];
  currentExerciseIndex: number;
  exerciseProgress: Record<string, {
    completed: boolean;
    sets: number;
    totalSets: number;
  }>;
  onExerciseSelect: (index: number) => void;
}

export const ExerciseList = ({ 
  exercises, 
  currentExerciseIndex, 
  exerciseProgress,
  onExerciseSelect 
}: ExerciseListProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">{t("workouts.exerciseList")}</h2>
      <div className="space-y-2">
        {exercises.map((exercise, index) => {
          const isActive = index === currentExerciseIndex;
          const isCompleted = exerciseProgress[exercise]?.completed;
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-primary/10 border border-primary/30' 
                  : isCompleted 
                    ? 'bg-muted' 
                    : 'hover:bg-muted/50'
              }`}
              onClick={() => onExerciseSelect(index)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isCompleted ? 'bg-green-100' : 'bg-primary/10'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Dumbbell className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                  {exercise}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exerciseProgress[exercise]?.totalSets || 3} {t("workouts.sets")}
                </p>
              </div>
              
              <span className={`text-xs px-2 py-1 rounded ${
                isCompleted 
                  ? 'bg-green-100 text-green-700' 
                  : isActive 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {isCompleted 
                  ? t("workouts.completed") 
                  : isActive 
                    ? t("workouts.inProgress") 
                    : t("workouts.pending")}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
