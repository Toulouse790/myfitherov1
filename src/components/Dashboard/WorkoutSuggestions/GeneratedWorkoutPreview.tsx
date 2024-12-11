import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkoutPlan } from "./workoutPlanGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface GeneratedWorkoutPreviewProps {
  plan: WorkoutPlan;
}

export const GeneratedWorkoutPreview = ({ plan }: GeneratedWorkoutPreviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartWorkout = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour démarrer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            status: 'in_progress',
            type: 'strength',
            exercises: plan.exercises.map(ex => ex.name),
            initial_energy_level: 'good'
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Séance démarrée",
        description: "Votre séance d'entraînement a été créée avec succès",
      });

      // Correction de la redirection pour aller directement à la page de la séance
      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Programme Personnalisé</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Volume total</p>
            <p className="text-lg font-medium">{plan.volume} séries</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Intensité</p>
            <p className="text-lg font-medium">{Math.round(plan.intensity * 100)}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Repos entre les séries</p>
            <p className="text-lg font-medium">{plan.recommendedRest}s</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Séries × Répétitions</p>
            <p className="text-lg font-medium">{plan.setsAndReps.sets} × {plan.setsAndReps.reps}</p>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleStartWorkout} 
            className="w-full py-6 text-lg"
          >
            C'EST PARTI ! 💪
          </Button>
        </div>
      </div>
    </Card>
  );
};