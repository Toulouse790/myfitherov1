import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ExerciseAnimation } from "./ExerciseAnimation";

interface ExerciseSetsProps {
  exerciseName: string;
}

export const ExerciseSets = ({ exerciseName }: ExerciseSetsProps) => {
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const totalSets = 4;
  const repsPerSet = 12;
  const restTime = 120; // 2 minutes rest

  useEffect(() => {
    if (isResting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / restTime);
          if (newProgress >= 100) {
            setIsResting(false);
            return 0;
          }
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isResting, restTime]);

  const handleSetComplete = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true);
      setProgress(0);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">{exerciseName}</h3>
      
      <ExerciseAnimation
        reps={repsPerSet}
        restTime={restTime}
        sets={totalSets}
        currentSet={currentSet}
        isResting={isResting}
        progress={progress}
      />

      <button
        onClick={handleSetComplete}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        disabled={currentSet >= totalSets}
      >
        {currentSet >= totalSets ? 'Exercice terminé' : 'Série terminée'}
      </button>
    </Card>
  );
};