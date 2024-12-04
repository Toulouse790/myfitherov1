import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExerciseAnimation } from "./ExerciseAnimation";

interface Exercise {
  name: string;
  reps: number;
  sets: number;
  completed: boolean;
}

interface ExerciseSetsProps {
  exercises: string[];
}

export const ExerciseSets = ({ exercises }: ExerciseSetsProps) => {
  const [exerciseStates, setExerciseStates] = useState<Exercise[]>(
    exercises.map(name => ({
      name,
      reps: 12,
      sets: 4,
      completed: false
    }))
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentExercise = exerciseStates[currentExerciseIndex];
  const restTime = 120;

  const handleSetComplete = () => {
    if (currentSet < currentExercise.sets - 1) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setProgress(0);
    } else {
      // Exercise completed
      const updatedExercises = [...exerciseStates];
      updatedExercises[currentExerciseIndex].completed = true;
      setExerciseStates(updatedExercises);

      // Move to next exercise if available
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(0);
      }
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const updatedExercises = [...exerciseStates];
    updatedExercises[currentExerciseIndex].reps = value;
    setExerciseStates(updatedExercises);
  };

  if (!currentExercise) return null;

  return (
    <div className="space-y-4">
      {exerciseStates.map((exercise, index) => (
        <Card 
          key={exercise.name}
          className={`p-4 ${index === currentExerciseIndex ? 'ring-2 ring-primary' : ''} ${
            exercise.completed ? 'bg-muted' : ''
          }`}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            
            {index === currentExerciseIndex && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Répétitions:</span>
                  <Input
                    type="number"
                    value={exercise.reps}
                    onChange={handleRepsChange}
                    className="w-20"
                    min={1}
                    inputMode="numeric"
                  />
                </div>
                
                <ExerciseAnimation
                  reps={exercise.reps}
                  restTime={restTime}
                  sets={exercise.sets}
                  currentSet={currentSet}
                  isResting={isResting}
                  progress={progress}
                />

                <Button
                  onClick={handleSetComplete}
                  className="w-full"
                  disabled={exercise.completed}
                >
                  {exercise.completed 
                    ? 'Exercice terminé' 
                    : currentSet === exercise.sets - 1 
                      ? 'Terminer l\'exercice'
                      : 'Série terminée'
                  }
                </Button>
              </>
            )}

            {exercise.completed && (
              <div className="text-sm text-muted-foreground">
                ✓ Exercice terminé
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};