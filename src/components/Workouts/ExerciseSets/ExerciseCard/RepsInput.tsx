import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
}

export const RepsInput = ({ reps, onRepsChange }: RepsInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium min-w-20">Répétitions</label>
      <div className="flex items-center gap-2 flex-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRepsChange(reps - 1)}
          className="h-8 w-8"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className="text-center max-w-24"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRepsChange(reps + 1)}
          className="h-8 w-8"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};