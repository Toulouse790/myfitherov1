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
  const totalSets = 3; // Par défaut 3 séries

  const handleSetComplete = () => {
    setIsResting(true);
    // Default values for difficulty and notes
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{exerciseName}</h3>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={exerciseImages[exerciseName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop"} 
              alt={exerciseName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {isResting && restTimer ? (
          <RestTimer 
            restTime={restTimer} 
            onRestTimeChange={() => {}} 
          />
        ) : (
          <div className="space-y-6">
            <WeightInput 
              weight={weight} 
              onWeightChange={onWeightChange}
              onComplete={handleSetComplete}
            />
            <RepsInput 
              reps={reps} 
              onRepsChange={onRepsChange} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};