
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { WorkoutHeader } from "./WorkoutDetail/WorkoutHeader";
import { ExerciseSets } from "./ExerciseSets";
import { WorkoutNotes } from "./WorkoutDetail/WorkoutNotes";
import { Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { debugLogger } from "@/utils/debug-logger";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";

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
  const [workoutStats, setWorkoutStats] = useState({
    duration: 0,
    totalWeight: 0,
    totalCalories: 0
  });

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        navigate('/workouts');
        return;
      }

      if (!user) {
        debugLogger.log("UnifiedWorkoutDetail", "Utilisateur non authentifié, redirection vers /signin");
        navigate('/signin', { state: { from: `/workouts/${sessionId}` } });
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
          navigate('/workouts');
          return;
        }

        if (session?.exercises) {
          const validExercises = session.exercises.filter(Boolean);
          debugLogger.log("UnifiedWorkoutDetail", "Exercices chargés:", validExercises);
          setExercises(validExercises);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
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
  }, [sessionId, navigate, user]);

  const handleExerciseComplete = async (index: number) => {
    if (index < exercises.length - 1) {
      setCurrentExerciseIndex(index + 1);
    }
  };

  const handleFinishWorkout = async () => {
    // Calculer quelques statistiques d'entraînement
    // Dans un cas réel, vous pourriez récupérer ces données depuis la base de données
    const totalDurationMinutes = Math.floor(sessionDuration / 60);
    
    // Données de statistiques simulées
    setWorkoutStats({
      duration: totalDurationMinutes,
      totalWeight: Math.floor(Math.random() * 1000) + 500, // Simuler un poids total soulevé
      totalCalories: Math.floor(Math.random() * 300) + 100 // Simuler des calories brûlées
    });
    
    // Afficher le récapitulatif
    setShowSummary(true);
  };

  const handleConfirmEnd = async (difficulty: string, duration: number, muscleGroups: string[]) => {
    try {
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: Math.floor(sessionDuration / 60),
          difficulty_level: difficulty
        })
        .eq('id', sessionId);

      toast({
        title: "Séance terminée !",
        description: "Félicitations ! Votre séance a été enregistrée.",
      });

      // Rediriger vers la page des entraînements
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
                  onClick={handleFinishWorkout}
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

      {/* Dialog de récapitulatif de la séance */}
      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={workoutStats}
        onConfirm={handleConfirmEnd}
      />
    </div>
  );
};
