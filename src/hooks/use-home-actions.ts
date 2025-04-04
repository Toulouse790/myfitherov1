
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export const useHomeActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleCreateSession = () => {
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
    
    if (!user) {
      setIsLoading(false);
      toast({
        title: t("auth.signIn"),
        description: t("workouts.errors.sessionFetch"),
        variant: "destructive",
      });
      navigate('/signin', { state: { from: '/workouts' } });
      return;
    }
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/workouts');
    }, 1500);
  };

  return {
    handleCreateSession,
    handleAIGeneration,
    isLoading
  };
};

export default useHomeActions;
