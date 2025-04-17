
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WorkoutStats } from "./WorkoutStats";
import { CompletionMessage } from "./CompletionMessage";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";
import { Loader2 } from "lucide-react";

interface WorkoutSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    duration: number;
    totalWeight: number;
    totalCalories: number;
  };
  onConfirm: (difficulty: string, duration: number, muscleGroups: string[]) => void;
}

export const WorkoutSummaryDialog = ({
  open,
  onOpenChange,
  stats,
  onConfirm,
}: WorkoutSummaryDialogProps) => {
  const { t } = useLanguage();
  const [calculatedCalories, setCalculatedCalories] = useState(stats.totalCalories);
  const [submitting, setSubmitting] = useState(false);
  const [difficulty] = useState<string>("moderate");
  const [muscleGroups] = useState<string[]>(["chest", "shoulders"]);
  
  // Recalculer les calories basées sur la durée si aucune valeur n'est fournie
  useEffect(() => {
    if (stats.totalCalories === 0 && stats.duration > 0) {
      // Estimation simple: environ 8-10 calories par minute d'exercice de musculation
      const estimatedCalories = Math.round(stats.duration * 9);
      setCalculatedCalories(estimatedCalories);
      debugLogger.log("WorkoutSummaryDialog", "Calcul des calories estimées:", {
        duration: stats.duration,
        estimatedCalories
      });
    } else {
      setCalculatedCalories(stats.totalCalories);
    }
  }, [stats.totalCalories, stats.duration]);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      debugLogger.log("WorkoutSummaryDialog", "Confirmation de fin d'entraînement avec:", {
        difficulty,
        duration: stats.duration,
        muscleGroups
      });
      
      await onConfirm(difficulty, stats.duration, muscleGroups);
    } catch (error) {
      debugLogger.error("WorkoutSummaryDialog", "Erreur lors de la confirmation de fin d'entraînement:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Empêcher la fermeture pendant la soumission
      if (submitting && !isOpen) return;
      onOpenChange(isOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("workouts.sessionCompleted") || "Séance terminée"}</DialogTitle>
        </DialogHeader>
        
        <WorkoutStats 
          duration={stats.duration || 0} 
          totalWeight={stats.totalWeight || 0} 
          totalCalories={calculatedCalories || 0} 
        />
        <CompletionMessage />

        <DialogFooter>
          <Button 
            onClick={handleConfirm} 
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>{t("common.finalizing") || "Finalisation..."}</span>
              </div>
            ) : (
              t("workouts.completeWorkout") || "Terminer la séance"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
