import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestTimer } from "../ExerciseAnimation/RestTimer";
import { ExerciseHeader } from "./ExerciseCard/ExerciseHeader";
import { SetRow } from "./ExerciseCard/SetRow";

interface ExerciseCardProps {
  exerciseName: string;
  weight: number;
  reps: number;
  completedSets: number;
  restTimer: number | null;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: (difficulty: string, notes: string) => void;
  isTransitioning: boolean;
}

export const ExerciseCard = ({ 
  exerciseName,
  weight,
  reps,
  completedSets,
  restTimer,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  isTransitioning
}: ExerciseCardProps) => {
  const [isResting, setIsResting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const [totalSets, setTotalSets] = useState(3);
  const [setWeights, setSetWeights] = useState<{ [key: number]: number }>({});
  const sessionId = window.location.pathname.split('/').pop();

  const handleSetComplete = () => {
    setIsResting(true);
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  const handleWeightChange = (value: number, setNumber: number) => {
    if (setNumber < completedSets) return;
    
    const newSetWeights = { ...setWeights };
    for (let i = setNumber; i < totalSets; i++) {
      if (i >= completedSets) {
        newSetWeights[i] = value;
      }
    }
    setSetWeights(newSetWeights);
    onWeightChange(value);
  };

  const handleAddSet = () => {
    setTotalSets(prev => prev + 1);
    toast({
      title: "Série ajoutée",
      description: `Une nouvelle série a été ajoutée à ${exerciseName}`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-300">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between bg-muted/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">{exerciseName}</h3>
          <span className="text-sm text-muted-foreground">
            {completedSets}/{totalSets} séries
          </span>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {restTimer !== null && completedSets > 0 && (
            <div className="py-2">
              <RestTimer 
                restTime={restTimer} 
                onRestTimeChange={handleRestComplete} 
              />
            </div>
          )}

          <div className="space-y-2">
            {Array.from({ length: totalSets }).map((_, setNumber) => (
              <SetRow
                key={setNumber}
                setNumber={setNumber}
                weight={setWeights[setNumber] || weight}
                reps={reps}
                completedSets={completedSets}
                isResting={isResting}
                onWeightChange={(value) => handleWeightChange(value, setNumber)}
                onRepsChange={onRepsChange}
                onSetComplete={handleSetComplete}
              />
            ))}

            {totalSets === 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 gap-2 hover:bg-primary/10"
                onClick={handleAddSet}
              >
                <Plus className="h-4 w-4" />
                Ajouter une série
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};