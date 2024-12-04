import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutHeader } from "./NextWorkoutDetail/WorkoutHeader";
import { ExerciseList } from "./NextWorkoutDetail/ExerciseList";
import { WorkoutInProgress } from "./NextWorkoutDetail/WorkoutInProgress";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { CardioSession } from "./NextWorkoutDetail/CardioSession";
import { useAuth } from "@/hooks/use-auth";

export const NextWorkoutDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCardio, setIsCardio] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
      checkSessionType(session);
    }
  }, [location]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

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

  const handleStartCardio = async () => {
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
            type: 'cardio' 
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Séance de cardio démarrée",
        description: "Vous pouvez maintenant enregistrer votre activité cardio",
      });

      navigate(`/workouts/exercise/next-workout?session=${session.id}`);
    } catch (error) {
      console.error('Error starting cardio session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance de cardio",
        variant: "destructive",
      });
    }
  };

  const handleExerciseClick = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  const handleConfirmEndWorkout = async () => {
    navigate('/workouts');
  };

  if (!user) {
    return null;
  }

  if (isCardio) {
    return (
      <CardioSession
        sessionId={sessionId}
        duration={duration}
        isRunning={isRunning}
        userId={user.id}
        setIsRunning={setIsRunning}
      />
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <WorkoutHeader title="Séance d'entraînement" />
      <ExerciseList 
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        isWorkoutStarted={workoutStarted}
        onExerciseClick={handleExerciseClick}
      />
      <WorkoutInProgress 
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseClick={handleExerciseClick}
        sessionId={sessionId}
      />
      <WorkoutSummaryDialog 
        open={showSummary} 
        onOpenChange={setShowSummary}
        stats={{
          duration: Math.round(duration / 60),
          totalWeight: 0,
          totalCalories: 0
        }}
        onConfirm={handleConfirmEndWorkout}
      />
    </div>
  );
};