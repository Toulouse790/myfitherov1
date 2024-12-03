import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Timer, Flame, Check, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Set {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
  calories?: number;
}

interface ExerciseSetsProps {
  exerciseName: string;
  initialSets?: Set[];
}

export const ExerciseSets = ({ exerciseName, initialSets }: ExerciseSetsProps) => {
  const [sets, setSets] = useState<Set[]>(initialSets || [
    { id: 1, reps: 12, weight: 10, completed: false },
    { id: 2, reps: 12, weight: 10, completed: false },
    { id: 3, reps: 12, weight: 10, completed: false },
  ]);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev === null || prev <= 1) {
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

  const handleSetCompletion = (setId: number) => {
    setSets(prev => prev.map(set => {
      if (set.id === setId) {
        const calories = Math.round(set.reps * set.weight * 0.15);
        return { ...set, completed: true, calories };
      }
      return set;
    }));
    
    if (setId < sets.length) {
      setRestTimer(90);
      setCurrentSet(setId + 1);
    }
    
    const calories = Math.round(sets[setId - 1].reps * sets[setId - 1].weight * 0.15);
    toast({
      title: "Série complétée !",
      description: `${calories} calories brûlées. 90 secondes de repos.`,
    });
  };

  const adjustWeight = (setId: number, increment: boolean) => {
    setSets(prev => prev.map(set => {
      if (set.id === setId) {
        return { 
          ...set, 
          weight: Math.max(0, set.weight + (increment ? 1 : -1))
        };
      }
      return set;
    }));
  };

  const adjustReps = (setId: number, increment: boolean) => {
    setSets(prev => prev.map(set => {
      if (set.id === setId) {
        return { 
          ...set, 
          reps: Math.max(1, set.reps + (increment ? 1 : -1))
        };
      }
      return set;
    }));
  };

  const progress = (sets.filter(set => set.completed).length / sets.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-4">
        {sets.map((set) => (
          <Card key={set.id} className={`p-4 transition-all duration-300 ${
            currentSet === set.id ? 'ring-2 ring-primary' : ''
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Série {set.id}</span>
                {set.completed && (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Complétée</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Poids (kg)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustWeight(set.id, false)}
                      disabled={set.completed}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{set.weight}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustWeight(set.id, true)}
                      disabled={set.completed}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Répétitions</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustReps(set.id, false)}
                      disabled={set.completed}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{set.reps}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustReps(set.id, true)}
                      disabled={set.completed}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                variant={set.completed ? "secondary" : "default"}
                onClick={() => handleSetCompletion(set.id)}
                disabled={set.completed || (currentSet !== set.id) || (restTimer !== null)}
              >
                {set.completed ? (
                  <span className="flex items-center gap-2">
                    Série complétée
                    {set.calories && (
                      <>
                        <Flame className="h-4 w-4" />
                        <span>{set.calories} kcal</span>
                      </>
                    )}
                  </span>
                ) : (
                  "Valider la série"
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {restTimer !== null && (
        <div className="fixed bottom-20 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full animate-pulse shadow-lg">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            <span className="font-medium">{restTimer}s</span>
          </div>
        </div>
      )}
    </div>
  );
};