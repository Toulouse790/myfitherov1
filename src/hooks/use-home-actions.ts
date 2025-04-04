
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export const useHomeActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleCreateSession = () => {
    debugLogger.log("HomeActions", "Tentative de création de session d'entraînement");
    
    if (!user) {
      toast({
        title: t("auth.signIn"),
        description: t("workouts.errors.sessionFetch"),
        variant: "destructive",
      });
      navigate('/signin', { state: { from: '/workouts' } });
      return;
    }
    
    navigate('/workouts');
  };

  const handleAIGeneration = () => {
    setIsLoading(true);
    debugLogger.log("HomeActions", "Démarrage de la génération d'entraînement AI");
    
    if (!user) {
      setIsLoading(false);
      toast({
        title: t("auth.signIn"),
        description: t("workouts.errors.sessionFetch"),
        variant: "destructive",
      });
      navigate('/signin', { state: { from: '/workouts/generate' } });
      return;
    }
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/workouts/generate');
    }, 1500);
  };

  return {
    handleCreateSession,
    handleAIGeneration,
    isLoading
  };
};

export default useHomeActions;
