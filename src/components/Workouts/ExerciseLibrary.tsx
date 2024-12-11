import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { normalizeExerciseName } from "@/utils/exerciseUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ExerciseLibrary = () => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: exerciseNames, error: exerciseError } = await supabase
        .from('unified_exercises')
        .select('name')
        .in('id', selectedExercises);

      if (exerciseError) {
        console.error('Error fetching exercise names:', exerciseError);
        throw exerciseError;
      }

      const normalizedExerciseNames = exerciseNames
        ?.map(ex => ex.name?.trim())
        .filter(Boolean)
        .map(name => normalizeExerciseName(name as string)) || [];

      console.log("Creating workout session with normalized exercises:", normalizedExerciseNames);

      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          exercises: normalizedExerciseNames,
          type: 'strength',
          status: 'in_progress'
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw sessionError;
      }

      toast({
        title: "Séance créée",
        description: `${normalizedExerciseNames.length} exercices ajoutés à votre séance`,
      });

      if (session) {
        navigate(`/workouts/exercise/next-workout/${session.id}`);
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

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bibliothèque d'exercices</h1>
        <Button
          onClick={handleCreateWorkout}
          disabled={selectedExercises.length === 0}
        >
          Créer la séance ({selectedExercises.length})
        </Button>
      </div>

      <Tabs defaultValue="chest" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chest">Pectoraux</TabsTrigger>
          <TabsTrigger value="back">Dos</TabsTrigger>
          <TabsTrigger value="legs">Jambes</TabsTrigger>
          <TabsTrigger value="shoulders">Épaules</TabsTrigger>
          <TabsTrigger value="arms">Bras</TabsTrigger>
        </TabsList>

        {["chest", "back", "legs", "shoulders", "arms"].map((muscleGroup) => (
          <TabsContent key={muscleGroup} value={muscleGroup}>
            <Card className="p-4">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={`${muscleGroup}-${index}`}
                      className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg"
                    >
                      <Checkbox
                        id={`${muscleGroup}-${index}`}
                        checked={selectedExercises.includes(`${muscleGroup}-${index}`)}
                        onCheckedChange={() => handleExerciseToggle(`${muscleGroup}-${index}`)}
                      />
                      <label
                        htmlFor={`${muscleGroup}-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Exercice {index + 1} pour {muscleGroup}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};