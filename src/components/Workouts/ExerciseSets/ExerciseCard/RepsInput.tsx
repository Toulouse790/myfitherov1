import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
}

export const RepsInput = ({ reps, onRepsChange }: RepsInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium min-w-16">Répétitions</label>
      <div className="flex items-center gap-2 flex-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRepsChange(reps - 1)}
          className="h-6 w-6"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className="text-center max-w-16 h-8 text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRepsChange(reps + 1)}
          className="h-6 w-6"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};