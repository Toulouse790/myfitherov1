import { useExerciseSelection } from "@/hooks/use-exercise-selection";
import { ExerciseCard } from "./components/ExerciseCard";
import { useNavigate } from "react-router-dom";
import { muscleGroups } from "./workoutConstants";

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
  const navigate = useNavigate();
  
  console.log("Current selected exercises:", selectedExercises);
  console.log("Current muscle group:", muscleGroup);
  console.log("Available exercises:", exercises);

  // Trouver l'ID du groupe musculaire à partir du nom français
  const getMuscleGroupId = (frenchName: string): string => {
    const group = muscleGroups.find(g => g.name.toLowerCase() === frenchName.toLowerCase());
    console.log("Looking for muscle group:", frenchName, "Found:", group);
    return group?.id || "";
  };

  const muscleGroupId = muscleGroup ? getMuscleGroupId(muscleGroup) : "";
  console.log("Muscle group ID:", muscleGroupId);

  const filteredExercises = exercises?.filter(exercise => {
    const nameMatch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const muscleGroupMatch = !muscleGroup || 
      exercise.muscle_group.toLowerCase() === muscleGroupId.toLowerCase();
    
    console.log(`Exercise ${exercise.name} muscle group match:`, {
      exerciseGroup: exercise.muscle_group.toLowerCase(),
      searchedGroup: muscleGroupId.toLowerCase(),
      matches: exercise.muscle_group.toLowerCase() === muscleGroupId.toLowerCase()
    });
    
    return nameMatch && muscleGroupMatch;
  });

  const handleExerciseToggle = (exerciseName: string) => {
    console.log("Toggling exercise:", exerciseName);
    const newSelection = selectedExercises.includes(exerciseName)
      ? selectedExercises.filter(name => name !== exerciseName)
      : [...selectedExercises, exerciseName];
    
    console.log("New selection:", newSelection);
    onSelectionChange(newSelection);
  };

  const handleBackToLibrary = () => {
    if (muscleGroup) {
      navigate(`/workouts/library?group=${muscleGroup}`);
    } else {
      navigate('/workouts/library');
    }
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
        <Button onClick={handleBackToLibrary}>
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
          <Button variant="outline" onClick={handleBackToLibrary}>
            Retour aux groupes musculaires
          </Button>
          {selectedExercises.length > 0 && (
            <Button onClick={onClose}>
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