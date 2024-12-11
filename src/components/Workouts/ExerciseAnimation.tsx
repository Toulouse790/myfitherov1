import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ExerciseHeader } from "./ExerciseAnimation/ExerciseHeader";
import { SetCard } from "./ExerciseAnimation/SetCard";
import { RestTimer } from "./ExerciseAnimation/RestTimer";
import { useSetManagement } from "@/hooks/workout/use-set-management";
import { useToast } from "@/hooks/use-toast";
import { useExerciseData } from "./ExerciseSets/useExerciseData";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
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
  sets: initialSets,
  currentSet,
  isResting,
  sessionId,
  exerciseName,
  onSetComplete,
  onSetsChange = () => {},
  onRestTimeChange,
}: ExerciseAnimationProps) => {
  const { previousWeights } = useExerciseData([exerciseName]);
  const [currentWeight, setCurrentWeight] = useState(previousWeights[exerciseName] || 20);
  const [sets, setSets] = useState(initialSets);
  const { toast } = useToast();
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

  const handleAddNewSet = async () => {
    console.log("Attempting to add new set", {
      currentSets: sets,
      exerciseName,
      sessionId
    });

    try {
      await handleAddSet();
      setSets(prev => {
        const newSets = prev + 1;
        console.log("New sets count:", newSets);
        onSetsChange(newSets);
        return newSets;
      });
      
      toast({
        title: "Série ajoutée",
        description: `Une nouvelle série a été ajoutée à ${exerciseName}`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une série:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter une nouvelle série",
        variant: "destructive",
      });
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
            onAddSet={handleAddNewSet}
          />
          
          <div className="text-center mb-4">
            <span className="text-lg font-semibold">
              Série {currentSet}/{sets}
            </span>
          </div>

          <div className="space-y-4">
            {Array.from({ length: sets }).map((_, index) => (
              <SetCard
                key={index}
                exerciseName={exerciseName}
                index={index}
                currentSet={currentSet}
                isResting={isResting}
                reps={repsPerSet[index] || initialReps}
                weight={currentWeight}
                onRepsChange={(value) => handleRepsChange(index, value)}
                onWeightChange={setCurrentWeight}
                onSetComplete={onSetComplete || (() => {})}
              />
            ))}
            
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