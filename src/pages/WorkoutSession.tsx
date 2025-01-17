import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, AlertCircle } from "lucide-react";
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
  const [estimatedCalories, setEstimatedCalories] = useState(0);
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
            status: 'completed'
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

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 pt-40 pb-8 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Aucun exercice trouvé</h2>
              <p className="text-muted-foreground">
                Cette séance d'entraînement ne contient aucun exercice.
              </p>
              <Button onClick={() => navigate('/workouts')}>
                Retourner aux entraînements
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 pt-40 pb-8 space-y-6">
        <WorkoutHeader 
          sessionId={sessionId || ''}
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
              exerciseId={sessionId || ''}
              exerciseName={exercises[currentExerciseIndex]}
              onComplete={async (exerciseId, exerciseName, difficulty, notes, calories) => {
                await handleExerciseComplete(currentExerciseIndex);
              }}
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