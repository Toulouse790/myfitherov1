
import { Header } from "@/components/Layout/Header";
import { ExerciseList } from "./ExerciseList";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dumbbell, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WorkoutSession = () => {
  const { t } = useLanguage();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState({});
  
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
        setLoading(true);
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        setSession(data);
        
        // Initialiser le suivi de progression pour chaque exercice
        if (data.exercises && data.exercises.length > 0) {
          const progress = {};
          data.exercises.forEach((ex) => {
            progress[ex] = {
              completed: false,
              sets: 0,
              totalSets: 3
            };
          });
          setExerciseProgress(progress);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la séance:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la séance d'entraînement",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, navigate, toast]);

  const handleExerciseComplete = async (exerciseName) => {
    // Marquer l'exercice comme terminé
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        completed: true
      }
    }));

    // Passer à l'exercice suivant si possible
    if (session?.exercises && currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      toast({
        title: "Exercice terminé !",
        description: "Passez à l'exercice suivant.",
      });
    } else {
      // Tous les exercices sont terminés
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
        
        // Rediriger vers la page de résumé
        navigate('/workouts');
      } catch (error) {
        console.error('Erreur lors de la finalisation de la séance:', error);
        toast({
          title: "Erreur",
          description: "Impossible de terminer la séance",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-2xl mx-auto p-4 flex items-center justify-center pt-20">
          <div className="animate-spin">
            <Dumbbell className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  // Si pas d'exercices dans la session
  if (!session?.exercises || session.exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-2xl mx-auto p-4 pt-20">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">{t("workouts.noExercisesFound")}</h2>
              <p className="text-muted-foreground">
                {t("workouts.sessionEmpty")}
              </p>
              <Button onClick={() => navigate('/workouts')}>
                {t("workouts.backToWorkouts")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentExercise = session.exercises[currentExerciseIndex];
  const progress = Math.round(((currentExerciseIndex + 1) / session.exercises.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">{t("workouts.todayProgram")}</h1>
        
        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{t("workouts.progress")}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Exercice actuel */}
        <Card className="mb-6 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("workouts.currentExercise")}</h2>
            <div className="bg-secondary/10 p-4 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{currentExercise}</p>
                <p className="text-sm text-muted-foreground">
                  {exerciseProgress[currentExercise]?.totalSets || 3} séries
                </p>
              </div>
              <Button 
                onClick={() => handleExerciseComplete(currentExercise)}
                className="ml-auto"
                variant="outline"
              >
                {t("workouts.completeExercise")}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Liste des exercices */}
        <ExerciseList 
          exercises={session.exercises}
          currentExerciseIndex={currentExerciseIndex}
          exerciseProgress={exerciseProgress}
          onExerciseSelect={(index) => setCurrentExerciseIndex(index)}
        />
        
        {/* Bouton pour terminer la séance */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={async () => {
              try {
                await supabase
                  .from('workout_sessions')
                  .update({
                    status: 'completed'
                  })
                  .eq('id', sessionId);
                
                toast({
                  title: t("workouts.sessionCompleted"),
                  description: t("workouts.congratulations"),
                });
                
                navigate('/workouts');
              } catch (error) {
                console.error('Erreur lors de la finalisation de la séance:', error);
                toast({
                  title: t("common.error"),
                  description: t("workouts.unableToCompleteSession"),
                  variant: "destructive",
                });
              }
            }}
            variant="outline"
            className="w-full"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("workouts.finishWorkout")}
          </Button>
        </div>
      </div>
    </div>
  );
};
