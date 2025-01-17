import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./ExerciseCard/Header";
import { Content } from "./ExerciseCard/Content";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const [totalSets, setTotalSets] = useState(3);
  const [setWeights, setSetWeights] = useState<{ [key: number]: number }>({});

  const handleSetComplete = () => {
    if (completedSets >= totalSets) {
      console.log("All sets completed");
      return;
    }
    
    console.log("Completing set:", {
      currentSet: completedSets + 1,
      totalSets,
      exerciseName
    });
    
    setIsResting(true);
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  const handleWeightChange = (value: number, setNumber: number) => {
    if (setNumber < completedSets) return;
    
    const newSetWeights = { ...setWeights };
    for (let i = setNumber; i < totalSets; i++) {
      if (i >= completedSets) {
        newSetWeights[i] = value;
      }
    }
    setSetWeights(newSetWeights);
    onWeightChange(value);
  };

  const handleAddSet = () => {
    if (totalSets >= 5) {
      toast({
        title: "Maximum atteint",
        description: "Vous ne pouvez pas ajouter plus de 5 séries",
        variant: "destructive",
      });
      return;
    }
    
    setTotalSets(prev => prev + 1);
    toast({
      title: "Série ajoutée",
      description: `Une nouvelle série a été ajoutée à ${exerciseName}`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-300">
      <Header
        exerciseName={exerciseName}
        completedSets={completedSets}
        totalSets={totalSets}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <Content
          restTimer={restTimer}
          completedSets={completedSets}
          totalSets={totalSets}
          setWeights={setWeights}
          weight={weight}
          reps={reps}
          isResting={isResting}
          onRestComplete={handleRestComplete}
          onWeightChange={handleWeightChange}
          onRepsChange={onRepsChange}
          onSetComplete={handleSetComplete}
          onAddSet={handleAddSet}
        />
      )}
    </Card>
  );
};