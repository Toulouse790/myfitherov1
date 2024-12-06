import { Card } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useExercises } from "@/hooks/use-exercises";
import { ExerciseList } from "./components/ExerciseList";

export const NextWorkoutCard = () => {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const { exercises, isLoading } = useExercises();
  const [exerciseSets, setExerciseSets] = useState<number[][]>([]);

  useEffect(() => {
    if (exercises.length > 0) {
      setExerciseSets(
        exercises.map(ex => Array(ex.defaultSets).fill(ex.defaultReps))
      );
    }
  }, [exercises]);

  const handleExerciseClick = (index: number) => {
    setSelectedExercise(selectedExercise === index ? null : index);
  };

  const handleRepsChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const newExerciseSets = [...exerciseSets];
    newExerciseSets[exerciseIndex][setIndex] = newValue;
    setExerciseSets(newExerciseSets);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary/20 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-secondary/10 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary" />
          Prochain entraînement
        </h2>
        
        <ExerciseList
          exercises={exercises}
          selectedExercise={selectedExercise}
          onExerciseClick={handleExerciseClick}
          exerciseSets={exerciseSets}
          onRepsChange={handleRepsChange}
        />
      </div>
    </Card>
  );
};