
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export interface WorkoutActionsProps {
  onConfirm: () => Promise<void>;
  onRegenerate: () => Promise<void>;
}

export const WorkoutActions = ({ onConfirm, onRegenerate }: WorkoutActionsProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleStart = async () => {
    debugLogger.log("WorkoutActions", "Bouton de démarrage cliqué", {});
    try {
      setIsStarting(true);
      await onConfirm();
    } catch (error) {
      console.error('Error starting workout:', error);
      debugLogger.log("WorkoutActions", "Erreur lors du démarrage de l'entraînement:", {error});
      toast({
        title: t("common.error"),
        description: t("workouts.errors.startSessionErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      await onRegenerate();
    } catch (error) {
      console.error('Error regenerating workout:', error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionCreationError"),
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleStart} 
        className="flex-1"
        disabled={isStarting}
      >
        {isStarting ? (
          <span className="animate-pulse">
            {t("workouts.startSessionLoading")}
          </span>
        ) : (
          t("workouts.startSession")
        )}
      </Button>
      <Button 
        onClick={handleRegenerate} 
        variant="outline" 
        className="flex-1"
        disabled={isStarting || isRegenerating}
      >
        {t("workouts.regenerate")}
      </Button>
    </div>
  );
};
