
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";
import { useNotificationManager } from "@/hooks/use-notification-manager";

export const useWorkoutSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notify } = useNotificationManager();
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
      
      // Vérifier d'abord si la session existe
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        debugLogger.error("WorkoutSession", "Erreur lors de la récupération de la session:", sessionError);
        throw sessionError;
      }
      
      // Si la session existe mais n'a pas d'exercices ou le tableau est vide
      if (!sessionData.exercises || sessionData.exercises.length === 0) {
        debugLogger.log("WorkoutSession", "La session n'a pas d'exercices définis:", sessionData);
        
        // Définir des exercices par défaut
        const defaultExercises = ["Squats", "Pompes", "Abdominaux"];
        
        // Mettre à jour la session avec des exercices par défaut
        const { error: updateError } = await supabase
          .from('workout_sessions')
          .update({ exercises: defaultExercises })
          .eq('id', sessionId);
          
        if (updateError) {
          debugLogger.error("WorkoutSession", "Erreur lors de la mise à jour des exercices par défaut:", updateError);
        } else {
          sessionData.exercises = defaultExercises;
          debugLogger.log("WorkoutSession", "Exercices par défaut ajoutés à la session");
        }
      }
      
      debugLogger.log("WorkoutSession", "Données de session chargées:", sessionData);

      setSession(sessionData);
      
      // Initialiser le suivi de progression pour chaque exercice
      if (sessionData.exercises && sessionData.exercises.length > 0) {
        const progress: Record<string, {completed: boolean, sets: number, totalSets: number}> = {};
        sessionData.exercises.forEach((ex: string) => {
          progress[ex] = {
            completed: false,
            sets: 0,
            totalSets: 3
          };
        });
        setExerciseProgress(progress);
      }

      // Vérifier si l'utilisateur a des statistiques d'entraînement
      if (sessionData.user_id) {
        const { data: statsData, error: statsError } = await supabase
          .from('training_stats')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();
        
        if (statsError) {
          debugLogger.error("WorkoutSession", "Erreur lors de la récupération des statistiques:", statsError);
        } else if (!statsData) {
          debugLogger.log("WorkoutSession", "Pas de statistiques trouvées, création d'une entrée initiale");
          
          // Créer une entrée initiale dans training_stats
          await supabase
            .from('training_stats')
            .insert([{
              session_id: sessionId,
              user_id: sessionData.user_id,
              created_at: new Date().toISOString()
            }]);
        }
      }

    } catch (error) {
      console.error('Erreur lors du chargement de la séance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la séance d'entraînement",
        variant: "destructive",
      });
      
      // Rediriger vers la page des entraînements en cas d'erreur critique
      navigate('/workouts');
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
      notify(
        "Erreur",
        "Impossible de préparer le résumé de la séance",
        "error"
      );
    }
  };
  
  const handleFinishWorkout = async () => {
    if (!sessionId) return;
    
    try {
      // Récupérer l'utilisateur actuel
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      
      if (!userId) {
        notify(
          "Erreur",
          "Utilisateur non authentifié",
          "error"
        );
        return;
      }
      
      // Calculer quelques statistiques pour la séance
      const totalExercises = session?.exercises?.length || 0;
      const completedExercises = Object.values(exerciseProgress).filter(ex => ex.completed).length;
      
      // Conversion de la durée en minutes
      const durationMinutes = Math.ceil(sessionDuration / 60);
      
      // Calculer les calories brûlées (estimation simple)
      const caloriesBurned = Math.round(durationMinutes * 10);
      
      // Vérifier si la session a un user_id, sinon l'ajouter
      if (!session.user_id) {
        const { error: updateUserError } = await supabase
          .from('workout_sessions')
          .update({ user_id: userId })
          .eq('id', sessionId);
          
        if (updateUserError) {
          debugLogger.error("WorkoutSession", "Erreur lors de l'ajout de l'ID utilisateur à la séance:", updateUserError);
        }
      }
      
      // Mise à jour des statistiques d'entraînement
      const { data: statsData, error: statsError } = await supabase
        .from('training_stats')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();
        
      if (!statsData) {
        // Créer une nouvelle entrée si elle n'existe pas
        await supabase
          .from('training_stats')
          .insert([{
            session_id: sessionId,
            user_id: userId || session.user_id,
            calories_burned: caloriesBurned,
            session_duration_minutes: durationMinutes,
            perceived_difficulty: 'moderate',
            muscle_groups_worked: session?.exercises || []
          }]);
      } else {
        // Mettre à jour l'entrée existante
        await supabase
          .from('training_stats')
          .update({
            calories_burned: caloriesBurned,
            session_duration_minutes: durationMinutes,
            perceived_difficulty: 'moderate',
            muscle_groups_worked: session?.exercises || []
          })
          .eq('id', statsData.id);
      }
      
      // Marquer la séance comme terminée sans utiliser 'completed_at'
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          perceived_difficulty: 'moderate'
        })
        .eq('id', sessionId);

      notify(
        "Séance terminée",
        `Durée: ${durationMinutes}min, Calories: ${caloriesBurned}`,
        "success"
      );
      
      // Rediriger vers la page des entraînements
      navigate('/workouts');
    } catch (error) {
      console.error('Erreur lors de la finalisation de la séance:', error);
      notify(
        "Erreur",
        "Impossible de finaliser la séance",
        "error"
      );
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
