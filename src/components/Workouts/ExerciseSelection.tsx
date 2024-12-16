import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
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

  return (
    <div className="space-y-6">
      <DialogContent className="sm:max-w-[600px]">
        <DialogDescription className="sr-only">
          Sélectionnez les exercices pour votre entraînement. Vous pouvez choisir plusieurs exercices à ajouter à votre programme.
        </DialogDescription>
        
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