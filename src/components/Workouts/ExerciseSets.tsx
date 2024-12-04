import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExerciseAnimation } from "./ExerciseAnimation";

interface ExerciseSetsProps {
  exerciseName: string;
}

export const ExerciseSets = ({ exerciseName }: ExerciseSetsProps) => {
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reps, setReps] = useState(12);
  
  const totalSets = 4;
  const restTime = 120;

  const handleSetComplete = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true);
      setProgress(0);
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setReps(value);
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">{exerciseName}</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Répétitions:</span>
          <Input
            type="number"
            value={reps}
            onChange={handleRepsChange}
            className="w-20"
            min={1}
            inputMode="numeric"
          />
        </div>
        
        <ExerciseAnimation
          reps={reps}
          restTime={restTime}
          sets={totalSets}
          currentSet={currentSet}
          isResting={isResting}
          progress={progress}
        />
      </div>

      <Button
        onClick={handleSetComplete}
        className="w-full"
        disabled={currentSet >= totalSets}
      >
        {currentSet >= totalSets ? 'Exercice terminé' : 'Série terminée'}
      </Button>
    </Card>
  );
};