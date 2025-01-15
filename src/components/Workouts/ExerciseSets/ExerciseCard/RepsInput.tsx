import { Input } from "@/components/ui/input";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
  disabled?: boolean;
}

export const RepsInput = ({ reps, onRepsChange, disabled = false }: RepsInputProps) => {
  return (
    <div className="flex items-center gap-1 flex-1">
      <Input
        type="number"
        value={reps}
        onChange={(e) => onRepsChange(Number(e.target.value))}
        className="h-8 text-center text-sm px-2"
        disabled={disabled}
      />
      <span className="text-xs text-muted-foreground">reps</span>
    </div>
  );
};