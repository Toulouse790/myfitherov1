import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useHomeActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = () => {
    console.log("Attempting to create session...");
    if (!user) {
      console.log("User not authenticated, redirecting to signin");
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer une séance",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    console.log("Redirecting to workouts page");
    navigate('/workouts');
  };

  const handleAIGeneration = async () => {
    console.log("Starting AI workout generation...");
    if (!user) {
      console.log("User not authenticated, redirecting to signin");
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour utiliser la génération IA",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching user preferences...");
      const { data: preferences, error: prefError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefError) {
        console.error("Error fetching preferences:", prefError);
        throw new Error("Impossible de récupérer vos préférences");
      }

      console.log("Generating workout with preferences:", preferences);
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: { userPreferences: preferences }
      });

      if (error) throw error;

      console.log("Workout generated successfully, redirecting...");
      navigate('/workout-generate', { state: { generatedWorkout: data } });
      toast({ title: "Programme généré !", description: "Votre programme personnalisé est prêt." });
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le programme pour le moment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStats = () => {
    console.log("Attempting to access stats...");
    if (!user) {
      console.log("User not authenticated, redirecting to signin");
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour voir vos statistiques",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    console.log("Redirecting to stats page");
    navigate('/stats');
  };

  const handleTrainingSuggestions = () => {
    console.log("Attempting to access training suggestions...");
    if (!user) {
      console.log("User not authenticated, redirecting to signin");
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour voir les suggestions d'entraînement",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    console.log("Redirecting to suggestions page");
    navigate('/suggestions');
  };

  const handleMealSuggestions = () => {
    console.log("Attempting to access meal suggestions...");
    if (!user) {
      console.log("User not authenticated, redirecting to signin");
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour voir les suggestions de repas",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    console.log("Redirecting to nutrition page");
    navigate('/nutrition');
  };

  return {
    handleCreateSession,
    handleAIGeneration,
    handleStats,
    handleTrainingSuggestions,
    handleMealSuggestions,
    isLoading
  };
};