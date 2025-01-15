import { Input } from "@/components/ui/input";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
  disabled?: boolean;
}

export const RepsInput = ({ reps, onRepsChange, disabled = false }: RepsInputProps) => {
  return (
    <div className="flex flex-col flex-1">
      <span className="text-xs text-muted-foreground mb-1">reps</span>
      <Input
        type="number"
        value={reps}
        onChange={(e) => onRepsChange(Number(e.target.value))}
        className="h-8 text-center text-sm px-2"
        disabled={disabled}
      />
    </div>
  );
};