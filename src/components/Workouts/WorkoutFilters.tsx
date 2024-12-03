import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExerciseSelection } from "./ExerciseSelection";
import { exercises } from "./exerciseLibrary";
import { muscleGroups } from "./workoutConstants";
import { MuscleGroupCard } from "./filters/MuscleGroupCard";
import { FilterControls } from "./filters/FilterControls";

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

  const handleMuscleGroupClick = (muscleId: string) => {
    if (muscleId === muscleGroup) {
      const filteredExercises = exercises.filter(ex => ex.muscleGroup === muscleId);
      setSelectedMuscleExercises(filteredExercises);
      setShowExerciseSelection(true);
    } else {
      onMuscleGroupChange(muscleId);
    }
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
            selectedExercises={muscle.selectedExercises}
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
            onClose={() => setShowExerciseSelection(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};