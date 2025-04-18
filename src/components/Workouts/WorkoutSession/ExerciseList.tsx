
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";

interface ExerciseListProps {
  exercises: string[];
  currentExerciseIndex: number;
  exerciseProgress: Record<string, any>;
  onExerciseSelect: (index: number) => void;
}

export const ExerciseList = ({
  exercises,
  currentExerciseIndex,
  exerciseProgress,
  onExerciseSelect,
}: ExerciseListProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Liste des exercices</h2>
        
        <div className="space-y-2">
          {exercises.map((exercise, index) => {
            const isCompleted = exerciseProgress[exercise]?.completed;
            const isCurrent = index === currentExerciseIndex;
            
            return (
              <div
                key={index}
                className={`flex items-center p-3 rounded-md transition-colors cursor-pointer hover:bg-muted/50
                  ${isCurrent ? 'bg-muted/30 border border-primary/40' : ''}
                  ${isCompleted ? 'text-muted-foreground' : ''}`}
                onClick={() => onExerciseSelect(index)}
              >
                <div className="mr-3 text-primary">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                
                <div>
                  <p className={`font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>
                    {exercise}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isCompleted 
                      ? 'Terminé' 
                      : isCurrent 
                        ? 'En cours' 
                        : 'À faire'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
