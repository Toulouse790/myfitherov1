import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SetCard } from "./ExerciseSets/SetCard";
import { RestTimer } from "./ExerciseSets/RestTimer";
import { ProgressBar } from "./ExerciseSets/ProgressBar";

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

  const completedSetsCount = sets.filter(set => set.completed).length;

  return (
    <div className="space-y-6">
      <ProgressBar 
        completedSets={completedSetsCount} 
        totalSets={sets.length} 
      />

      <div className="space-y-4">
        {sets.map((set) => (
          <SetCard
            key={set.id}
            setId={set.id}
            reps={set.reps}
            weight={set.weight}
            completed={set.completed}
            calories={set.calories}
            isCurrentSet={currentSet === set.id}
            restTimer={restTimer}
            onComplete={handleSetCompletion}
            onWeightChange={adjustWeight}
            onRepsChange={adjustReps}
          />
        ))}
      </div>

      <RestTimer restTimer={restTimer} />
    </div>
  );
};