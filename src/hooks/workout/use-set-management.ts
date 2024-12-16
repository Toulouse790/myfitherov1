import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseSetManagementProps {
  sessionId: string | null;
  exerciseName: string;
  initialReps: number;
  onSetsChange: (newSets: number) => void;
}

export const useSetManagement = ({
  sessionId,
  exerciseName,
  initialReps,
  onSetsChange,
}: UseSetManagementProps) => {
  const [sets, setSets] = useState(3);
  const [repsPerSet, setRepsPerSet] = useState<number[]>(Array(3).fill(initialReps));
  const { toast } = useToast();

  const handleAddSet = async () => {
    const newSetsCount = sets + 1;
    
    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('user_id')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      
      // Utilise la valeur par défaut de la base de données pour rest_time_seconds
      const { error } = await supabase
        .from('exercise_sets')
        .insert({
          session_id: sessionId,
          exercise_name: exerciseName,
          set_number: newSetsCount,
          reps: initialReps,
          completed_at: null
        });

      if (error) throw error;

      setRepsPerSet(prev => [...prev, initialReps]);
      setSets(newSetsCount);
      onSetsChange(newSetsCount);

      toast({
        title: "Série ajoutée",
        description: `Série ${newSetsCount} ajoutée avec succès`,
      });
    } catch (error) {
      console.error('Error adding set:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la série",
        variant: "destructive",
      });
    }
  };

  const handleRepsChange = (index: number, newReps: number) => {
    const newRepsPerSet = [...repsPerSet];
    newRepsPerSet[index] = newReps;
    setRepsPerSet(newRepsPerSet);
  };

  return {
    sets,
    repsPerSet,
    handleAddSet,
    handleRepsChange,
  };
};