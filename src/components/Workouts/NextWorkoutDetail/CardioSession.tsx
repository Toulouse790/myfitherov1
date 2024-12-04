import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutHeader } from "./WorkoutHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface CardioSessionProps {
  sessionId: string | null;
  duration: number;
  isRunning: boolean;
  userId: string;
  setIsRunning: (isRunning: boolean) => void;
}

interface CardioExercise {
  id: string;
  name: string;
  type: string;
  parameters: {
    [key: string]: {
      unit: string;
      min: number;
      max: number;
      options?: string[];
    };
  };
  calories_formula: string;
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
  const [exercises, setExercises] = useState<CardioExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<CardioExercise | null>(null);
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

  const handleExerciseChange = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      // Initialize parameters with minimum values
      const initialParams: { [key: string]: number | string } = {};
      Object.entries(exercise.parameters).forEach(([key, value]) => {
        if (value.options) {
          initialParams[key] = value.options[0];
        } else {
          initialParams[key] = value.min;
        }
      });
      setParameters(initialParams);
    }
  };

  const handleParameterChange = (param: string, value: number | string) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
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
        .insert([
          {
            session_id: sessionId,
            user_id: userId,
            duration_minutes: Math.round(duration / 60),
            total_sets: 1,
            total_reps: 1,
            total_weight: 0,
            muscle_groups_worked: ['cardio'],
            exercise_type: selectedExercise.type,
            exercise_parameters: parameters
          }
        ]);

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

  const renderParameterInput = (paramName: string, paramConfig: any) => {
    if (paramConfig.options) {
      return (
        <Select
          value={parameters[paramName]?.toString()}
          onValueChange={(value) => handleParameterChange(paramName, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Sélectionner ${paramName}`} />
          </SelectTrigger>
          <SelectContent>
            {paramConfig.options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{paramName}</span>
          <span>{parameters[paramName]} {paramConfig.unit}</span>
        </div>
        <Slider
          value={[parameters[paramName] as number]}
          min={paramConfig.min}
          max={paramConfig.max}
          step={1}
          onValueChange={(value) => handleParameterChange(paramName, value[0])}
        />
      </div>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <WorkoutHeader title="Séance de Cardio" />
      
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <Select onValueChange={handleExerciseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un exercice" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedExercise && (
            <div className="space-y-4">
              {Object.entries(selectedExercise.parameters).map(([param, config]) => (
                <div key={param} className="space-y-2">
                  <label className="text-sm font-medium">{param}</label>
                  {renderParameterInput(param, config)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <div className="text-4xl font-bold">
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-muted-foreground">Durée de la séance</p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant={isRunning ? "destructive" : "default"}
            onClick={() => setIsRunning(!isRunning)}
            className="w-32"
            disabled={!selectedExercise}
          >
            <Timer className="mr-2 h-4 w-4" />
            {isRunning ? "Pause" : "Démarrer"}
          </Button>
          
          <Button
            variant="default"
            onClick={handleFinishCardio}
            className="w-32"
            disabled={duration === 0 || !selectedExercise}
          >
            Terminer
          </Button>
        </div>
      </Card>
    </div>
  );
};