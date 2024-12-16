import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupFilter } from "@/components/Workouts/components/MuscleGroupFilter";
import { ExerciseGrid } from "@/components/Workouts/components/ExerciseGrid";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
  location?: string[];
  image_url?: string;
  video_url?: string;
}

export default function WorkoutGenerate() {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('unified_exercises')
          .select('*')
          .eq('est_publié', true);

        if (selectedMuscleGroup) {
          query = query.eq('muscle_group', selectedMuscleGroup.toLowerCase());
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setExercises(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [toast, selectedMuscleGroup]);

  const handleExerciseToggle = (exerciseName: string) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseName)) {
        return prev.filter(name => name !== exerciseName);
      }
      return [...prev, exerciseName];
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold">Création de séance</h1>
          <p className="text-muted-foreground">
            Sélectionnez les exercices que vous souhaitez inclure dans votre séance
          </p>
        </div>
        
        <MuscleGroupFilter
          selectedGroup={selectedMuscleGroup}
          onGroupSelect={setSelectedMuscleGroup}
        />

        {selectedExercises.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              Commencer la séance ({selectedExercises.length})
            </Button>
          </div>
        )}

        <ExerciseGrid
          exercises={exercises}
          selectedExercises={selectedExercises}
          onExerciseToggle={handleExerciseToggle}
        />
      </div>
    </div>
  );
}