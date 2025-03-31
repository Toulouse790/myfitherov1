
import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { ExerciseList } from "./ExerciseList";
import { ExerciseDetail } from "./ExerciseDetail";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dumbbell, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export const WorkoutSession = () => {
  const { t } = useLanguage();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, {
    completed: boolean;
    sets: number;
    totalSets: number;
  }>>({});
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [startTime] = useState(Date.now());
  
  // Timer pour la durée de la séance
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Formatage de la durée (mm:ss)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
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
          const progress: Record<string, {completed: boolean, sets: number, totalSets: number}> = {};
          data.exercises.forEach((ex: string) => {
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

  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
    setShowExerciseDetail(true);
  };

  const handleExerciseComplete = (exerciseName: string, totalSets: number) => {
    // Marquer l'exercice comme terminé
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        completed: true,
        sets: totalSets,
        totalSets
      }
    }));

    setShowExerciseDetail(false);

    // Passer automatiquement à l'exercice suivant s'il y en a un
    if (session?.exercises && currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeout(() => {
        setShowExerciseDetail(true);
      }, 500);
    } else if (session?.exercises && currentExerciseIndex === session.exercises.length - 1) {
      // Afficher un toast indiquant que tous les exercices sont terminés
      toast({
        title: "Félicitations !",
        description: "Vous avez terminé tous les exercices.",
      });
    }
  };

  const handleCompleteWorkout = async () => {
    if (!sessionId) return;
    
    try {
      // Calculer quelques statistiques pour la séance
      const totalExercises = session?.exercises?.length || 0;
      const completedExercises = Object.values(exerciseProgress).filter(ex => ex.completed).length;
      
      // Conversion de la durée en minutes
      const durationMinutes = Math.ceil(sessionDuration / 60);
      
      // Calculer les calories brûlées (estimation simple)
      const caloriesBurned = Math.round(durationMinutes * 10);
      
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          perceived_difficulty: 'moderate',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      toast({
        title: t("workouts.sessionCompleted"),
        description: `${t("workouts.duration")}: ${durationMinutes}min, ${t("workouts.caloriesBurned")}: ${caloriesBurned}`,
      });
      
      // Rediriger vers la page des entraînements
      navigate('/workouts');
    } catch (error) {
      console.error('Erreur lors de la finalisation de la séance:', error);
      toast({
        title: t("common.error"),
        description: t("workouts.unableToCompleteSession"),
        variant: "destructive",
      });
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

  // Calculer la progression globale
  const completedExercises = Object.values(exerciseProgress).filter(ex => ex.completed).length;
  const totalProgress = Math.round((completedExercises / session.exercises.length) * 100);
  
  // L'exercice actuel
  const currentExercise = session.exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 pt-20 pb-20">
        {/* En-tête de la séance */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">
              {session.name || t("workouts.todayProgram")}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDuration(sessionDuration)}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-1">
            <span>{t("workouts.progress")}</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
        
        {/* Afficher soit la liste des exercices, soit les détails de l'exercice courant */}
        {showExerciseDetail ? (
          <ExerciseDetail 
            exerciseName={currentExercise}
            onComplete={handleExerciseComplete}
            onBack={() => setShowExerciseDetail(false)}
            initialSets={exerciseProgress[currentExercise]?.totalSets}
          />
        ) : (
          <>
            {/* Carte de l'exercice actuel */}
            <Card className="mb-6 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t("workouts.currentExercise")}</h2>
                <div className="bg-secondary/10 p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{currentExercise}</p>
                    <p className="text-sm text-muted-foreground">
                      {exerciseProgress[currentExercise]?.totalSets || 3} {t("workouts.sets")}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowExerciseDetail(true)}
                    className="ml-auto"
                  >
                    {t("workouts.start")}
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Liste des exercices */}
            <ExerciseList 
              exercises={session.exercises}
              currentExerciseIndex={currentExerciseIndex}
              exerciseProgress={exerciseProgress}
              onExerciseSelect={handleExerciseSelect}
            />
          </>
        )}
        
        {/* Bouton pour terminer la séance */}
        <div className="mt-8">
          <Button 
            onClick={handleCompleteWorkout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            {t("workouts.finishWorkout")}
          </Button>
        </div>
      </div>
    </div>
  );
};
