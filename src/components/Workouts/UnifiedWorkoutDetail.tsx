import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutHeader } from "./WorkoutDetail/WorkoutHeader";
import { ExerciseSets } from "./ExerciseSets";
import { WorkoutNotes } from "./WorkoutDetail/WorkoutNotes";
import { Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const UnifiedWorkoutDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

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

      if (!user) {
        console.log("Utilisateur non authentifié, redirection vers /signin");
        navigate('/signin');
        return;
      }

      try {
        setIsLoading(true);
        const { data: session, error } = await supabase
          .from('workout_sessions')
          .select('exercises, workout_type, status, target_duration_minutes, user_id')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        if (session.user_id !== user.id) {
          toast({
            title: "Erreur",
            description: "Vous n'avez pas accès à cette séance",
            variant: "destructive",
          });
          navigate('/workouts');
          return;
        }

        if (session?.exercises) {
          const validExercises = session.exercises.filter(Boolean);
          console.log("Exercices chargés:", validExercises);
          setExercises(validExercises);
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
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, toast, navigate, user]);

  const handleFinishWorkout = async () => {
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
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Exercices de la séance</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSummary(true)}
                  className="gap-2"
                >
                  <Timer className="w-4 h-4" />
                  Terminer la séance
                </Button>
              </div>
              {exercises.map((exercise, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    index === currentExerciseIndex ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <h3 className="text-lg font-semibold">{exercise}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {showSummary && (
        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Récapitulatif de la séance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Durée totale</h3>
                <p>{Math.floor(sessionDuration / 60)} minutes</p>
              </div>
              <div>
                <h3 className="font-semibold">Exercices complétés</h3>
                <ul className="list-disc pl-4">
                  {exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleFinishWorkout}>
                Terminer la séance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};