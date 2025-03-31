
import { CheckCircle2, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{t("workouts.exerciseList")}</h2>
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
          {currentExerciseIndex + 1}/{exercises.length}
        </span>
      </div>
      
      <div className="space-y-2">
        {exercises.map((exercise, index) => {
          const isActive = index === currentExerciseIndex;
          const isCompleted = exerciseProgress[exercise]?.completed;
          const progress = exerciseProgress[exercise];
          
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
                isCompleted ? 'bg-green-100' : isActive ? 'bg-primary/20' : 'bg-secondary'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Dumbbell className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                  {exercise}
                </p>
                {progress && (
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-300" 
                        style={{ width: `${isCompleted ? 100 : (progress.sets / progress.totalSets) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {progress.sets}/{progress.totalSets}
                    </span>
                  </div>
                )}
              </div>
              
              <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                isCompleted 
                  ? 'bg-green-100 text-green-700' 
                  : isActive 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-secondary text-secondary-foreground'
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
