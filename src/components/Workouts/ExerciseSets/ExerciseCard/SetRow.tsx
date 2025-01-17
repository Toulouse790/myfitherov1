import { Check } from "lucide-react";
import { WeightInput } from "./WeightInput";
import { RepsInput } from "./RepsInput";

interface SetRowProps {
  setNumber: number;
  weight: number;
  reps: number;
  completedSets: number;
  isResting: boolean;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: () => void;
}

export const SetRow = ({
  setNumber,
  weight,
  reps,
  completedSets,
  isResting,
  onWeightChange,
  onRepsChange,
  onSetComplete
}: SetRowProps) => {
  const isCompleted = completedSets >= setNumber + 1;
  const isCurrentSet = completedSets + 1 === setNumber + 1;

  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
        isCompleted ? 'bg-muted/50' : 
        isCurrentSet ? 'bg-primary/10' : 
        'bg-background'
      }`}
    >
      <button
        onClick={isCurrentSet && !isCompleted && !isResting ? onSetComplete : undefined}
        disabled={!isCurrentSet || isCompleted || isResting}
        className={`text-sm min-w-[30px] ${
          isCompleted ? 'text-primary' : 
          isCurrentSet ? 'text-primary hover:bg-primary/10 rounded-md p-1 transition-colors' : 
          'text-muted-foreground'
        }`}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : `S${setNumber + 1}`}
      </button>

      <div className="flex-1 flex items-center gap-2">
        <WeightInput 
          weight={weight} 
          onWeightChange={onWeightChange}
          disabled={isCompleted || isResting || !isCurrentSet}
        />
        <RepsInput 
          reps={reps} 
          onRepsChange={onRepsChange}
          disabled={isCompleted || isResting || !isCurrentSet}
        />
      </div>
    </div>
  );
};