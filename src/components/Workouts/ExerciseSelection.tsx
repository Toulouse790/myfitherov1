import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useExerciseSelection } from "@/hooks/use-exercise-selection";
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

  // Ensure we only count unique exercises
  const uniqueExercises = Array.from(new Set(exercises));

  const handleExerciseToggle = (exerciseName: string) => {
    const newSelection = selectedExercises.includes(exerciseName)
      ? selectedExercises.filter(name => name !== exerciseName)
      : [...selectedExercises, exerciseName];
    
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {muscleGroup ? `Exercices - ${muscleGroup}` : 'Sélectionner des exercices'}
          </h2>

          <div className="sr-only">
            Sélectionnez les exercices pour votre entraînement. Vous pouvez choisir plusieurs exercices à ajouter à votre programme.
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Exercices disponibles ({uniqueExercises.length})
            </h3>
            <Button onClick={onClose}>Fermer</Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ExerciseGrid
              exercises={uniqueExercises}
              selectedExercises={selectedExercises}
              onExerciseToggle={handleExerciseToggle}
            />
          )}
        </div>
      </Card>
    </div>
  );
};