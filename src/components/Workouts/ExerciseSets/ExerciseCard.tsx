import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { RestTimer } from "../ExerciseAnimation/RestTimer";
import { Progress } from "@/components/ui/progress";

interface ExerciseCardProps {
  exerciseName: string;
  weight: number;
  reps: number;
  completedSets: number;
  restTimer: number | null;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: (difficulty: string, notes: string) => void;
  isTransitioning: boolean;
}

export const ExerciseCard = ({ 
  exerciseName,
  weight,
  reps,
  completedSets,
  restTimer,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  isTransitioning
}: ExerciseCardProps) => {
  const [isResting, setIsResting] = useState(false);
  const totalSets = 3; // Par défaut 3 séries

  const handleSetComplete = () => {
    setIsResting(true);
    // Default values for difficulty and notes
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  const progress = (completedSets / totalSets) * 100;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{exerciseName}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Série {completedSets + 1} sur {totalSets}</span>
            <span>{completedSets} séries complétées</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {isResting && restTimer ? (
          <RestTimer 
            restTime={restTimer} 
            onRestTimeChange={() => {}} 
          />
        ) : (
          <div className="space-y-6">
            <WeightInput 
              weight={weight} 
              onWeightChange={onWeightChange}
              onComplete={handleSetComplete}
            />
            <RepsInput 
              reps={reps} 
              onRepsChange={onRepsChange} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};