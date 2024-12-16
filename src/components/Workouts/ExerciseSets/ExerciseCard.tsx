import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RestTimer } from "./RestTimer";
import { SetButton } from "./SetButton";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { DifficultySelect } from "./ExerciseCard/DifficultySelect";

interface ExerciseCardProps {
  exerciseName: string;
  weight: number;
  reps: number;
  completedSets: number;
  restTimer: number | null;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: (difficulty: string, notes: string) => void;
  isTransitioning?: boolean;
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
  isTransitioning = false
}: ExerciseCardProps) => {
  const [difficulty, setDifficulty] = useState("moderate");

  const handleRestTimeChange = (adjustment: number) => {
    if (adjustment !== 0) {
      onSetComplete(difficulty, "");
    }
  };

  const handleSetComplete = () => {
    onSetComplete(difficulty, "");
    setDifficulty("moderate");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 ${isTransitioning ? 'bg-primary/5' : ''}`}>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">{exerciseName}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <WeightInput weight={weight} onWeightChange={onWeightChange} />
            <RepsInput reps={reps} onRepsChange={onRepsChange} />
          </div>

          <div className="space-y-4">
            <DifficultySelect 
              difficulty={difficulty} 
              onDifficultyChange={setDifficulty} 
            />

            <RestTimer 
              restTimer={restTimer} 
              onRestTimeChange={handleRestTimeChange}
            />
            
            <SetButton
              isResting={restTimer !== null}
              currentSet={completedSets + 1}
              maxSets={3}
              onComplete={handleSetComplete}
              restTime={restTimer || 0}
              isTransitioning={isTransitioning}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};