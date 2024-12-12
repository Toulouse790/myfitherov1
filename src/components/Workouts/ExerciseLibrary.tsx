import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";

export const ExerciseLibrary = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = async (exerciseIds: string[]) => {
    setSelectedExercises((prev) => [...prev, ...exerciseIds]);
    setShowSelection(false);
    
    toast({
      title: "Groupe musculaire ajouté",
      description: "Veux-tu entraîner un autre groupe musculaire ?",
      action: (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSelection(false)}
          >
            Non
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
            status: 'in_progress'
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {selectedExercises.length > 0 && (
          <div className="flex justify-end mb-6">
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              C'est parti ! ({selectedExercises.length})
            </Button>
          </div>
        )}

        {showSelection ? (
          <ExerciseSelection
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelection}
            onClose={() => setShowSelection(false)}
            muscleGroup={selectedMuscleGroup}
          />
        ) : (
          <MuscleGroupGrid onSelect={handleMuscleGroupSelect} />
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;