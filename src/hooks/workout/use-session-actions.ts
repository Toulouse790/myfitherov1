
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { debugLogger } from "@/utils/debug-logger";

export const useSessionActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const createWorkoutSession = async (type: string, customExercises?: string[]) => {
    try {
      if (!user) {
        debugLogger.warn("useSessionActions", "Tentative de création de séance sans authentification");
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour créer une séance",
          variant: "destructive",
        });
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

      if (type === 'custom' && customExercises && customExercises.length > 0) {
        defaultExercises = customExercises;
        workoutType = 'strength';
        debugLogger.log("useSessionActions", "Création d'une séance avec exercices personnalisés:", customExercises);
      } else if (type === 'cardio') {
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
        debugLogger.error("useSessionActions", "Erreur Supabase:", error);
        throw error;
      }

      if (workoutSession) {
        debugLogger.log("useSessionActions", "Session d'entraînement créée:", workoutSession);
        navigate(`/workouts/${workoutSession.id}`);
      }
    } catch (error) {
      debugLogger.error("useSessionActions", "Erreur lors de la création de l'entraînement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
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
      debugLogger.error("useSessionActions", "Erreur lors de la finalisation de l'entraînement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la séance",
        variant: "destructive",
      });
    }
  };

  return {
    createWorkoutSession,
    handleConfirmEndWorkout
  };
};
