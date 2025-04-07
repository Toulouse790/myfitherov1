
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
import { updateUserData } from "@/utils/api/workout-sessions/user-updates";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [calculatedCalories, setCalculatedCalories] = useState(stats.totalCalories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Recalculer les calories basées sur la durée si aucune valeur n'est fournie
  useEffect(() => {
    if (stats.totalCalories === 0 && stats.duration > 0) {
      // Estimation simple: environ 8-10 calories par minute d'exercice de musculation
      const estimatedCalories = Math.round(stats.duration * 9);
      setCalculatedCalories(estimatedCalories);
    } else {
      setCalculatedCalories(stats.totalCalories);
    }
  }, [stats.totalCalories, stats.duration]);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      debugLogger.log("WorkoutSummaryDialog", "Confirmation de la séance avec stats:", stats);
      
      // Récupérer l'ID de l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour enregistrer votre séance",
          variant: "destructive",
        });
        return;
      }
      
      // Mettre à jour les tables utilisateur associées
      const sessionId = new URLSearchParams(window.location.search).get('session');
      
      if (sessionId) {
        // Mettre à jour la session avec les statistiques finales
        const { error: sessionError } = await supabase
          .from('workout_sessions')
          .update({
            status: 'completed',
            total_duration_minutes: stats.duration,
            perceived_difficulty: 'moderate',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);
          
        if (sessionError) {
          console.error("Erreur lors de la mise à jour de la session:", sessionError);
          throw sessionError;
        }
        
        // Créer ou mettre à jour les statistiques d'entraînement
        const { error: statsError } = await supabase
          .from('training_stats')
          .upsert([{
            user_id: user.id,
            session_id: sessionId,
            total_weight_lifted: stats.totalWeight,
            calories_burned: calculatedCalories,
            session_duration_minutes: stats.duration,
            muscle_groups_worked: ["chest", "shoulders"],
            created_at: new Date().toISOString()
          }]);
          
        if (statsError) {
          console.error("Erreur lors de l'enregistrement des statistiques:", statsError);
          throw statsError;
        }
        
        // Mettre à jour toutes les données utilisateur associées
        await updateUserData(user.id, sessionId);
      }
      
      onConfirm("medium", stats.duration, ["chest", "shoulders"]);
    } catch (error) {
      console.error("Erreur lors de la finalisation de la séance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données de la séance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("workouts.sessionCompleted") || "Résumé de la séance"}</DialogTitle>
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
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Enregistrement en cours..." 
              : t("workouts.completeWorkout") || "Terminer la séance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
