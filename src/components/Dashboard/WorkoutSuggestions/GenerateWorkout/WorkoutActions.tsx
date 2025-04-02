
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

  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleStart} 
        className="flex-1"
        disabled={isStarting}
      >
        <Play className="mr-2 h-4 w-4" />
        {isStarting ? t("workouts.startSessionLoading") : t("workouts.startSession")}
      </Button>
      <Button 
        onClick={onRegenerate} 
        variant="outline" 
        className="flex-1"
        disabled={isStarting}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {t("workouts.regenerate")}
      </Button>
    </div>
  );
};
