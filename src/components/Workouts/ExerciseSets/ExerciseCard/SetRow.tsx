import { Button } from "@/components/ui/button";
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
      className={`p-3 rounded-lg ${
        isCompleted ? 'bg-muted/50' : 'bg-card'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`text-[11px] min-w-[40px] text-center ${
            isCompleted 
              ? 'bg-green-500/20 hover:bg-green-500/30 text-green-700' 
              : 'text-muted-foreground hover:bg-primary/10'
          }`}
          onClick={onSetComplete}
          disabled={!isCurrentSet || isResting}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            `S${setNumber + 1}`
          )}
        </Button>
        <div className="flex flex-1 items-center justify-center gap-2">
          <WeightInput 
            weight={weight} 
            onWeightChange={onWeightChange}
            disabled={isCompleted || isResting}
          />
          <RepsInput 
            reps={reps} 
            onRepsChange={onRepsChange}
            disabled={isCompleted || isResting}
          />
        </div>
      </div>
    </div>
  );
};