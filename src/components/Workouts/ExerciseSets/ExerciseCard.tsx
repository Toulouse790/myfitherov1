import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { RestTimer } from "../ActiveWorkout/RestTimer";

interface ExerciseCardProps {
  exerciseName: string;
  onComplete?: () => void;
}

export const ExerciseCard = ({ exerciseName, onComplete }: ExerciseCardProps) => {
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const [isResting, setIsResting] = useState(false);

  const handleSetComplete = () => {
    setIsResting(true);
  };

  const handleRestComplete = () => {
    setIsResting(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">{exerciseName}</h3>

        {isResting ? (
          <RestTimer onComplete={handleRestComplete} />
        ) : (
          <div className="space-y-6">
            <WeightInput 
              weight={weight} 
              onWeightChange={setWeight}
              onComplete={handleSetComplete}
            />
            <RepsInput reps={reps} onRepsChange={setReps} />
          </div>
        )}
      </div>
    </Card>
  );
};