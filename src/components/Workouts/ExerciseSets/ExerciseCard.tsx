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

const getRepsLabel = (exerciseName: string): string => {
  const lowerName = exerciseName.toLowerCase();
  
  // Exercices pour les bras
  if (
    lowerName.includes("biceps") || 
    lowerName.includes("triceps") ||
    lowerName.includes("curl") ||
    lowerName.includes("extension bras") ||
    lowerName.includes("hammer") ||
    lowerName.includes("concentration") ||
    lowerName.includes("kickback")
  ) {
    return "RÉPÉTITIONS PAR BRAS";
  }
  
  // Exercices pour les jambes
  if (
    lowerName.includes("jambe") || 
    lowerName.includes("mollet") || 
    lowerName.includes("cuisse") ||
    lowerName.includes("fente") ||
    lowerName.includes("squat unilateral") ||
    lowerName.includes("extension jambe") ||
    lowerName.includes("flexion jambe")
  ) {
    return "RÉPÉTITIONS PAR JAMBE";
  }
  
  return "RÉPÉTITIONS";
};

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
          <div className="flex-1 text-xs text-muted-foreground text-center">KG</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">{getRepsLabel(exerciseName)}</div>
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
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] text-muted-foreground min-w-[40px] text-center hover:bg-primary/10"
                onClick={handleSetComplete}
                disabled={completedSets + 1 !== setNumber || isResting}
              >
                S{setNumber}
              </Button>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};