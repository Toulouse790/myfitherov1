import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useWorkoutExercises = () => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const { toast } = useToast();

  const fetchSessionExercises = async (sessionId: string) => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('exercises')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      if (session?.exercises) {
        console.log("IDs des exercices récupérés:", session.exercises);
        
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('name')
          .in('id', session.exercises);

        if (exercisesError) throw exercisesError;

        if (exercisesData) {
          const exerciseNames = exercisesData.map(ex => ex.name);
          console.log("Noms des exercices récupérés:", exerciseNames);
          setExercises(exerciseNames);
          setWorkoutStarted(true);
        }
      }
    } catch (error) {
      console.error('Error fetching session exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les exercices de la séance",
        variant: "destructive",
      });
    }
  };

  const handleExerciseClick = (index: number) => {
    console.log("Setting current exercise index to:", index);
    setCurrentExerciseIndex(index);
  };

  return {
    exercises,
    currentExerciseIndex,
    workoutStarted,
    fetchSessionExercises,
    handleExerciseClick
  };
};