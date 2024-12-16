import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WorkoutPlan } from "./workoutPlanGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface GeneratedWorkoutPreviewProps {
  plan: WorkoutPlan;
}

export const GeneratedWorkoutPreview = ({ plan }: GeneratedWorkoutPreviewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStartWorkout = async () => {
    if (!user) {
      console.log("Utilisateur non authentifié, redirection vers signin");
      navigate("/signin", { 
        state: { 
          from: location.pathname,
          workoutPlan: plan // Sauvegarder le plan d'entraînement
        } 
      });
      return;
    }

    try {
      console.log("Création de la session avec les exercices:", plan.exercises);
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            type: 'strength',
            status: 'in_progress',
            exercises: plan.exercises.map(ex => ex.name),
            target_duration_minutes: 45
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session d'entraînement",
          variant: "destructive",
        });
        return;
      }

      console.log("Session créée avec succès:", session);
      toast({
        title: "Séance créée",
        description: "Votre séance a été créée avec succès",
      });

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la séance",
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