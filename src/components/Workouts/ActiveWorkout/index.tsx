
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutProgress } from "./WorkoutProgress";
import { WorkoutHeader } from "./WorkoutHeader";
import { ExerciseCard } from "./ExerciseCard";
import { WorkoutActions } from "./WorkoutActions";
import { useLanguage } from "@/contexts/LanguageContext";

export const ActiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
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
              title: t("workouts.restFinished"),
              description: t("workouts.readyForNextSet"),
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
          title: t("workouts.noExercisesFound"),
          description: t("workouts.selectExercisesForSession"),
        });
        navigate('/workouts/generate');
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la séance:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.unableToLoadSessionDetails"),
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
        title: t("workouts.setCompleted"),
        description: t("workouts.restBeforeNextSet", { seconds: 90 }),
      });
    } else {
      // Série finale de l'exercice, vérifier s'il y a un exercice suivant
      setRestTime(120);
      
      toast({
        title: t("workouts.exerciseCompleted"),
        description: t("workouts.restBeforeNextExercise", { seconds: 120 }),
      });
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
    } else {
      toast({
        title: t("workouts.sessionCompleted"),
        description: t("workouts.allExercisesCompleted"),
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
      <WorkoutHeader 
        navigate={navigate} 
        sessionTime={sessionTime} 
        formatTime={formatTime} 
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t("workouts.workoutSession")}</h1>
        <div className="text-sm text-muted-foreground">
          {t("workouts.exerciseProgress", { current: currentExerciseIndex + 1, total: exercises.length })}
        </div>
      </div>

      <WorkoutProgress progress={progress} />

      <ExerciseCard 
        currentExercise={currentExercise}
        currentSet={currentSet}
        totalSets={totalSets}
        restTime={restTime}
        handleCompleteSet={handleCompleteSet}
        handleSkipRest={handleSkipRest}
      />

      <WorkoutActions 
        handleFinishWorkout={handleFinishWorkout}
        handleNextExercise={handleNextExercise}
        currentExerciseIndex={currentExerciseIndex}
        exercisesLength={exercises.length}
      />
    </div>
  );
};
