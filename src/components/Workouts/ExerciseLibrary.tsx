import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const ExerciseLibrary = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleExerciseSelection = (exerciseIds: string[]) => {
    console.log("Selected exercises:", exerciseIds);
    setSelectedExercises(exerciseIds);
    setShowSelection(false);
    
    toast({
      title: `${exerciseIds.length} exercice(s) sélectionné(s)`,
      description: "Vous pouvez sélectionner d'autres exercices ou commencer la séance",
      action: (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSelection(false)}
          >
            Terminer
          </Button>
          <Button 
            size="sm"
            onClick={() => {
              setSelectedMuscleGroup(null);
              setShowSelection(true);
            }}
          >
            Ajouter d'autres exercices
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
      console.log("Creating workout session with exercises:", selectedExercises);
      
      // Vérifier si une session en cours existe déjà
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: existingSessions, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('id')
        .gte('created_at', today.toISOString())
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;

      // Si une session existe, supprimer l'ancienne session
      if (existingSessions && existingSessions.length > 0) {
        const { error: deleteError } = await supabase
          .rpc('delete_workout_session', {
            session_id: existingSessions[0].id
          });

        if (deleteError) throw deleteError;

        toast({
          title: "Session précédente supprimée",
          description: "Une nouvelle session va être créée",
        });
      }

      // Créer la nouvelle session
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
        console.log("Session created successfully:", session);
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
    console.log("Selected muscle group:", muscleGroup);
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
            searchQuery=""
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

const muscleGroups = [
  { id: "chest", name: "Pectoraux" },
  { id: "back", name: "Dos" },
  { id: "legs", name: "Jambes" },
  { id: "shoulders", name: "Épaules" },
  { id: "arms", name: "Bras" },
  { id: "abs", name: "Abdominaux" }
];

export default ExerciseLibrary;