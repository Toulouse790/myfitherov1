import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Layout/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { muscleGroups } from "@/components/Workouts/workoutConstants";
import { MuscleGroupCard } from "@/components/Workouts/components/MuscleGroupCard";
import { Card } from "@/components/ui/card";

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
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('unified_exercises')
          .select('*')
          .eq('est_publié', true);

        if (error) {
          throw error;
        }

        console.log("Exercices chargés:", data);
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
  }, [toast]);

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

  const filteredExercises = selectedMuscleGroup
    ? exercises.filter(ex => ex.muscle_group.toLowerCase() === selectedMuscleGroup.toLowerCase())
    : exercises;

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
        
        {selectedExercises.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              Commencer la séance ({selectedExercises.length})
            </Button>
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedExercises.includes(exercise.name) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                if (selectedExercises.includes(exercise.name)) {
                  setSelectedExercises(prev => prev.filter(name => name !== exercise.name));
                } else {
                  setSelectedExercises(prev => [...prev, exercise.name]);
                }
              }}
            >
              <div className="space-y-2">
                <h3 className="font-medium">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {exercise.muscle_group}
                </p>
                {exercise.difficulty && (
                  <div className="flex gap-2">
                    {exercise.difficulty.map((diff) => (
                      <span
                        key={diff}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}