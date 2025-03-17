
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { debugLogger } from "@/utils/debug-logger";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const { 
    duration, 
    isRunning, 
    startTimer, 
    stopTimer, 
    resetTimer 
  } = useWorkoutTimer();

  useEffect(() => {
    const fetchCurrentSession = async (sessionId: string) => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('exercises, status')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setExercises(data.exercises || []);
          setWorkoutStarted(data.status === 'in_progress');
        }
      } catch (error) {
        debugLogger.error("useWorkoutSession", "Erreur lors du chargement de la session:", error);
      }
    };

    // Extraire l'ID de session de l'URL
    const pathParts = window.location.pathname.split('/');
    const sessionId = pathParts[pathParts.length - 1];
    if (sessionId && sessionId !== 'workouts') {
      fetchCurrentSession(sessionId);
    }
  }, [user]);

  const createWorkoutSession = async (type: string) => {
    try {
      if (!user) {
        debugLogger.warn("useWorkoutSession", "Tentative de création de séance sans authentification");
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour créer une séance",
          variant: "destructive",
        });
        // Enregistrer la page actuelle et rediriger vers la connexion
        navigate('/signin', { state: { from: '/workouts' } });
        return;
      }

      // First check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }]);

        if (insertError) {
          throw insertError;
        }
      }

      if (type === 'favorites') {
        navigate('/workouts');
        return;
      }

      // Définir les exercices selon le type
      let defaultExercises: string[];
      let workoutType: string;

      if (type === 'cardio') {
        defaultExercises = [
          "Course à pied",
          "Vélo stationnaire",
          "Rameur",
          "Corde à sauter"
        ];
        workoutType = 'cardio';
      } else if (type === 'hiit') {
        defaultExercises = [
          "Burpees",
          "Mountain climbers",
          "Jumping jacks",
          "High knees"
        ];
        workoutType = 'hiit';
      } else {
        defaultExercises = type === 'quick' ? [
          "Extensions triceps",
          "Développé couché",
          "Squat"
        ] : [
          "Extensions triceps",
          "Développé couché", 
          "Squat",
          "Soulevé de terre",
          "Développé militaire"
        ];
        workoutType = 'strength';
      }

      const workoutData = {
        user_id: user.id,
        workout_type: workoutType,
        status: 'in_progress',
        target_duration_minutes: type === 'quick' ? 30 : 45,
        exercises: defaultExercises,
      };

      const { data: workoutSession, error } = await supabase
        .from('workout_sessions')
        .insert(workoutData)
        .select()
        .single();

      if (error) {
        debugLogger.error("useWorkoutSession", "Erreur Supabase:", error);
        throw error;
      }

      if (workoutSession) {
        debugLogger.log("useWorkoutSession", "Session d'entraînement créée:", workoutSession);
        navigate(`/workouts/${workoutSession.id}`);
      }
    } catch (error) {
      debugLogger.error("useWorkoutSession", "Erreur lors de la création de l'entraînement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  const handleExerciseClick = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  const handleConfirmEndWorkout = async (difficulty: string, duration: number, muscleGroups: string[]) => {
    try {
      const pathParts = window.location.pathname.split('/');
      const sessionId = pathParts[pathParts.length - 1];
      
      if (!sessionId || !user) return;

      const { error } = await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          total_duration_minutes: Math.floor(duration / 60),
          difficulty_level: difficulty
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Félicitations !",
        description: "Votre séance d'entraînement a été enregistrée",
      });

      navigate('/workouts');
    } catch (error) {
      debugLogger.error("useWorkoutSession", "Erreur lors de la finalisation de l'entraînement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la séance",
        variant: "destructive",
      });
    }
  };

  return { 
    exercises, 
    currentExerciseIndex, 
    workoutStarted, 
    duration,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    handleExerciseClick,
    handleConfirmEndWorkout,
    createWorkoutSession 
  };
};
