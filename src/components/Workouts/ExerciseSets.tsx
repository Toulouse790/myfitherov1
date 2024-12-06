import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExerciseAnimation } from "./ExerciseAnimation";
import { useExercises } from "@/hooks/use-exercises";

interface ExerciseSetsProps {
  exercises: string[];
}

export const ExerciseSets = ({ exercises: exerciseIds }: ExerciseSetsProps) => {
  const { exercises, isLoading } = useExercises(exerciseIds);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentExercise = exercises[currentExerciseIndex];

  const handleSetComplete = () => {
    if (!currentExercise) return;

    if (currentSet < 3) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setProgress(0);
    } else {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(0);
      }
    }
  };

  if (isLoading || !currentExercise) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <Card 
          key={exercise.id}
          className={`p-4 ${index === currentExerciseIndex ? 'ring-2 ring-primary' : ''}`}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            
            {index === currentExerciseIndex && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Répétitions:</span>
                  <Input
                    type="number"
                    value={12}
                    className="w-20"
                    min={1}
                    inputMode="numeric"
                    readOnly
                  />
                </div>
                
                <ExerciseAnimation
                  reps={12}
                  restTime={120}
                  sets={3}
                  currentSet={currentSet}
                  isResting={isResting}
                  progress={progress}
                />

                <Button
                  onClick={handleSetComplete}
                  className="w-full"
                  disabled={index !== currentExerciseIndex}
                >
                  {currentSet === 2 
                    ? 'Terminer l\'exercice'
                    : 'Série terminée'
                  }
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};