import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutTimer } from "./WorkoutTimer";
import { ExerciseProgress } from "./ExerciseProgress";
import { ExerciseControls } from "./ExerciseControls";
import { ExerciseSet } from "./ExerciseSet";
import { useExerciseData } from "@/hooks/use-exercise-data";

export const NextWorkoutDetail = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [duration, setDuration] = useState(0);
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [completedSets, setCompletedSets] = useState<number>(0);

  const { exerciseNames } = useExerciseData(exercises);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSessionExercises = async () => {
      if (!sessionId) return;

      try {
        const { data: session, error } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (error) throw error;
        if (session?.exercises) {
          setExercises(session.exercises);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la séance",
          variant: "destructive",
        });
      }
    };

    fetchSessionExercises();
  }, [sessionId, toast]);

  const handleSetComplete = async () => {
    if (!sessionId || !user?.id) return;

    try {
      const exerciseName = exerciseNames[exercises[currentExerciseIndex]] || "Unknown";

      await supabase
        .from('exercise_sets')
        .insert({
          session_id: sessionId,
          exercise_name: exerciseName,
          set_number: currentSet,
          reps: reps,
          weight: weight,
          rest_time_seconds: 90
        });

      setCompletedSets(prev => prev + 1);
      
      if (currentSet < 3) {
        setCurrentSet(prev => prev + 1);
        setRestTimer(90);

        const interval = setInterval(() => {
          setRestTimer(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(interval);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Si c'est la dernière série
        if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
          setCompletedSets(0);
        } else {
          // Fin de la séance
          await supabase
            .from('workout_sessions')
            .update({
              status: 'completed',
              total_duration_minutes: Math.floor(duration / 60)
            })
            .eq('id', sessionId);

          toast({
            title: "Séance terminée !",
            description: "Bravo, vous avez terminé votre séance d'entraînement !",
          });
          navigate('/workouts');
        }
      }
    } catch (error) {
      console.error('Error completing set:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la série",
        variant: "destructive",
      });
    }
  };

  if (!exercises.length) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Chargement de la séance...
          </p>
        </Card>
      </div>
    );
  }

  const currentExerciseName = exerciseNames[exercises[currentExerciseIndex]];

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-4 border-b">
        <WorkoutTimer duration={duration} />
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{currentExerciseName || "Chargement..."}</h2>
          <ExerciseProgress currentSet={currentSet} totalSets={3} />
        </div>

        <ExerciseControls
          weight={weight}
          reps={reps}
          onWeightChange={setWeight}
          onRepsChange={setReps}
        />

        <ExerciseSet
          setNumber={currentSet}
          totalSets={3}
          isCompleted={false}
          restTimer={restTimer}
          onComplete={handleSetComplete}
        />
      </Card>
    </div>
  );
};