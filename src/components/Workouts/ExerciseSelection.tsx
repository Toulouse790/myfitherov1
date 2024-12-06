import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useExerciseSelection } from "@/hooks/use-exercise-selection";
import { ExerciseCard } from "./components/ExerciseCard";

export interface ExerciseSelectionProps {
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

  const handleExerciseToggle = (exerciseId: string) => {
    const newSelection = selectedExercises.includes(exerciseId)
      ? selectedExercises.filter(id => id !== exerciseId)
      : [...selectedExercises, exerciseId];
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-center text-muted-foreground">
          Aucun exercice n'est disponible pour ce groupe musculaire pour le moment.
        </p>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExerciseCard
              exercise={exercise}
              isSelected={selectedExercises.includes(exercise.id)}
              onToggle={() => handleExerciseToggle(exercise.id)}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onClose}>
          Valider la sélection
        </Button>
      </div>
    </div>
  );
};