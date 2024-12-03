import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer, Dumbbell } from "lucide-react";
import { ExerciseSets } from "./ExerciseSets";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WorkoutExerciseDetailProps {
  onBack: () => void;
}

export const WorkoutExerciseDetail = ({ onBack }: WorkoutExerciseDetailProps) => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Durée: 45 min</span>
          </div>
        </div>

        <Card className="p-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Rowing avec Haltères</h1>
              <p className="text-muted-foreground">
                Exercice pour le dos et les biceps
              </p>
            </div>
          </div>

          <ExerciseSets 
            exerciseName="Rowing avec Haltères"
            initialSets={[
              { id: 1, reps: 12, weight: 10, completed: false },
              { id: 2, reps: 12, weight: 10, completed: false },
              { id: 3, reps: 12, weight: 10, completed: false },
            ]} 
          />
        </Card>
      </div>
    </div>
  );
};