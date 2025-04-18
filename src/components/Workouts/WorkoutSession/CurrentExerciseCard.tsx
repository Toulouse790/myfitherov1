
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, CheckCircle } from "lucide-react";

interface CurrentExerciseCardProps {
  currentExercise: string;
  exerciseProgress: Record<string, any>;
  onStartExercise: () => void;
}

export const CurrentExerciseCard = ({
  currentExercise,
  exerciseProgress,
  onStartExercise,
}: CurrentExerciseCardProps) => {
  const isCompleted = exerciseProgress[currentExercise]?.completed;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Exercice actuel</h2>
        
        <div className="p-4 border border-border rounded-lg bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{currentExercise}</h3>
              <p className="text-sm text-muted-foreground">
                {isCompleted 
                  ? "Terminé" 
                  : `${exerciseProgress[currentExercise]?.totalSets || 3} séries prévues`}
              </p>
            </div>
            
            <Button onClick={onStartExercise}>
              {isCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Revoir
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Commencer
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
