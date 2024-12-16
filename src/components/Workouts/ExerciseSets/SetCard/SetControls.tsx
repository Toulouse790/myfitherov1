import { NumberControl } from "./NumberControl";

interface SetControlsProps {
  weight: number;
  reps: number;
  onWeightChange: (setId: number, increment: boolean) => void;
  onRepsChange: (setId: number, increment: boolean) => void;
  setId: number;
  completed: boolean;
}

export const SetControls = ({
  weight,
  reps,
  onWeightChange,
  onRepsChange,
  setId,
  completed
}: SetControlsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NumberControl
        label="Poids (kg)"
        value={weight}
        onIncrease={() => onWeightChange(setId, true)}
        onDecrease={() => onWeightChange(setId, false)}
        disabled={completed}
      />
      <NumberControl
        label="Répétitions"
        value={reps}
        onIncrease={() => onRepsChange(setId, true)}
        onDecrease={() => onRepsChange(setId, false)}
        disabled={completed}
      />
    </div>
  );
};