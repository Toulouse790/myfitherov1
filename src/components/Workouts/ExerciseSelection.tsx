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
        <div>
          <h2 className="text-lg font-semibold">
            Sélectionnez vos exercices ({filteredExercises.length})
          </h2>
          {selectedExercises.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedExercises.length} exercice(s) sélectionné(s)
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Retour aux groupes musculaires
          </Button>
          {selectedExercises.length > 0 && (
            <Button onClick={() => {
              onSelectionChange(selectedExercises);
              onClose();
            }}>
              Valider la sélection
            </Button>
          )}
        </div>
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
              isSelected={selectedExercises.includes(exercise.name)}
              onToggle={() => handleExerciseToggle(exercise.name)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};