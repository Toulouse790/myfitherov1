import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RestTimer } from "./RestTimer";
import { ExerciseSet } from "./ExerciseSet";
import { WorkoutSummaryDialog } from "./WorkoutSummaryDialog";

interface ActiveWorkoutPageProps {
  exercises: string[];
  onComplete: () => void;
}

export const ActiveWorkoutPage = ({ exercises, onComplete }: ActiveWorkoutPageProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [startTime] = useState(new Date());
  const { toast } = useToast();

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleSetComplete = () => {
    if (isLastExercise) {
      setShowSummary(true);
    } else {
      setShowRestTimer(true);
      toast({
        title: "Série terminée",
        description: "Prenez une pause de 90 secondes",
      });
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    if (!isLastExercise) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleWorkoutComplete = () => {
    const duration = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    console.log(`Workout completed in ${duration} minutes`);
    onComplete();
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Séance en cours</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowSummary(true)}
              className="gap-2"
            >
              <Timer className="w-4 h-4" />
              Terminer la séance
            </Button>
          </div>

          {showRestTimer ? (
            <RestTimer onComplete={handleRestComplete} />
          ) : (
            <ExerciseSet
              exerciseName={currentExercise}
              onComplete={handleSetComplete}
            />
          )}
        </div>
      </Card>

      <WorkoutSummaryDialog
        open={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirm={handleWorkoutComplete}
        duration={(new Date().getTime() - startTime.getTime()) / 1000 / 60}
      />
    </div>
  );
};