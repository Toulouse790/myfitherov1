import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FloatingWorkoutButton } from "./FloatingWorkoutButton";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { LibraryHeader } from "./components/LibraryHeader";
import { SelectedExercisesManager } from "./components/SelectedExercisesManager";
import { supabase } from "@/integrations/supabase/client";

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMuscleGroupClick = (muscleId: string) => {
    setSelectedMuscleGroup(muscleId);
    setShowExerciseSelection(true);
  };

  const handleExerciseSelectionChange = async (selectedIds: string[]) => {
    setSelectedExercises(selectedIds);
    
    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { type: 'strength', status: 'in_progress' }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Exercices sélectionnés",
        description: `${selectedIds.length} exercices ajoutés à votre séance`,
      });

      if (session) {
        navigate(`/workouts/exercise/next-workout?session=${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance d'entraînement",
        variant: "destructive",
      });
    }
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/workouts/exercise/next-workout');
  };

  return (
    <div className="container max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <LibraryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedExercisesCount={selectedExercises.length}
        onStartWorkout={handleStartWorkout}
      />

      <MuscleGroupGrid 
        searchQuery={searchQuery}
        onMuscleGroupClick={handleMuscleGroupClick}
      />

      <SelectedExercisesManager
        showSelection={showExerciseSelection}
        setShowSelection={setShowExerciseSelection}
        selectedExercises={selectedExercises}
        selectedMuscleGroup={selectedMuscleGroup}
        searchQuery={searchQuery}
        onExerciseSelectionChange={handleExerciseSelectionChange}
      />

      <FloatingWorkoutButton 
        selectedCount={selectedExercises.length}
        onClick={handleStartWorkout}
      />
    </div>
  );
};