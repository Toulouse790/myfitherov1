import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutHeader } from "./NextWorkoutDetail/WorkoutHeader";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { WorkoutInProgress } from "./NextWorkoutDetail/WorkoutInProgress";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

export const NextWorkoutDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCardio, setIsCardio] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
      checkSessionType(session);
    }
  }, [location]);

  const checkSessionType = async (sessionId: string) => {
    try {
      const { data: session } = await supabase
        .from('workout_sessions')
        .select('type')
        .eq('id', sessionId)
        .single();

      if (session?.type === 'cardio') {
        setIsCardio(true);
      }
    } catch (error) {
      console.error('Error checking session type:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleFinishCardio = async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('training_stats')
        .insert([
          {
            session_id: sessionId,
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
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la séance de cardio",
        variant: "destructive",
      });
    }
  };

  if (isCardio) {
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
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <WorkoutHeader />
      <ExerciseList />
      <WorkoutInProgress />
      <WorkoutSummaryDialog open={showSummary} onOpenChange={setShowSummary} />
    </div>
  );
};