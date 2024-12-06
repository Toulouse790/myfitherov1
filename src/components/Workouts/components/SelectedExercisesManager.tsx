import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExerciseSelection } from "../ExerciseSelection";

interface SelectedExercisesManagerProps {
  showSelection: boolean;
  setShowSelection: (show: boolean) => void;
  selectedExercises: string[];
  selectedMuscleGroup: string;
  searchQuery: string;
  onExerciseSelectionChange: (selectedIds: string[]) => void;
}

export const SelectedExercisesManager = ({
  showSelection,
  setShowSelection,
  selectedExercises,
  selectedMuscleGroup,
  searchQuery,
  onExerciseSelectionChange,
}: SelectedExercisesManagerProps) => {
  const handleClose = () => {
    console.log("SelectedExercisesManager: Closing dialog");
    setShowSelection(false);
  };

  return (
    <Dialog 
      open={showSelection} 
      onOpenChange={(open) => {
        console.log("Dialog onOpenChange triggered:", open);
        setShowSelection(open);
      }}
    >
      <DialogContent className="w-[95vw] max-w-[800px] h-[90vh] max-h-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélectionner des exercices</DialogTitle>
        </DialogHeader>
        <ExerciseSelection
          selectedExercises={selectedExercises}
          onSelectionChange={onExerciseSelectionChange}
          onClose={handleClose}
          muscleGroup={selectedMuscleGroup}
          searchQuery={searchQuery}
        />
      </DialogContent>
    </Dialog>
  );
};