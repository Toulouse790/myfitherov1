
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";
import { WorkoutSummaryDialog } from "../WorkoutSummary";

export const useWorkoutSession = () => {
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
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    duration: 0,
    totalCalories: 0,
    totalWeight: 0
  });
  
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
      
      debugLogger.log("WorkoutSession", "Données de session chargées:", data);

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

  useEffect(() => {
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
      
      // Mettre à jour les statistiques
      setWorkoutStats({
        duration: durationMinutes,
        totalCalories: caloriesBurned,
        totalWeight: 0 // On pourrait calculer le poids total soulevé si on avait cette info
      });
      
      // Afficher le dialogue de résumé
      setShowSummaryDialog(true);
    } catch (error) {
      console.error('Erreur lors de la préparation du résumé:', error);
      toast({
        title: "Erreur",
        description: "Impossible de préparer le résumé de la séance",
        variant: "destructive",
      });
    }
  };
  
  const handleFinishWorkout = async () => {
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
        title: "Séance terminée",
        description: `Durée: ${durationMinutes}min, Calories: ${caloriesBurned}`,
      });
      
      // Rediriger vers la page des entraînements
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
