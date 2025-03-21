
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SetCard } from "./ExerciseAnimation/SetCard";
import { RestTimer } from "./ExerciseAnimation/RestTimer";
import { useToast } from "@/hooks/use-toast";

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
  exerciseName,
  onSetComplete,
  onSetsChange = () => {},
  onRestTimeChange = () => {},
}: ExerciseAnimationProps) => {
  const [sets, setSets] = useState(initialSets);
  const [weight, setWeight] = useState(20); // Poids par défaut
  const [reps, setReps] = useState(initialReps);
  const { toast } = useToast();

  const handleAddSet = () => {
    const newSetsCount = sets + 1;
    setSets(newSetsCount);
    onSetsChange(newSetsCount);
    
    toast({
      title: "Série ajoutée",
      description: `Une série supplémentaire a été ajoutée.`,
    });
  };

  const handleRestTimeChange = (adjustment: number) => {
    onRestTimeChange(adjustment);
  };

  const handleSetComplete = () => {
    if (onSetComplete) {
      onSetComplete();
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
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{exerciseName}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddSet}
              disabled={sets >= 5}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une série
            </Button>
          </div>
          
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
                reps={reps}
                weight={weight}
                onRepsChange={setReps}
                onWeightChange={setWeight}
                onSetComplete={handleSetComplete}
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
