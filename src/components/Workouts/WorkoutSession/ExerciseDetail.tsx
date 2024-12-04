import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

interface ExerciseDetailProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onBack: () => void;
}

export const ExerciseDetail = ({ exercise, onComplete, onBack }: ExerciseDetailProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            toast({
              title: "Repos terminé !",
              description: "C'est reparti ! Commencez la série suivante.",
            });
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer, toast]);

  const handleSetComplete = () => {
    if (currentSet < exercise.sets) {
      setRestTimer(90); // 90 secondes de repos
      setCurrentSet((prev) => prev + 1);
    } else {
      toast({
        title: "Exercice terminé !",
        description: "Bravo ! Passez à l'exercice suivant.",
      });
      onComplete(exercise.id);
    }
  };

  const progress = ((currentSet - 1) / exercise.sets) * 100;

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-transparent"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">{exercise.name}</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression</span>
            <span>{currentSet}/{exercise.sets} séries</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card p-6 rounded-lg space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Série {currentSet}</h2>
            <p className="text-muted-foreground">{exercise.reps} répétitions</p>
          </div>

          {restTimer !== null ? (
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary animate-pulse">
              <Timer className="h-6 w-6" />
              <span>{restTimer}s</span>
            </div>
          ) : (
            <Button
              className="w-full h-12 text-lg"
              onClick={handleSetComplete}
            >
              Valider la série
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};