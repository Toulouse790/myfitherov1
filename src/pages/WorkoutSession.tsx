import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ChevronRight, ChevronLeft, Timer, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSets } from "@/components/Workouts/ExerciseSets";
import { Progress } from "@/components/ui/progress";
import { formatWorkoutTime } from "@/utils/time";

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
        // Estimation très basique des calories (à améliorer)
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
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin">
          <Dumbbell className="h-8 w-8" />
        </div>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header avec progression et timer */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 p-4 border-b">
        <div className="container max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Timer className="h-6 w-6 text-primary" />
              <span className="text-xl font-mono">{formatWorkoutTime(sessionDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">{estimatedCalories} kcal</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Navigation des exercices */}
      <div className="fixed top-32 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleNavigateExercise('prev')}
          disabled={currentExerciseIndex === 0}
          className="bg-background"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleNavigateExercise('next')}
          disabled={currentExerciseIndex === exercises.length - 1}
          className="bg-background"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline des exercices */}
      <div className="mt-32 mb-4 flex gap-2 overflow-x-auto pb-2">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
              index === currentExerciseIndex
                ? 'bg-primary text-primary-foreground'
                : index < currentExerciseIndex
                ? 'bg-muted text-muted-foreground'
                : 'bg-secondary/10 text-secondary-foreground'
            }`}
          >
            {exercise}
          </div>
        ))}
      </div>

      {/* Contenu principal */}
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

      {/* Prochain exercice */}
      {currentExerciseIndex < exercises.length - 1 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Prochain exercice:</h3>
          <Card className="p-4 bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <span>{exercises[currentExerciseIndex + 1]}</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}