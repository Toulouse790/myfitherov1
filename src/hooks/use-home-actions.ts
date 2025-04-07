
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";
import { supabase } from "@/integrations/supabase/client";

export const useHomeActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleAIGeneration = () => {
    navigate('/workouts/generate');
  };

  const handleCreateSession = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une séance",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    try {
      setIsLoading(true);
      
      debugLogger.log("useHomeActions", "Création d'une séance rapide");
      
      // Exercices par défaut pour une séance rapide
      const defaultExercises = ["Squats", "Pompes", "Rowing avec haltères", "Fentes"];
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          exercises: defaultExercises,
          status: 'in_progress',
          workout_type: 'quick',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Séance créée",
        description: "C'est parti pour votre séance!",
      });
      
      navigate(`/workout/${data.id}`);
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance d'entraînement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCreateSession,
    handleAIGeneration,
    isLoading
  };
};
