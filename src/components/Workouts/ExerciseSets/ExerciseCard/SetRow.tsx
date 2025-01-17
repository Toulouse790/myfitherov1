import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

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
        <Input
          type="number"
          value={weight}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className={`h-8 text-center text-sm px-2 ${isCompleted || isResting || !isCurrentSet ? 'bg-muted cursor-not-allowed' : ''}`}
          disabled={isCompleted || isResting || !isCurrentSet}
          min={0}
        />
        <Input
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className={`h-8 text-center text-sm px-2 ${isCompleted || isResting || !isCurrentSet ? 'bg-muted cursor-not-allowed' : ''}`}
          disabled={isCompleted || isResting || !isCurrentSet}
          min={0}
        />
      </div>
    </div>
  );
};