import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useExerciseSelection } from "@/hooks/use-exercise-selection";
import { MuscleGroupFilter } from "./components/MuscleGroupFilter";
import { ExerciseGrid } from "./components/ExerciseGrid";
import { motion } from "framer-motion";

interface ExerciseSelectionProps {
  selectedExercises: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onClose: () => void;
  muscleGroup?: string;
}

export const ExerciseSelection = ({
  selectedExercises,
  onSelectionChange,
  onClose,
  muscleGroup
}: ExerciseSelectionProps) => {
  const { exercises, isLoading } = useExerciseSelection(muscleGroup);

  const handleExerciseToggle = (exerciseName: string) => {
    const newSelection = selectedExercises.includes(exerciseName)
      ? selectedExercises.filter(name => name !== exerciseName)
      : [...selectedExercises, exerciseName];
    
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DialogContent className="sm:max-w-[600px]" aria-describedby="exercise-selection-description">
        <div id="exercise-selection-description" className="sr-only">
          Sélectionnez les exercices pour votre entraînement
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Exercices disponibles ({exercises.length})
          </h2>
          <Button onClick={onClose}>Fermer</Button>
        </div>

        <ExerciseGrid
          exercises={exercises}
          selectedExercises={selectedExercises}
          onExerciseToggle={handleExerciseToggle}
        />
      </DialogContent>
    </div>
  );
};