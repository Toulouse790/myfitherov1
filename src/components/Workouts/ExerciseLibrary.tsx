import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FloatingWorkoutButton } from "./FloatingWorkoutButton";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { LibraryHeader } from "./components/LibraryHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ExerciseSelection } from "./ExerciseSelection";

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleMuscleGroupClick = (muscleId: string) => {
    console.log("Muscle group clicked:", muscleId);
    setSelectedMuscleGroup(muscleId);
  };

  const handleExerciseSelection = (exerciseIds: string[]) => {
    setSelectedExercises(exerciseIds);
  };

  const handleStartWorkout = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une séance",
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
      console.log("Creating workout session with exercises:", selectedExercises);
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            type: 'strength', 
            status: 'in_progress',
            exercises: selectedExercises
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Séance créée",
        description: `${selectedExercises.length} exercices ajoutés à votre séance`,
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

  return (
    <div className="container max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <LibraryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedExercisesCount={selectedExercises.length}
        onStartWorkout={handleStartWorkout}
      />

      {selectedMuscleGroup ? (
        <ExerciseSelection
          selectedExercises={selectedExercises}
          onSelectionChange={handleExerciseSelection}
          onClose={() => setSelectedMuscleGroup(null)}
          muscleGroup={selectedMuscleGroup}
          searchQuery={searchQuery}
        />
      ) : (
        <MuscleGroupGrid 
          searchQuery={searchQuery}
          onMuscleGroupClick={handleMuscleGroupClick}
        />
      )}

      <FloatingWorkoutButton 
        selectedCount={selectedExercises.length}
        onClick={handleStartWorkout}
      />
    </div>
  );
};