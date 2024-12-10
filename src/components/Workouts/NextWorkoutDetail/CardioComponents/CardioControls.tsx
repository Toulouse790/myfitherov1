import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

interface CardioControlsProps {
  isRunning: boolean;
  selectedExercise: any;
  duration: number;
  onToggleRunning: () => void;
  onFinish: () => void;
}

export const CardioControls = ({
  isRunning,
  selectedExercise,
  duration,
  onToggleRunning,
  onFinish
}: CardioControlsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        variant={isRunning ? "destructive" : "default"}
        onClick={onToggleRunning}
        className="w-32"
        disabled={!selectedExercise}
      >
        <Timer className="mr-2 h-4 w-4" />
        {isRunning ? "Pause" : "Démarrer"}
      </Button>
      
      <Button
        variant="default"
        onClick={onFinish}
        className="w-32"
        disabled={duration === 0 || !selectedExercise}
      >
        Terminer
      </Button>
    </div>
  );
};