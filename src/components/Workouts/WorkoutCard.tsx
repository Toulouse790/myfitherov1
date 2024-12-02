import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WorkoutStats } from "./WorkoutCard/WorkoutStats";
import { Exercise } from "./WorkoutCard/Exercise";

interface WorkoutCardProps {
  workout: {
    title: string;
    muscleGroup: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      calories: number;
    }>;
    totalCalories: number;
  };
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { title, exercises, totalCalories } = workout;
  const { toast } = useToast();
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [completedSets, setCompletedSets] = useState<{ [key: number]: number }>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [restDuration, setRestDuration] = useState<number>(90);

  const handleSetCompletion = (exerciseIndex: number) => {
    const currentSets = completedSets[exerciseIndex] || 0;
    const totalSets = exercises[exerciseIndex].sets;

    if (currentSets < totalSets) {
      setCompletedSets(prev => ({
        ...prev,
        [exerciseIndex]: currentSets + 1
      }));

      if (currentSets + 1 < totalSets) {
        startRestTimer();
        toast({
          title: "Série complétée !",
          description: `Repos de ${restDuration} secondes avant la prochaine série.`,
        });
      } else {
        setActiveExercise(null);
        toast({
          title: "Exercice terminé !",
          description: "Passez à l'exercice suivant.",
        });
      }
    }
  };

  const adjustRestDuration = (adjustment: number) => {
    const newDuration = restDuration + adjustment;
    if (newDuration >= 45 && newDuration <= 180) {
      setRestDuration(newDuration);
      toast({
        title: "Temps de repos ajusté",
        description: `Nouveau temps de repos : ${newDuration} secondes`,
      });
    }
  };

  const startRestTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    setRestTimer(restDuration);
    const newIntervalId = setInterval(() => {
      setRestTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(newIntervalId);
          toast({
            title: "Repos terminé !",
            description: "C'est reparti ! Commencez la série suivante.",
          });
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(newIntervalId);
  };

  return (
    <Card className="w-full animate-fade-up bg-card hover:bg-accent/5 transition-colors">
      <CardHeader className="p-4 sm:p-6 bg-primary/5 rounded-t-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg sm:text-xl font-bold text-primary">{title}</CardTitle>
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            {exercises.length} exercices
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        <WorkoutStats
          exerciseCount={exercises.length}
          totalCalories={totalCalories}
          restDuration={restDuration}
          onRestDurationChange={adjustRestDuration}
        />
        
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <Exercise
              key={index}
              exercise={exercise}
              index={index}
              activeExercise={activeExercise}
              completedSets={completedSets}
              restTimer={restTimer}
              onStart={() => setActiveExercise(index)}
              onSetComplete={handleSetCompletion}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};