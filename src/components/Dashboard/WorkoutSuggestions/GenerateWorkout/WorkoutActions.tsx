
import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
    console.log("Bouton de démarrage cliqué");
    try {
      setIsStarting(true);
      await onConfirm();
      
      // Ajouter un toast de succès
      toast({
        title: "Entraînement démarré",
        description: "Votre session d'entraînement a été créée avec succès.",
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.startSessionErrorDescription") || "Impossible de démarrer la session d'entraînement",
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
        title: t("common.error") || "Erreur",
        description: "Impossible de régénérer l'entraînement",
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
        <Play className="mr-2 h-4 w-4" />
        {isStarting ? (
          <>
            <span className="animate-pulse">
              {t("workouts.startSessionLoading") || "Chargement..."}
            </span>
          </>
        ) : (
          t("workouts.startSession") || "Commencer"
        )}
      </Button>
      <Button 
        onClick={handleRegenerate} 
        variant="outline" 
        className="flex-1"
        disabled={isStarting || isRegenerating}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
        {t("workouts.regenerate") || "Régénérer"}
      </Button>
    </div>
  );
};
