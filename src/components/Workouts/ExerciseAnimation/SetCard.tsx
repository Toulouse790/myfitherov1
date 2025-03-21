
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SetControls } from "./SetControls";
import { SetStatus } from "./SetStatus";
import { Plus, Minus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetCardProps {
  index: number;
  currentSet: number;
  isResting: boolean;
  reps: number;
  weight: number;
  exerciseName: string;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onSetComplete: () => void;
}

export const SetCard = ({
  index,
  currentSet,
  isResting,
  reps,
  weight,
  exerciseName,
  onRepsChange,
  onWeightChange,
  onSetComplete,
}: SetCardProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const isActive = index === currentSet - 1;

  const handleComplete = async () => {
    setIsCompleted(true);
    onSetComplete();

    toast({
      title: "Série complétée !",
      description: `Repos de 90 secondes avant la prochaine série.`,
    });
  };

  return (
    <Card className={`p-4 transition-all duration-300 ${
      isActive ? 'ring-2 ring-primary' : ''
    } ${isCompleted ? 'bg-muted/50' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Série {index + 1}</span>
          <SetStatus 
            isCompleted={isCompleted}
            isResting={isResting && isActive}
            restTime={isResting && isActive ? 90 : null}
          />
        </div>

        <SetControls
          weight={weight}
          reps={reps}
          onWeightChange={onWeightChange}
          onRepsChange={onRepsChange}
          disabled={!isActive || isCompleted || isResting}
        />

        {isActive && !isCompleted && !isResting && (
          <Button 
            onClick={handleComplete}
            className="w-full"
          >
            Valider la série
          </Button>
        )}
      </div>
    </Card>
  );
};
