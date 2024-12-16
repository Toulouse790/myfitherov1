import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { muscleGroups } from "@/components/Workouts/workoutConstants";
import { MuscleGroupCard } from "@/components/Workouts/components/MuscleGroupCard";

export default function WorkoutGenerate() {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = (exerciseIds: string[]) => {
    setSelectedExercises((prev) => [...prev, ...exerciseIds]);
    
    toast({
      title: "Groupe musculaire ajouté",
      description: "Veux-tu entraîner un autre groupe musculaire ?",
      action: (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedMuscleGroup("")}
          >
            Non
          </Button>
          <Button 
            size="sm"
            onClick={() => {
              setSelectedMuscleGroup("");
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

      if (error) throw error;

      if (session) {
        navigate(`/workouts/${session.id}`);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold">Création de séance</h1>
          <p className="text-muted-foreground">
            Sélectionnez les groupes musculaires que vous souhaitez travailler
          </p>
        </div>
        
        {selectedExercises.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              Commencer la séance ({selectedExercises.length})
            </Button>
          </div>
        )}

        {!selectedMuscleGroup ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {muscleGroups.map((muscle) => (
              <MuscleGroupCard
                key={muscle.id}
                id={muscle.id}
                name={muscle.name}
                isSelected={selectedMuscleGroup === muscle.id}
                exerciseCount={0}
                onClick={() => setSelectedMuscleGroup(muscle.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedMuscleGroup("")}
              className="mb-4"
            >
              ← Retour aux groupes musculaires
            </Button>
            <ExerciseSelection
              selectedExercises={selectedExercises}
              onSelectionChange={handleExerciseSelection}
              onClose={() => setSelectedMuscleGroup("")}
              muscleGroup={selectedMuscleGroup}
            />
          </div>
        )}
      </div>
    </div>
  );
}