import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

interface RestTimerProps {
  restTimer: number | null;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTimer, onRestTimeChange }: RestTimerProps) => {
  if (restTimer === null) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRestTimeChange(-15)}
      >
        -
      </Button>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Timer className="h-5 w-5 text-primary" />
        <span>{restTimer}s</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRestTimeChange(15)}
      >
        +
      </Button>
    </div>
  );
};