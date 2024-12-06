import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FloatingWorkoutButton } from "./FloatingWorkoutButton";
import { ExerciseSelection } from "./ExerciseSelection";
import { SearchBar } from "./components/SearchBar";
import { AddExerciseButton } from "./components/AddExerciseButton";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { supabase } from "@/integrations/supabase/client";

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseAdd = async () => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            type: 'strength',
            status: 'in_progress'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Exercice ajouté",
        description: "L'exercice a été ajouté avec succès à la bibliothèque",
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'exercice",
        variant: "destructive",
      });
    }
  };

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
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelectionChange}
            onClose={() => setShowExerciseSelection(false)}
            muscleGroup={selectedMuscleGroup}
            searchQuery={searchQuery}
          />
        </DialogContent>
      </Dialog>

      <FloatingWorkoutButton 
        selectedCount={selectedExercises.length}
        onClick={handleStartWorkout}
      />
    </div>
  );
};