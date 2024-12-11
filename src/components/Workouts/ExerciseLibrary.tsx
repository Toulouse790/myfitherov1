import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { useToast } from "@/hooks/use-toast";
import { muscleGroups } from "./workoutConstants";
import { useAuth } from "@/hooks/use-auth";

export const ExerciseLibrary = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleExerciseSelection = (exerciseIds: string[]) => {
    setSelectedExercises(exerciseIds);
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
              setSelectedMuscleGroup(null);
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
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer une séance",
        variant: "destructive",
      });
      return;
    }

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
        .insert({
          user_id: user.id,
          exercises: selectedExercises,
          type: 'strength',
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

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
            muscleGroup={selectedMuscleGroup || ""}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {muscleGroups.map((group) => (
              <Button
                key={group.id}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => handleMuscleGroupSelect(group.id)}
              >
                <span>{group.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;