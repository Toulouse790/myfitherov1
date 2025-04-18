
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExerciseSelection } from "@/hooks/use-exercise-selection";
import { ExerciseGrid } from "./components/ExerciseGrid";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { debugLogger } from "@/utils/debug-logger";

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
  muscleGroup = ""
}: ExerciseSelectionProps) => {
  const { exercises, isLoading } = useExerciseSelection(muscleGroup);
  const uniqueExercises = Array.from(new Set(exercises));

  useEffect(() => {
    debugLogger.log("ExerciseSelection", "Groupe musculaire reçu:", muscleGroup);
    debugLogger.log("ExerciseSelection", "Exercices chargés:", uniqueExercises.length);
  }, [muscleGroup, uniqueExercises.length]);

  const handleExerciseToggle = (exerciseName: string) => {
    const newSelection = selectedExercises.includes(exerciseName)
      ? selectedExercises.filter(name => name !== exerciseName)
      : [...selectedExercises, exerciseName];
    
    debugLogger.log("ExerciseSelection", "Sélection mise à jour:", newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {muscleGroup ? `Exercices - ${muscleGroup}` : 'Sélectionner des exercices'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Sélectionnez les exercices pour votre entraînement
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : uniqueExercises.length > 0 ? (
          <ExerciseGrid
            exercises={uniqueExercises}
            selectedExercises={selectedExercises}
            onExerciseToggle={handleExerciseToggle}
          />
        ) : (
          <Card className="p-6 text-center flex flex-col items-center justify-center gap-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <h3 className="text-lg font-semibold">Aucun exercice trouvé</h3>
            <p className="text-muted-foreground">
              Aucun exercice n'a été trouvé pour ce groupe musculaire. Essayez un autre groupe.
            </p>
          </Card>
        )}
      </div>
    </motion.div>
  );
};
