import { useState, useEffect } from "react";
import { useWorkoutData } from "@/hooks/workout/use-workout-data";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence } from "framer-motion";
import { ExerciseHeader } from "./ExerciseAnimation/ExerciseHeader";
import { SetCard } from "./ExerciseAnimation/SetCard";
import { RestTimer } from "./ExerciseAnimation/RestTimer";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
  progress: number;
  sessionId?: string | null;
  weight?: number;
  exerciseName: string;
  onSetComplete?: () => void;
  onSetsChange?: (newSets: number) => void;
  onRestTimeChange?: (newTime: number) => void;
}

export const ExerciseAnimation = ({
  reps: initialReps,
  restTime,
  sets,
  currentSet,
  isResting,
  progress,
  sessionId,
  weight: initialWeight = 0,
  exerciseName,
  onSetComplete,
  onSetsChange,
  onRestTimeChange
}: ExerciseAnimationProps) => {
  const [remainingRestTime, setRemainingRestTime] = useState<number | null>(null);
  const [repsPerSet, setRepsPerSet] = useState<number[]>(Array(sets).fill(initialReps));
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const { updateStats } = useWorkoutData(sessionId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && remainingRestTime !== null && remainingRestTime > 0) {
      interval = setInterval(() => {
        setRemainingRestTime(prev => {
          if (prev === null || prev <= 1) {
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, remainingRestTime]);

  const handleSetComplete = async () => {
    if (onSetComplete) {
      const currentReps = repsPerSet[currentSet - 1];
      const totalWeight = currentWeight * currentReps;
      await updateStats(currentWeight, currentReps, exerciseName);
      onSetComplete();
      setRemainingRestTime(restTime);
    }
  };

  const handleAddSet = () => {
    if (onSetsChange) {
      console.log("Adding new set. Current sets:", sets);
      const newSetsCount = sets + 1;
      setRepsPerSet(prev => [...prev, initialReps]);
      onSetsChange(newSetsCount);
      console.log("New sets count:", newSetsCount);
    }
  };

  const handleRepsChange = (setIndex: number, value: number) => {
    setRepsPerSet(prev => {
      const newReps = [...prev];
      newReps[setIndex] = value;
      return newReps;
    });
  };

  const handleRestTimeChange = (newTime: number) => {
    if (onRestTimeChange) {
      onRestTimeChange(newTime);
      setRemainingRestTime(newTime);
    }
  };

  return (
    <div className="space-y-6">
      <ExerciseHeader 
        exerciseName={exerciseName}
        onAddSet={handleAddSet}
      />
      
      <div className="space-y-4">
        {Array.from({ length: sets }).map((_, index) => (
          <Card key={index} className={`p-4 ${index + 1 === currentSet ? 'border-primary' : ''}`}>
            <SetCard
              index={index}
              currentSet={currentSet}
              isResting={isResting}
              reps={repsPerSet[index]}
              weight={currentWeight}
              onRepsChange={(value) => handleRepsChange(index, value)}
              onWeightChange={setCurrentWeight}
              onSetComplete={handleSetComplete}
            />
          </Card>
        ))}

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        <AnimatePresence mode="wait">
          {isResting && (
            <RestTimer
              remainingTime={remainingRestTime || 0}
              restTime={restTime}
              onRestTimeChange={handleRestTimeChange}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};