import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { generateWorkoutPlan } from "@/components/Dashboard/WorkoutSuggestions/workoutPlanGenerator";

export const useWorkoutSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCardio, setIsCardio] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
      checkSessionType(session);
      fetchSessionExercises(session);
    }
  }, [location]);

  const fetchSessionExercises = async (sessionId: string) => {
    try {
      // Récupérer d'abord la session pour avoir les IDs des exercices
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('exercises')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      if (session?.exercises) {
        console.log("IDs des exercices récupérés:", session.exercises);
        
        // Récupérer les détails des exercices à partir des IDs
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('name')
          .in('id', session.exercises);

        if (exercisesError) throw exercisesError;

        if (exercisesData) {
          const exerciseNames = exercisesData.map(ex => ex.name);
          console.log("Noms des exercices récupérés:", exerciseNames);
          setExercises(exerciseNames);
          setWorkoutStarted(true);
        }
      }
    } catch (error) {
      console.error('Error fetching session exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les exercices de la séance",
        variant: "destructive",
      });
    }
  };

  const checkSessionType = async (sessionId: string) => {
    try {
      const { data: session } = await supabase
        .from('workout_sessions')
        .select('type')
        .eq('id', sessionId)
        .single();

      if (session?.type === 'cardio') {
        setIsCardio(true);
      }
    } catch (error) {
      console.error('Error checking session type:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleRegenerateWorkout = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer un entraînement",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        toast({
          title: "Profil incomplet",
          description: "Veuillez d'abord remplir le questionnaire initial",
          variant: "destructive",
        });
        return;
      }

      const userProfile = {
        age: 30,
        weight: 75,
        height: 175,
        goal: profile.objective,
        workoutsPerWeek: parseInt(profile.training_frequency),
        dailyCalories: 2000,
        recoveryCapacity: "low" as const
      };

      const newPlan = generateWorkoutPlan(userProfile);

      if (sessionId) {
        const { error: updateError } = await supabase
          .from('workout_sessions')
          .update({ 
            is_adapted: true,
            initial_energy_level: 'bad'
          })
          .eq('id', sessionId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Programme adapté",
        description: "Un nouveau programme moins intense a été généré",
      });

      navigate(`/workouts/exercise/next-workout?session=${sessionId}`);
    } catch (error) {
      console.error('Error regenerating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer un nouvel entraînement",
        variant: "destructive",
      });
    }
  };

  const handleExerciseClick = (index: number) => {
    console.log("Setting current exercise index to:", index);
    setCurrentExerciseIndex(index);
  };

  const handleConfirmEndWorkout = async (difficulty: "easy" | "medium" | "hard") => {
    try {
      if (!sessionId || !user) return;

      // Update the workout session status
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // Create training stats entry
      const { error: statsError } = await supabase
        .from('training_stats')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          duration_minutes: Math.round(duration / 60),
          perceived_difficulty: difficulty
        });

      if (statsError) throw statsError;

      toast({
        title: "Séance terminée !",
        description: "Vos statistiques ont été enregistrées.",
      });

      // Redirect to workouts page after successful completion
      navigate('/workouts');

    } catch (error) {
      console.error('Error ending workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer la séance",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    sessionId,
    isCardio,
    duration,
    isRunning,
    exercises,
    currentExerciseIndex,
    workoutStarted,
    setIsRunning,
    handleRegenerateWorkout,
    handleExerciseClick,
    handleConfirmEndWorkout
  };
};