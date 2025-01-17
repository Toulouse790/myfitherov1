import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSets } from "@/components/Workouts/ExerciseSets";
import { WorkoutHeader } from "@/components/Workouts/WorkoutSession/WorkoutHeader";
import { ExerciseNavigation } from "@/components/Workouts/WorkoutSession/ExerciseNavigation";
import { ExerciseTimeline } from "@/components/Workouts/WorkoutSession/ExerciseTimeline";
import { NextExercisePreview } from "@/components/Workouts/WorkoutSession/NextExercisePreview";

export default function WorkoutSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedCalories, setEstimatedCalories] = useState(0);

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
          console.log("Exercices chargés:", session.exercises);
          setExercises(session.exercises);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la séance",
          variant: "destructive",
        });
        navigate('/workouts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();

    const interval = setInterval(() => {
      setSessionDuration(prev => {
        const newDuration = prev + 1;
        setEstimatedCalories(Math.floor(newDuration * 0.15));
        return newDuration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, toast, navigate]);

  const handleExerciseComplete = async (index: number) => {
    if (index < exercises.length - 1) {
      setCurrentExerciseIndex(index + 1);
      toast({
        title: "Exercice terminé !",
        description: "Passez à l'exercice suivant.",
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

  const handleNavigateExercise = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    } else if (direction === 'next' && currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-40">
        <div className="animate-spin">
          <Dumbbell className="h-8 w-8" />
        </div>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 pt-40 pb-8 space-y-6">
        <WorkoutHeader 
          sessionDuration={sessionDuration}
          estimatedCalories={estimatedCalories}
          progress={progress}
        />

        <ExerciseNavigation
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={exercises.length}
          onNavigate={handleNavigateExercise}
        />

        <ExerciseTimeline 
          exercises={exercises}
          currentExerciseIndex={currentExerciseIndex}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <ExerciseSets
              exercises={exercises}
              currentExerciseIndex={currentExerciseIndex}
              onExerciseComplete={handleExerciseComplete}
              sessionId={sessionId}
            />
          </Card>
        </motion.div>

        {currentExerciseIndex < exercises.length - 1 && (
          <NextExercisePreview nextExercise={exercises[currentExerciseIndex + 1]} />
        )}
      </div>
    </div>
  );
}