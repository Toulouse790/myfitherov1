import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { ExerciseHeader } from "./ExerciseAnimation/ExerciseHeader";
import { SetCard } from "./ExerciseAnimation/SetCard";
import { RestTimer } from "./ExerciseAnimation/RestTimer";
import { useSetManagement } from "@/hooks/workout/use-set-management";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
  progress: number;
  sessionId?: string | null;
  weight?: number;
  exerciseName: string;
  onSetComplete?: () => void;
  onSetsChange?: (newSets: number) => void;
  onRestTimeChange?: (newTime: number) => void;
}

export const ExerciseAnimation = ({
  reps: initialReps,
  restTime,
  sets,
  currentSet,
  isResting,
  progress,
  sessionId,
  weight: initialWeight = 0,
  exerciseName,
  onSetComplete,
  onSetsChange = () => {},
  onRestTimeChange,
}: ExerciseAnimationProps) => {
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const { repsPerSet, handleAddSet, handleRepsChange } = useSetManagement({
    sessionId,
    exerciseName,
    initialReps,
    onSetsChange,
  });

  const handleRestTimeChange = (adjustment: number) => {
    if (adjustment !== 0 && onRestTimeChange) {
      onRestTimeChange(adjustment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <ExerciseHeader 
            exerciseName={exerciseName}
            onAddSet={handleAddSet}
          />
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Série actuelle</span>
              <span>{currentSet}/{sets}</span>
            </div>

            {Array.from({ length: sets }).map((_, index) => (
              <SetCard
                key={index}
                index={index}
                currentSet={currentSet}
                isResting={isResting}
                reps={repsPerSet[index]}
                weight={currentWeight}
                onRepsChange={(value) => handleRepsChange(index, value)}
                onWeightChange={setCurrentWeight}
                onSetComplete={onSetComplete || (() => {})}
              />
            ))}

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            
            <AnimatePresence mode="wait">
              {isResting && (
                <RestTimer
                  restTime={restTime}
                  onRestTimeChange={handleRestTimeChange}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};