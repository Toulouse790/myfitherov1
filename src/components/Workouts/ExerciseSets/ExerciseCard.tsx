import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { RestTimer } from "../ExerciseAnimation/RestTimer";
import { exerciseImages } from "../data/exerciseImages";

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
  const totalSets = 3;

  const handleSetComplete = () => {
    setIsResting(true);
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{exerciseName}</h3>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={exerciseImages[exerciseName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop"} 
              alt={exerciseName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {restTimer !== null && (
          <div className="py-2">
            <RestTimer 
              restTime={restTimer} 
              onRestTimeChange={() => {}} 
            />
          </div>
        )}

        <div className="space-y-2">
          {[1, 2, 3].map((setNumber) => (
            <div 
              key={setNumber} 
              className={`p-2 rounded-lg border ${
                completedSets >= setNumber ? 'bg-muted' : 'bg-card'
              }`}
            >
              <div className="text-xs font-medium mb-1">Série {setNumber}</div>
              <div className="flex gap-2">
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
          ))}
        </div>
      </div>
    </Card>
  );
};