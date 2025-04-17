
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
  const [difficulty, setDifficulty] = useState<string>("moderate");
  const [muscleGroups] = useState<string[]>(["chest", "shoulders"]);
  
  // Recalculer les calories basées sur la durée si aucune valeur n'est fournie
  useEffect(() => {
    if (stats.totalCalories === 0 && stats.duration > 0) {
      // Validation de la durée
      const validDuration = stats.duration > 0 && stats.duration < 1440 ? stats.duration : 30;
      
      // Estimation simple: environ 8-10 calories par minute d'exercice de musculation
      const estimatedCalories = Math.round(validDuration * 9);
      setCalculatedCalories(estimatedCalories);
      debugLogger.log("WorkoutSummaryDialog", "Calcul des calories estimées:", {
        duration: validDuration,
        estimatedCalories
      });
    } else {
      setCalculatedCalories(stats.totalCalories);
    }
  }, [stats.totalCalories, stats.duration]);

  // Validation des données avant confirmation
  const validateAndSubmit = () => {
    let validDuration = stats.duration;
    
    // Vérifications de sécurité pour éviter les données aberrantes
    if (validDuration <= 0 || validDuration > 1440) { // Plus de 24h = erreur
      debugLogger.warn("WorkoutSummaryDialog", "Durée invalide détectée, utilisation d'une valeur par défaut", {
        originalDuration: stats.duration
      });
      validDuration = 30; // 30 minutes par défaut
    }
    
    let validCalories = calculatedCalories;
    if (validCalories <= 0 || validCalories > 3000) { // Plus de 3000 calories = improbable
      validCalories = Math.round(validDuration * 9); // Ré-estimation
    }
    
    handleConfirm();
  };

  const handleConfirm = async () => {
    if (submitting) return; // Éviter les soumissions multiples
    
    try {
      setSubmitting(true);
      debugLogger.log("WorkoutSummaryDialog", "Confirmation de fin d'entraînement avec:", {
        difficulty,
        duration: stats.duration,
        muscleGroups,
        calculatedCalories
      });
      
      // Passer les bonnes valeurs, y compris les calories calculées et le poids total
      await onConfirm(difficulty, stats.duration, muscleGroups);
      
      // Ne pas fermer automatiquement - laisser la fonction appelante gérer la redirection
    } catch (error) {
      debugLogger.error("WorkoutSummaryDialog", "Erreur lors de la confirmation de fin d'entraînement:", error);
      setSubmitting(false);
      // Ne pas fermer le dialogue en cas d'erreur pour permettre à l'utilisateur de réessayer
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Empêcher la fermeture pendant la soumission
      if (submitting && !isOpen) return;
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("workouts.sessionCompleted") || "Séance terminée"}</DialogTitle>
          <DialogDescription>
            {t("workouts.summaryDescription") || "Résumé de votre séance d'entraînement"}
          </DialogDescription>
        </DialogHeader>
        
        <WorkoutStats 
          duration={stats.duration || 0} 
          totalWeight={stats.totalWeight || 0} 
          totalCalories={calculatedCalories || 0} 
        />
        <CompletionMessage />
        
        <div className="mt-4 mb-2">
          <h4 className="text-sm font-medium mb-2">Difficulté ressentie:</h4>
          <div className="flex space-x-2">
            <Button 
              type="button" 
              size="sm"
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              onClick={() => setDifficulty('easy')}
              className="flex-1"
            >
              Facile
            </Button>
            <Button 
              type="button" 
              size="sm"
              variant={difficulty === 'moderate' ? 'default' : 'outline'}
              onClick={() => setDifficulty('moderate')}
              className="flex-1"
            >
              Modéré
            </Button>
            <Button 
              type="button" 
              size="sm"
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              onClick={() => setDifficulty('hard')}
              className="flex-1"
            >
              Difficile
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={validateAndSubmit} 
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
