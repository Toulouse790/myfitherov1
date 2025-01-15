import { Input } from "@/components/ui/input";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
  disabled?: boolean;
}

export const RepsInput = ({ reps, onRepsChange, disabled = false }: RepsInputProps) => {
  return (
    <div className="flex flex-col flex-1">
      <Input
        type="number"
        value={reps}
        onChange={(e) => disabled ? null : onRepsChange(Number(e.target.value))}
        className={`h-8 text-center text-sm px-2 ${disabled ? 'bg-muted cursor-not-allowed' : ''}`}
        disabled={disabled}
        min={0}
      />
    </div>
  );
};