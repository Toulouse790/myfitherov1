import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutHeader } from "./WorkoutHeader";

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

  const handleFinishCardio = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('training_stats')
        .insert([
          {
            session_id: sessionId,
            user_id: userId,
            duration_minutes: Math.round(duration / 60),
            total_sets: 1,
            total_reps: 1,
            total_weight: 0,
            muscle_groups_worked: ['cardio']
          }
        ]);

      await supabase
        .from('workout_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId);

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
      
      <div className="p-6 bg-card rounded-lg border shadow-sm space-y-6">
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
          >
            <Timer className="mr-2 h-4 w-4" />
            {isRunning ? "Pause" : "Démarrer"}
          </Button>
          
          <Button
            variant="default"
            onClick={handleFinishCardio}
            className="w-32"
            disabled={duration === 0}
          >
            Terminer
          </Button>
        </div>
      </div>
    </div>
  );
};