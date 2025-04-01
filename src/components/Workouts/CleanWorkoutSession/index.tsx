
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, CheckCircle2, Timer, RotateCw } from "lucide-react";
import { ExerciseItem } from "./ExerciseItem";
import { ExerciseDetail } from "./ExerciseDetail";

export const CleanWorkoutSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, { completed: boolean; sets: number }>>({}); 
  const [sessionDuration, setSessionDuration] = useState(0);
  const [startTime] = useState(Date.now());

  // Timer pour le suivi de la durée de session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  // Charger les données de la séance
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId || !user) {
        navigate('/workouts');
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        setSession(data);
        
        if (data.exercises && data.exercises.length > 0) {
          const progress: Record<string, { completed: boolean; sets: number }> = {};
          data.exercises.forEach((exercise: string) => {
            progress[exercise] = { completed: false, sets: 0 };
          });
          
          setExercises(data.exercises);
          setExerciseProgress(progress);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la séance:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la séance",
          variant: "destructive",
        });
        navigate('/workouts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, user, navigate, toast]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExerciseClick = (index: number) => {
    setCurrentExerciseIndex(index);
    setShowExerciseDetail(true);
  };

  const handleCompleteExercise = (exerciseName: string, completedSets: number) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseName]: { completed: true, sets: completedSets }
    }));
    setShowExerciseDetail(false);

    toast({
      title: "Exercice terminé !",
      description: `Vous avez terminé ${completedSets} séries`,
    });
  };

  const handleFinishWorkout = async () => {
    if (!sessionId) return;
    
    try {
      const totalExercises = exercises.length;
      const completedExercises = Object.values(exerciseProgress).filter(ex => ex.completed).length;
      const durationMinutes = Math.ceil(sessionDuration / 60);
      
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: durationMinutes,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      toast({
        title: "Félicitations !",
        description: `Séance terminée en ${durationMinutes} minutes`,
      });
      
      navigate('/workouts');
    } catch (error) {
      console.error('Erreur lors de la finalisation de la séance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la séance",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 pt-20 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement de la séance...</p>
        </div>
      </div>
    );
  }

  if (!session || !exercises.length) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 pt-20 pb-20">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg mb-4">Aucun exercice trouvé dans cette séance</p>
              <Button onClick={() => navigate('/workouts')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux entraînements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculer la progression globale
  const totalComplete = Object.values(exerciseProgress).filter(ex => ex.completed).length;
  const progress = (totalComplete / exercises.length) * 100;
  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 pt-20 pb-20">
        {/* En-tête de la séance */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-bold">Séance d'entraînement</h1>
                <p className="text-muted-foreground">
                  Durée: {formatDuration(sessionDuration)}
                </p>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/workouts')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression: {Math.round(progress)}%</span>
                <span>{totalComplete}/{exercises.length} exercices</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {showExerciseDetail ? (
          <ExerciseDetail 
            exerciseName={currentExercise}
            onComplete={(sets) => handleCompleteExercise(currentExercise, sets)}
            onBack={() => setShowExerciseDetail(false)}
          />
        ) : (
          <>
            {/* Exercice en cours */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">Exercice actuel</h2>
                <div className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-lg">{currentExercise}</p>
                      <p className="text-sm text-muted-foreground">
                        {exerciseProgress[currentExercise]?.completed 
                          ? "Terminé" 
                          : "En attente"}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleExerciseClick(currentExerciseIndex)}
                      variant={exerciseProgress[currentExercise]?.completed ? "outline" : "default"}
                    >
                      {exerciseProgress[currentExercise]?.completed 
                        ? <RotateCw className="mr-2 h-4 w-4" />
                        : <Timer className="mr-2 h-4 w-4" />
                      }
                      {exerciseProgress[currentExercise]?.completed 
                        ? "Revoir" 
                        : "Commencer"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des exercices */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-medium mb-4">Liste des exercices</h2>
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <ExerciseItem
                      key={exercise}
                      exerciseName={exercise}
                      isCompleted={exerciseProgress[exercise]?.completed || false}
                      isCurrent={index === currentExerciseIndex}
                      onClick={() => handleExerciseClick(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bouton de fin de séance */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleFinishWorkout}
                disabled={totalComplete === 0}
                className="w-full sm:w-auto"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Terminer la séance
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
