
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";

export const useWorkoutSession = () => {
  const { id: sessionId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, any>>({});
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    duration: 0,
    totalCalories: 0,
    completedExercises: 0,
  });

  // Fonction pour formater la durée (mm:ss)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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
          
          // Initialiser le suivi de progression des exercices s'il n'existe pas déjà
          if (data.exercise_progress && Object.keys(data.exercise_progress).length > 0) {
            setExerciseProgress(data.exercise_progress);
          } else if (data.exercises && data.exercises.length > 0) {
            // Créer un objet de progression par défaut si nécessaire
            const defaultProgress = data.exercises.reduce((acc, exercise) => {
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
            
            // Mettre à jour la session avec la progression par défaut
            await supabase
              .from('workout_sessions')
              .update({ exercise_progress: defaultProgress })
              .eq('id', sessionId);
          }
          
          // Démarrer le chronomètre de la session si ce n'est pas déjà fait
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
  }, [sessionId, user, toast, sessionStartTime]);

  // Mettre à jour le chronomètre
  useEffect(() => {
    if (!sessionStartTime) return;

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      setSessionDuration(elapsedSeconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Sélectionner un exercice
  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
    setShowExerciseDetail(true);
  };

  // Marquer un exercice comme terminé
  const handleExerciseComplete = useCallback(async (exerciseName: string) => {
    try {
      if (!session || !sessionId) return;
      
      // Mettre à jour la progression de l'exercice
      const updatedProgress = {
        ...exerciseProgress,
        [exerciseName]: {
          ...exerciseProgress[exerciseName],
          completed: true
        }
      };
      
      setExerciseProgress(updatedProgress);
      
      // Mettre à jour dans la base de données
      await supabase
        .from('workout_sessions')
        .update({ exercise_progress: updatedProgress })
        .eq('id', sessionId);
      
      setShowExerciseDetail(false);
      
      toast({
        title: "Exercice terminé !",
        description: "Bien joué ! Passez à l'exercice suivant.",
      });
      
    } catch (error) {
      debugLogger.error("useWorkoutSession", "Erreur lors de la mise à jour de la progression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    }
  }, [session, sessionId, exerciseProgress, toast]);

  // Terminer l'entraînement
  const handleCompleteWorkout = useCallback(() => {
    // Calculer les statistiques de l'entraînement
    const completedExercisesCount = Object.values(exerciseProgress).filter(ex => ex.completed).length;
    const estimatedCalories = Math.round(sessionDuration / 60 * 7); // Estimation simple: ~7 calories par minute
    
    setWorkoutStats({
      duration: Math.round(sessionDuration / 60), // en minutes
      totalCalories: estimatedCalories,
      completedExercises: completedExercisesCount
    });
    
    setShowSummaryDialog(true);
  }, [exerciseProgress, sessionDuration]);

  // Finaliser et enregistrer l'entraînement
  const handleFinishWorkout = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: Math.round(sessionDuration / 60),
          exercise_progress: exerciseProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      toast({
        title: "Entraînement terminé !",
        description: `Bravo ! Vous avez brûlé environ ${workoutStats.totalCalories} calories en ${workoutStats.duration} minutes.`,
      });
      
      navigate('/workouts');
    } catch (error) {
      debugLogger.error("useWorkoutSession", "Erreur lors de la finalisation de l'entraînement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'entraînement",
        variant: "destructive",
      });
    }
  }, [sessionId, sessionDuration, exerciseProgress, workoutStats, toast, navigate]);

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
