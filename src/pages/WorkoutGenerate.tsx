import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSelection } from "@/components/Workouts/ExerciseSelection";
import { muscleGroups } from "@/components/Workouts/workoutConstants";
import { MuscleGroupCard } from "@/components/Workouts/components/MuscleGroupCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkoutGenerate() {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("muscle-groups");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = (exerciseIds: string[]) => {
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
    setActiveTab("exercises");
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="muscle-groups">Groupes musculaires</TabsTrigger>
            <TabsTrigger value="exercises">Exercices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="muscle-groups">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {muscleGroups.map((muscle) => (
                <MuscleGroupCard
                  key={muscle.id}
                  id={muscle.id}
                  name={muscle.name}
                  isSelected={selectedMuscleGroup === muscle.id}
                  exerciseCount={0}
                  onClick={() => handleMuscleGroupSelect(muscle.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="exercises">
            <ExerciseSelection
              selectedExercises={selectedExercises}
              onSelectionChange={handleExerciseSelection}
              onClose={() => setShowSelection(false)}
              muscleGroup={selectedMuscleGroup}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}