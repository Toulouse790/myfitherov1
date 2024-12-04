import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exercises } from "./exerciseLibrary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FloatingWorkoutButton } from "./FloatingWorkoutButton";
import { ExerciseSelection } from "./ExerciseSelection";
import { SearchBar } from "./components/SearchBar";
import { AddExerciseButton } from "./components/AddExerciseButton";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [selectedMuscleExercises, setSelectedMuscleExercises] = useState(exercises);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseAdd = () => {
    toast({
      title: "Exercice ajouté",
      description: "L'exercice a été ajouté avec succès à la bibliothèque",
    });
  };

  const handleMuscleGroupClick = (muscleId: string) => {
    if (muscleId === selectedMuscleGroup) {
      const filteredExercises = exercises.filter(ex => {
        if (muscleId === "fullBody") return true;
        return ex.muscleGroup === muscleId;
      });
      setSelectedMuscleExercises(filteredExercises);
      setShowExerciseSelection(true);
    } else {
      setSelectedMuscleGroup(muscleId);
    }
  };

  const handleExerciseSelectionChange = (selectedIds: string[]) => {
    setSelectedExercises(selectedIds);
    toast({
      title: "Exercices sélectionnés",
      description: `${selectedIds.length} exercices ajoutés à votre séance`,
    });
  };

  return (
    <div className="container max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <AddExerciseButton onSuccess={handleExerciseAdd} />
      </div>

      <MuscleGroupGrid 
        searchQuery={searchQuery}
        onMuscleGroupClick={handleMuscleGroupClick}
      />

      <Dialog open={showExerciseSelection} onOpenChange={setShowExerciseSelection}>
        <DialogContent className="w-[95vw] max-w-[800px] h-[90vh] max-h-[800px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sélectionner des exercices</DialogTitle>
          </DialogHeader>
          <ExerciseSelection
            exercises={selectedMuscleExercises}
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelectionChange}
            onClose={() => setShowExerciseSelection(false)}
          />
        </DialogContent>
      </Dialog>

      <FloatingWorkoutButton 
        selectedCount={selectedExercises.length}
        onClick={() => navigate('/workouts/exercise/next-workout')}
      />
    </div>
  );
};