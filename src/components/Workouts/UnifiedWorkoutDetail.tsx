import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Timer, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseSets } from "./ExerciseSets";
import { motion } from "framer-motion";

export const UnifiedWorkoutDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    const fetchSessionData = async () => {
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

    fetchSessionData();

    // Timer pour la durée de la séance
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, toast]);

  const handleExerciseComplete = (index: number) => {
    if (index < exercises.length - 1) {
      setCurrentExerciseIndex(index + 1);
      setRestTimer(90);
      toast({
        title: "Exercice terminé !",
        description: "Passez à l'exercice suivant après la période de repos.",
      });
    } else {
      toast({
        title: "Séance terminée !",
        description: "Bravo ! Vous avez terminé tous les exercices.",
      });
      navigate('/workouts');
    }
  };

  const handleAddSet = async () => {
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

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className="font-mono">
            {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {exercises[currentExerciseIndex]}
              </h2>
              <Button
                variant="outline"
                onClick={handleAddSet}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une série
              </Button>
            </div>

            <ExerciseSets
              exercises={[exercises[currentExerciseIndex]]}
              onExerciseComplete={() => handleExerciseComplete(currentExerciseIndex)}
              currentExerciseIndex={0}
              sessionId={sessionId}
            />

            {restTimer !== null && (
              <div className="fixed bottom-20 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full animate-pulse">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <span className="font-medium">Repos: {restTimer}s</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-gray-900 font-medium">Notes</h3>
              <Textarea
                placeholder="Ajouter des notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white border text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};