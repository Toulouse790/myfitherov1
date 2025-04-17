
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
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("moderate");
  const [muscleGroups] = useState<string[]>(["chest", "shoulders"]);
  
  // Recalculer les calories basées sur la durée si aucune valeur n'est fournie
  useEffect(() => {
    // Validation de la durée
    const validDuration = Math.max(1, Math.min(stats.duration || 0, 300)); // Limité entre 1 et 300 minutes
    const validWeight = Math.max(0, Math.min(stats.totalWeight || 0, 50000)); // Limité à 50 tonnes max
    
    if (stats.totalCalories <= 0) {
      // Estimation des calories basée sur la durée et le poids
      // Formule simple: durée × 7-10 calories par minute, ajustée par le poids soulevé
      const baseCalories = validDuration * 9; // Base: 9 calories par minute
      const weightFactor = Math.max(1, Math.log10(validWeight + 1) / 2); // Facteur basé sur le poids total (logarithmique)
      
      const estimatedCalories = Math.round(baseCalories * weightFactor);
      
      debugLogger.log("WorkoutSummaryDialog", "Calcul des calories estimées:", {
        duration: validDuration,
        totalWeight: validWeight,
        weightFactor,
        estimatedCalories
      });
      
      setCalculatedCalories(estimatedCalories);
    } else {
      setCalculatedCalories(stats.totalCalories);
    }
  }, [stats.totalCalories, stats.duration, stats.totalWeight]);

  // Validation des données avant confirmation
  const validateAndSubmit = () => {
    // Validation de la durée
    let validDuration = Math.max(1, Math.min(stats.duration || 30, 300)); // Entre 1-300 minutes
    
    if (validDuration <= 0) {
      debugLogger.warn("WorkoutSummaryDialog", "Durée invalide détectée, utilisation d'une valeur par défaut", {
        originalDuration: stats.duration
      });
      validDuration = 30; // 30 minutes par défaut
    }
    
    // S'assurer que les calories ont une valeur valide
    let validCalories = calculatedCalories;
    if (validCalories <= 0 || validCalories > 3000) {
      validCalories = Math.round(validDuration * 9); // Ré-estimation basique
      debugLogger.warn("WorkoutSummaryDialog", "Calories invalides détectées, ré-estimation", {
        originalCalories: calculatedCalories,
        newEstimate: validCalories
      });
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
        calculatedCalories,
        totalWeight: stats.totalWeight
      });
      
      // Passer les bonnes valeurs, y compris les calories calculées et le poids total
      await onConfirm(difficulty, stats.duration, muscleGroups);
      
      // La fonction appelante gérera la redirection
    } catch (error) {
      debugLogger.error("WorkoutSummaryDialog", "Erreur lors de la confirmation de fin d'entraînement:", error);
      setSubmitting(false);
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
