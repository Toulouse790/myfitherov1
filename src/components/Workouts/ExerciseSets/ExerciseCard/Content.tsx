import React from 'react';
import { RestTimer } from "../../ExerciseAnimation/RestTimer";
import { SetRow } from "./SetRow";
import { AddSetButton } from "./AddSetButton";

interface ContentProps {
  restTimer: number | null;
  completedSets: number;
  totalSets: number;
  setWeights: { [key: number]: number };
  weight: number;
  reps: number;
  isResting: boolean;
  onRestComplete: () => void;
  onWeightChange: (value: number, setNumber: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: () => void;
  onAddSet: () => void;
}

export const Content = ({
  restTimer,
  completedSets,
  totalSets,
  setWeights,
  weight,
  reps,
  isResting,
  onRestComplete,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  onAddSet
}: ContentProps) => {
  return (
    <div className="p-4 space-y-4">
      {restTimer !== null && completedSets > 0 && (
        <div className="py-2">
          <RestTimer 
            restTime={restTimer} 
            onRestTimeChange={onRestComplete} 
          />
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: totalSets }).map((_, setNumber) => (
          <SetRow
            key={setNumber}
            setNumber={setNumber}
            weight={setWeights[setNumber] || weight}
            reps={reps}
            completedSets={completedSets}
            isResting={isResting}
            onWeightChange={(value) => onWeightChange(value, setNumber)}
            onRepsChange={onRepsChange}
            onSetComplete={onSetComplete}
          />
        ))}

        {totalSets < 5 && (
          <AddSetButton onClick={onAddSet} />
        )}
      </div>
    </div>
  );
};