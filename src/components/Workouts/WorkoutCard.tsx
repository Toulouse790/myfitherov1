import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Flame, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
    <Card className="w-full animate-fade-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            {exercises.length} exercices
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span className="text-sm">{exercises.length} exercices</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm">{totalCalories} kcal</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => adjustRestDuration(-15)}
                disabled={restDuration <= 45}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm min-w-[4rem] text-center">{restDuration}s repos</span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => adjustRestDuration(15)}
                disabled={restDuration >= 180}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border transition-colors ${
                activeExercise === index ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedSets[index] || 0}/{exercise.sets} séries × {exercise.reps} répétitions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeExercise === index && restTimer !== null && (
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="h-4 w-4" />
                      <span>{restTimer}s</span>
                    </div>
                  )}
                  {(activeExercise === null || activeExercise === index) && (
                    <Button
                      variant={activeExercise === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (activeExercise === null) {
                          setActiveExercise(index);
                        } else if (activeExercise === index) {
                          handleSetCompletion(index);
                        }
                      }}
                      disabled={restTimer !== null}
                    >
                      {activeExercise === index ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Valider la série
                        </>
                      ) : (
                        "Commencer"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};