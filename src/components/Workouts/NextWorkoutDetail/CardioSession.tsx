import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutHeader } from "./WorkoutHeader";
import { CardioExerciseSelector } from "./CardioComponents/CardioExerciseSelector";
import { CardioParameters } from "./CardioComponents/CardioParameters";
import { CardioTimer } from "./CardioComponents/CardioTimer";
import { CardioControls } from "./CardioComponents/CardioControls";
import { Card } from "@/components/ui/card";

interface CardioSessionProps {
  sessionId: string | null;
  duration: number;
  isRunning: boolean;
  userId: string;
  setIsRunning: (isRunning: boolean) => void;
}

export const CardioSession = ({ 
  sessionId, 
  duration, 
  isRunning, 
  userId,
  setIsRunning 
}: CardioSessionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [parameters, setParameters] = useState<{ [key: string]: number | string }>({});

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('cardio_exercises')
        .select('*');

      if (error) throw error;
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exercices",
        variant: "destructive",
      });
    }
  };

  const handleFinishCardio = async () => {
    if (!sessionId || !userId || !selectedExercise) {
      toast({
        title: "Erreur",
        description: "Session invalide",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert([{
          session_id: sessionId,
          user_id: userId,
          duration_minutes: Math.round(duration / 60),
          total_sets: 1,
          total_reps: 1,
          total_weight: 0,
          muscle_groups_worked: ['cardio'],
          exercise_type: selectedExercise.type,
          exercise_parameters: parameters
        }]);

      if (statsError) throw statsError;

      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({ 
          status: 'completed',
          user_id: userId 
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      toast({
        title: "Séance de cardio terminée",
        description: `Durée: ${Math.round(duration / 60)} minutes`,
      });

      navigate('/workouts');
    } catch (error) {
      console.error('Error finishing cardio session:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la séance de cardio",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <WorkoutHeader title="Séance de Cardio" />
      
      <Card className="p-6 space-y-6">
        <CardioExerciseSelector
          exercises={exercises}
          selectedExercise={selectedExercise}
          onExerciseChange={(exercise) => setSelectedExercise(exercise)}
        />

        {selectedExercise && (
          <CardioParameters
            exercise={selectedExercise}
            parameters={parameters}
            onParameterChange={(param, value) => 
              setParameters(prev => ({ ...prev, [param]: value }))
            }
          />
        )}

        <CardioTimer duration={duration} />

        <CardioControls
          isRunning={isRunning}
          selectedExercise={selectedExercise}
          duration={duration}
          onToggleRunning={() => setIsRunning(!isRunning)}
          onFinish={handleFinishCardio}
        />
      </Card>
    </div>
  );
};