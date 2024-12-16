import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { ExerciseSelection } from "./ExerciseSelection";

export const ExerciseLibrary = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = async (exerciseIds: string[]) => {
    setSelectedExercises((prev) => [...prev, ...exerciseIds]);
  };

  const handleStartWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            exercises: selectedExercises,
            type: 'strength',
            status: 'in_progress',
            target_duration_minutes: 45
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating workout:', error);
        throw error;
      }

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  const handleMuscleGroupSelect = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    setShowSelection(true);
  };

  const handleCloseSelection = () => {
    setShowSelection(false);
    if (selectedExercises.length > 0) {
      toast({
        title: "Exercices ajoutés",
        description: "Voulez-vous entraîner un autre groupe musculaire ?",
        action: (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowSelection(false);
                handleStartWorkout();
              }}
            >
              Non, commencer
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                setSelectedMuscleGroup("");
                setShowSelection(true);
              }}
            >
              Oui
            </Button>
          </div>
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {selectedExercises.length > 0 && (
          <div className="flex justify-end mb-6">
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              C'est parti ! ({selectedExercises.length} exercices)
            </Button>
          </div>
        )}

        {showSelection ? (
          <ExerciseSelection
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelection}
            onClose={handleCloseSelection}
            muscleGroup={selectedMuscleGroup}
          />
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">
              Sélectionnez les groupes musculaires à travailler
            </h1>
            <MuscleGroupGrid onSelect={handleMuscleGroupSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;