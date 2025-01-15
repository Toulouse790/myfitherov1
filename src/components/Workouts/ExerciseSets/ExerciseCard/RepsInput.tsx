import { Input } from "@/components/ui/input";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
  disabled?: boolean;
}

export const RepsInput = ({ reps, onRepsChange, disabled = false }: RepsInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium min-w-16">Répétitions</label>
      <div className="flex items-center gap-2 flex-1">
        <Input
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className="text-center max-w-16 h-8 text-sm"
          disabled={disabled}
        />
      </div>
    </div>
  );
};