
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { useSessionProgress } from "@/hooks/workout/useSessionProgress";
import { useSessionTimer } from "@/hooks/workout/useSessionTimer";
import { useSessionCompletion } from "@/hooks/workout/useSessionCompletion";

export const useWorkoutSession = () => {
  const { id: sessionId } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const {
    exerciseProgress,
    setExerciseProgress,
    currentExerciseIndex,
    showExerciseDetail,
    setShowExerciseDetail,
    handleExerciseSelect,
    handleExerciseComplete,
  } = useSessionProgress(sessionId);

  const {
    sessionDuration,
    sessionStartTime,
    setSessionStartTime,
    formatDuration,
  } = useSessionTimer();

  const {
    showSummaryDialog,
    setShowSummaryDialog,
    workoutStats,
    handleCompleteWorkout,
    handleFinishWorkout,
  } = useSessionCompletion(sessionId, sessionDuration, exerciseProgress);

  // Charger les données de la session
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId || !user) {
        setLoading(false);
        return;
      }

      try {
        debugLogger.log("useWorkoutSession", "Chargement des données de la session:", sessionId);
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          debugLogger.log("useWorkoutSession", "Données de session chargées:", data);
          setSession(data);
          
          if (data.exercise_progress && Object.keys(data.exercise_progress).length > 0) {
            setExerciseProgress(data.exercise_progress);
          } else if (data.exercises && data.exercises.length > 0) {
            const defaultProgress = data.exercises.reduce((acc: any, exercise: string) => {
              acc[exercise] = {
                completed: false,
                sets: 3,
                reps: 10,
                rest: 60,
                currentSet: 0,
                totalSets: 3
              };
              return acc;
            }, {});
            
            setExerciseProgress(defaultProgress);
            
            await supabase
              .from('workout_sessions')
              .update({ exercise_progress: defaultProgress })
              .eq('id', sessionId);
          }
          
          if (!sessionStartTime) {
            setSessionStartTime(Date.now());
          }
        }
      } catch (error) {
        debugLogger.error("useWorkoutSession", "Erreur lors du chargement de la session:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la session",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, user, toast, sessionStartTime, setSessionStartTime, setExerciseProgress]);

  return {
    loading,
    session,
    currentExerciseIndex,
    exerciseProgress,
    showExerciseDetail,
    sessionDuration,
    formatDuration,
    handleExerciseSelect,
    handleExerciseComplete,
    handleCompleteWorkout,
    setShowExerciseDetail,
    showSummaryDialog,
    setShowSummaryDialog,
    workoutStats,
    handleFinishWorkout
  };
};
