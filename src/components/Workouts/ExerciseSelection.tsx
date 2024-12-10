import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useExerciseSelection } from "@/hooks/use-exercise-selection";
import { ExerciseCard } from "./components/ExerciseCard";

export interface ExerciseSelectionProps {
  selectedExercises: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onClose: () => void;
  muscleGroup?: string;
  searchQuery?: string;
}

export const ExerciseSelection = ({
  selectedExercises,
  onSelectionChange,
  onClose,
  muscleGroup,
  searchQuery = ""
}: ExerciseSelectionProps) => {
  const { exercises, isLoading } = useExerciseSelection(muscleGroup);
  
  const filteredExercises = exercises?.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExerciseToggle = (exerciseId: string) => {
    console.log("Toggling exercise:", exerciseId);
    const newSelection = selectedExercises.includes(exerciseId)
      ? selectedExercises.filter(id => id !== exerciseId)
      : [...selectedExercises, exerciseId];
    console.log("New selection:", newSelection);
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!filteredExercises || filteredExercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-center text-muted-foreground">
          Aucun exercice ne correspond à votre recherche.
        </p>
        <Button onClick={onClose}>
          Retour aux groupes musculaires
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Sélectionnez vos exercices ({filteredExercises.length})
        </h2>
        <Button variant="outline" onClick={onClose}>
          Retour aux groupes musculaires
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredExercises.map((exercise) => (
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
    </div>
  );
};