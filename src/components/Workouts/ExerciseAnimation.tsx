import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ExerciseHeader } from "./ExerciseAnimation/ExerciseHeader";
import { SetCard } from "./ExerciseAnimation/SetCard";
import { RestTimer } from "./ExerciseAnimation/RestTimer";
import { useSetManagement } from "@/hooks/workout/use-set-management";
import { useToast } from "@/hooks/use-toast";
import { useExerciseData } from "./ExerciseSets/useExerciseData";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const loadExerciseSets = async () => {
      if (sessionId) {
        try {
          const { data: existingSets, error } = await supabase
            .from('exercise_sets')
            .select('set_number')
            .eq('session_id', sessionId)
            .eq('exercise_name', exerciseName);

          if (error) throw error;

          if (existingSets && existingSets.length > 0) {
            const maxSetNumber = Math.max(...existingSets.map(set => set.set_number));
            setSets(maxSetNumber);
            onSetsChange(maxSetNumber);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des séries:', error);
        }
      }
    };

    loadExerciseSets();
  }, [sessionId, exerciseName, onSetsChange]);

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
      className="w-full"
    >
      <Card className="p-4 sm:p-6">
        <div className="space-y-6">
          <ExerciseHeader 
            exerciseName={exerciseName}
            onAddSet={handleAddSet}
          />
          
          <div className="text-center mb-4">
            <span className="text-lg font-semibold">
              Série {currentSet}/{sets}
            </span>
          </div>

          <div className="grid gap-4 sm:gap-6">
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