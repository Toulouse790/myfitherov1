
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, ArrowLeft, ArrowRight, Check, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkoutSession } from "@/hooks/use-workout-session";

export const ActiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { activeSession, formatTime, sessionTime, finishWorkout } = useWorkoutSession();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(3);
  const [restTime, setRestTime] = useState<number | null>(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      fetchSessionDetails();
    }
  }, [id]);

  // Effet pour gérer le timer de repos
  useEffect(() => {
    // Nettoyer l'intervalle précédent si existant
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Démarrer un nouveau timer si restTime est défini
    if (restTime !== null && restTime > 0) {
      timerRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev === null || prev <= 1) {
            // Nettoyer l'intervalle quand le timer atteint 0
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            // Notification que le repos est terminé
            toast({
              title: "Repos terminé",
              description: "Prêt pour la série suivante ?",
            });
            
            // Si toutes les séries sont terminées, passer à l'exercice suivant
            if (currentSet >= totalSets) {
              handleNextExercise();
            }
            
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Nettoyer l'intervalle lors du démontage
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [restTime, currentSet, totalSets]);

  const fetchSessionDetails = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        navigate('/signin');
        return;
      }
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data.exercises && data.exercises.length > 0) {
        setExercises(data.exercises);
      } else {
        // Pas d'exercices trouvés, offrir à l'utilisateur de retourner à la sélection
        toast({
          title: "Aucun exercice trouvé",
          description: "Veuillez sélectionner des exercices pour votre séance",
        });
        navigate('/workouts/generate');
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la séance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la séance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSet = async () => {
    if (currentSet < totalSets) {
      // Passer à la série suivante avec temps de repos
      setCurrentSet(prev => prev + 1);
      setRestTime(90);
      
      toast({
        title: "Série complétée !",
        description: "Repos de 90 secondes avant la prochaine série",
      });
    } else {
      // Série finale de l'exercice, vérifier s'il y a un exercice suivant
      setRestTime(120);
      
      toast({
        title: "Exercice terminé !",
        description: "Repos de 120 secondes avant le prochain exercice",
      });
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
    } else {
      toast({
        title: "Séance terminée !",
        description: "Tous les exercices sont complétés",
      });
    }
  };

  const handleFinishWorkout = () => {
    finishWorkout({
      perceived_difficulty: 'moderate',
      calories_burned: Math.round(sessionTime / 60 * 8)
    });
  };

  const handleSkipRest = () => {
    setRestTime(null);
    if (currentSet > totalSets) {
      handleNextExercise();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex * totalSets) + (currentSet - 1)) / (exercises.length * totalSets) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate('/workouts')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <span className="font-mono">{formatTime(sessionTime)}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Séance d'entraînement</h1>
        <div className="text-sm text-muted-foreground">
          Exercice {currentExerciseIndex + 1} sur {exercises.length}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle>{currentExercise}</CardTitle>
          <CardDescription>
            Série {currentSet} sur {totalSets}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {restTime !== null ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="text-3xl font-mono">{restTime}s</div>
              <div className="text-muted-foreground">Temps de repos</div>
              <Button variant="outline" onClick={handleSkipRest}>
                Passer le repos
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Répétitions recommandées</span>
                  <div className="text-3xl font-bold mt-1">12</div>
                </div>
                <div>
                  <span className="font-medium">Poids</span>
                  <div className="text-3xl font-bold mt-1">20 kg</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {restTime === null && (
            <Button 
              className="w-full" 
              onClick={handleCompleteSet}
              disabled={currentExerciseIndex >= exercises.length}
            >
              Valider la série
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={handleFinishWorkout}
          className="w-full"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Terminer
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleNextExercise}
          className="w-full"
          disabled={currentExerciseIndex >= exercises.length - 1}
        >
          Exercice suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
