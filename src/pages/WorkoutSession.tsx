import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Dumbbell, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSets } from "@/components/Workouts/ExerciseSets";

export default function WorkoutSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
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

    // Timer pour la durée de la séance
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
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

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin">
          <Dumbbell className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-6 border-b">
        <div className="flex items-center gap-6">
          <Timer className="w-6 h-6 text-primary" />
          <span className="font-mono text-xl">
            {Math.floor(sessionDuration / 60)}:{String(sessionDuration % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

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

      <div className="fixed bottom-4 right-4">
        <Button
          size="lg"
          className="shadow-lg"
          onClick={() => setCurrentExerciseIndex(prev => 
            prev < exercises.length - 1 ? prev + 1 : prev
          )}
          disabled={currentExerciseIndex === exercises.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
          Exercice suivant
        </Button>
      </div>
    </div>
  );
}