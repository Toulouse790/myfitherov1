
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  total_duration_minutes: number;
  exercises: string[];
  calories_burned: number;
  completed: boolean;
  perceived_difficulty: 'easy' | 'moderate' | 'hard';
  created_at: string;
}

export const useWorkoutSession = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Vérifier s'il y a une session active au chargement
  useEffect(() => {
    if (user) {
      checkActiveSession();
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [user]);

  const checkActiveSession = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setActiveSession(data);
        // Calculer le temps écoulé depuis le début de la session
        const startTime = new Date(data.created_at).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setSessionTime(elapsedSeconds);
        
        // Démarrer le timer
        startTimer();
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de session active:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = async (programId?: string, exercises?: string[]) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour démarrer un entraînement",
        variant: "destructive",
      });
      navigate('/signin');
      return null;
    }

    try {
      setIsLoading(true);
      
      // Créer une nouvelle session d'entraînement
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          user_id: user.id,
          program_id: programId || null,
          exercises: exercises || [],
          total_duration_minutes: 0,
          calories_burned: 0,
          completed: false,
          perceived_difficulty: 'moderate'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setActiveSession(data);
      setSessionTime(0);
      startTimer();
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'entraînement. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const finishWorkout = async (additionalData: {
    perceived_difficulty?: 'easy' | 'moderate' | 'hard';
    calories_burned?: number;
  } = {}) => {
    if (!activeSession) return null;
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    try {
      setIsLoading(true);
      
      const durationMinutes = Math.floor(sessionTime / 60);
      
      // Mettre à jour la session pour la marquer comme terminée
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          completed: true,
          total_duration_minutes: durationMinutes,
          perceived_difficulty: additionalData.perceived_difficulty || 'moderate',
          calories_burned: additionalData.calories_burned || Math.round(durationMinutes * 8) // Estimation simple
        })
        .eq('id', activeSession.id)
        .select()
        .single();

      if (error) throw error;
      
      setActiveSession(null);
      
      toast({
        title: "Entraînement terminé",
        description: `Votre séance de ${durationMinutes} minutes a été enregistrée`,
      });
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la finalisation de la session:", error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer l'entraînement. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    isLoading,
    activeSession,
    sessionTime,
    formatTime,
    startWorkout,
    finishWorkout
  };
};
