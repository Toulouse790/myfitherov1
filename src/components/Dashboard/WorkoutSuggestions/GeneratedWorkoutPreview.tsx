import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WorkoutPlan } from "./workoutPlanGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GeneratedWorkoutPreviewProps {
  plan: WorkoutPlan;
}

export const GeneratedWorkoutPreview = ({ plan }: GeneratedWorkoutPreviewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartWorkout = async () => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            status: 'in_progress',
            type: 'strength',
            exercises: plan.exercises.map(ex => ex.name),
          }
        ])
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session d'entraînement",
          variant: "destructive",
        });
        return;
      }

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage de la séance",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Séance générée</h3>
          <p className="text-sm text-muted-foreground">
            Voici une séance adaptée à vos objectifs
          </p>
        </div>

        <div className="space-y-4">
          {plan.exercises.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} séries • {exercise.reps} répétitions
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleStartWorkout} className="w-full">
          Commencer la séance
        </Button>
      </div>
    </Card>
  );
};