import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutHeader } from "./WorkoutDetail/WorkoutHeader";
import { ExerciseSection } from "./WorkoutDetail/ExerciseSection";
import { WorkoutNotes } from "./WorkoutDetail/WorkoutNotes";

export const UnifiedWorkoutDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        toast({
          title: "Erreur",
          description: "ID de séance manquant",
          variant: "destructive",
        });
        navigate('/workouts');
        return;
      }

      try {
        setIsLoading(true);
        const { data: session, error } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        if (session?.exercises) {
          const validExercises = session.exercises.filter(Boolean);
          console.log("Valid exercises:", validExercises);
          setExercises(validExercises);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la séance",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, toast, navigate]);

  const handleExerciseComplete = async (index: number) => {
    if (index < exercises.length - 1) {
      setCurrentExerciseIndex(index + 1);
      setRestTimer(90);
      toast({
        title: "Exercice terminé !",
        description: "Passez à l'exercice suivant après la période de repos.",
      });
    } else {
      try {
        await supabase
          .from('workout_sessions')
          .update({
            status: 'completed',
            total_duration_minutes: Math.floor(sessionDuration / 60)
          })
          .eq('id', sessionId);

        toast({
          title: "Séance terminée !",
          description: "Bravo ! Vous avez terminé tous les exercices.",
        });
        navigate('/workouts');
      } catch (error) {
        console.error('Error completing workout:', error);
        toast({
          title: "Erreur",
          description: "Impossible de terminer la séance",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddSet = async () => {
    if (!exercises[currentExerciseIndex]) {
      toast({
        title: "Erreur",
        description: "Aucun exercice sélectionné",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('exercise_sets')
        .insert({
          session_id: sessionId,
          exercise_name: exercises[currentExerciseIndex],
          set_number: 1,
          reps: 12,
          weight: 20,
        });

      if (error) throw error;

      toast({
        title: "Série ajoutée",
        description: "Une nouvelle série a été ajoutée à l'exercice.",
      });
    } catch (error) {
      console.error('Error adding set:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la série",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <WorkoutHeader sessionDuration={sessionDuration} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            <ExerciseSection
              exerciseName={exercises[currentExerciseIndex]}
              onAddSet={handleAddSet}
              onExerciseComplete={() => handleExerciseComplete(currentExerciseIndex)}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};