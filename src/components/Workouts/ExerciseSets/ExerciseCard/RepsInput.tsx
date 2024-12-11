import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

interface RepsInputProps {
  reps: number;
  onRepsChange: (value: number) => void;
}

export const RepsInput = ({ reps, onRepsChange }: RepsInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Répétitions</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRepsChange(reps - 1)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={reps}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className="text-center"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRepsChange(reps + 1)}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};