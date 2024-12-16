import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

interface RestTimerProps {
  restTimer: number | null;
  onRestTimeChange: (adjustment: number) => void;
}

export const RestTimer = ({ restTimer, onRestTimeChange }: RestTimerProps) => {
  // Si restTimer est null, on n'affiche pas le composant
  if (restTimer === null) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRestTimeChange(-15)}
        disabled={restTimer <= 15} // Empêche de descendre en dessous de 15 secondes
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
        disabled={restTimer >= 180} // Limite à 3 minutes maximum
      >
        +
      </Button>
    </div>
  );
};