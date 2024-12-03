import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExerciseSelection } from "./ExerciseSelection";
import { exercises } from "./exerciseLibrary";
import { muscleGroups } from "./workoutConstants";
import { MuscleGroupCard } from "./filters/MuscleGroupCard";
import { FilterControls } from "./filters/FilterControls";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface WorkoutFiltersProps {
  muscleGroup: string;
  difficulty: string;
  location: string;
  sortOrder: "asc" | "desc";
  onMuscleGroupChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortOrderChange: () => void;
  onReset: () => void;
}

export const WorkoutFilters = ({
  muscleGroup,
  difficulty,
  location,
  sortOrder,
  onMuscleGroupChange,
  onDifficultyChange,
  onLocationChange,
  onSortOrderChange,
  onReset,
}: WorkoutFiltersProps) => {
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedMuscleExercises, setSelectedMuscleExercises] = useState<typeof exercises>([]);
  const [selectedExercises, setSelectedExercises] = useLocalStorage<string[]>("selectedExercises", []);

  const handleMuscleGroupClick = (muscleId: string) => {
    if (muscleId === muscleGroup) {
      const filteredExercises = exercises.filter(ex => {
        if (muscleId === "fullBody") return true;
        if (muscleId === "biceps" || muscleId === "triceps") {
          return ex.muscleGroup === "arms";
        }
        if (muscleId === "quadriceps" || muscleId === "hamstrings" || muscleId === "glutes") {
          return ex.muscleGroup === "legs";
        }
        if (muscleId === "lower_back") {
          return ex.muscleGroup === "back";
        }
        return ex.muscleGroup === muscleId;
      });
      setSelectedMuscleExercises(filteredExercises);
      setShowExerciseSelection(true);
    } else {
      onMuscleGroupChange(muscleId);
    }
  };

  const getSelectedExercisesCount = (muscleId: string): number => {
    return exercises.filter(ex => {
      let matches = false;
      if (muscleId === "fullBody") {
        matches = true;
      } else if (muscleId === "biceps" || muscleId === "triceps") {
        matches = ex.muscleGroup === "arms";
      } else if (muscleId === "quadriceps" || muscleId === "hamstrings" || muscleId === "glutes") {
        matches = ex.muscleGroup === "legs";
      } else if (muscleId === "lower_back") {
        matches = ex.muscleGroup === "back";
      } else {
        matches = ex.muscleGroup === muscleId;
      }
      return matches && selectedExercises.includes(ex.id);
    }).length;
  };

  const handleExerciseSelectionChange = (selectedIds: string[]) => {
    setSelectedExercises(selectedIds);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {muscleGroups.map((muscle) => (
          <MuscleGroupCard
            key={muscle.id}
            id={muscle.id}
            name={muscle.name}
            image={muscle.image}
            isSelected={muscleGroup === muscle.id}
            selectedExercises={getSelectedExercisesCount(muscle.id)}
            totalExercises={muscle.totalExercises}
            onClick={() => handleMuscleGroupClick(muscle.id)}
          />
        ))}
      </div>

      <FilterControls
        difficulty={difficulty}
        location={location}
        sortOrder={sortOrder}
        onDifficultyChange={onDifficultyChange}
        onLocationChange={onLocationChange}
        onSortOrderChange={onSortOrderChange}
        onReset={onReset}
      />

      <Dialog open={showExerciseSelection} onOpenChange={setShowExerciseSelection}>
        <DialogContent className="sm:max-w-[800px]">
          <ExerciseSelection
            exercises={selectedMuscleExercises}
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelectionChange}
            onClose={() => setShowExerciseSelection(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};