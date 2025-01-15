import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { RestTimer } from "../ExerciseAnimation/RestTimer";
import { exerciseImages } from "../data/exerciseImages";
import { Button } from "@/components/ui/button";
import { Timer, Check } from "lucide-react";

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

  const handleSetComplete = () => {
    setIsResting(true);
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground text-center">{exerciseName}</h3>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img 
            src={exerciseImages[exerciseName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop"} 
            alt={exerciseName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {restTimer !== null && completedSets > 0 && (
        <div className="py-2">
          <RestTimer 
            restTime={restTimer} 
            onRestTimeChange={() => {}} 
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-4 px-3">
          <div className="flex-1 text-xs text-muted-foreground text-center">kg</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">reps</div>
          <div className="w-[72px]"></div>
        </div>
        {[1, 2, 3].map((setNumber) => (
          <div 
            key={setNumber} 
            className={`p-3 rounded-lg ${
              completedSets >= setNumber ? 'bg-muted/50' : 'bg-card'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground min-w-[40px] text-center">S{setNumber}</span>
              <div className="flex flex-1 items-center justify-center gap-2">
                <WeightInput 
                  weight={weight} 
                  onWeightChange={onWeightChange}
                  onComplete={handleSetComplete}
                  disabled={completedSets >= setNumber}
                />
                <RepsInput 
                  reps={reps} 
                  onRepsChange={onRepsChange}
                  disabled={completedSets >= setNumber}
                />
                {completedSets + 1 === setNumber && !restTimer && (
                  <Button
                    onClick={handleSetComplete}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={isResting}
                  >
                    {completedSets >= setNumber ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "Valider"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};