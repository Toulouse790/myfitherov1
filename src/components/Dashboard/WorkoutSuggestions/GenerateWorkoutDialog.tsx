
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionActions } from "@/hooks/workout/use-session-actions";
import { Dumbbell, Clock, ZapIcon, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workoutType?: string;
}

export const GenerateWorkoutDialog = ({ isOpen, onClose, workoutType = "" }: GenerateWorkoutDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { createWorkoutSession } = useSessionActions();
  const navigate = useNavigate();
  const [workoutTitle, setWorkoutTitle] = useState("Séance personnalisée");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("30-45 minutes");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("moderate");

  useEffect(() => {
    if (workoutType) {
      switch (workoutType) {
        case "quick":
          setWorkoutTitle("Séance rapide");
          setWorkoutDescription("3 exercices essentiels en 25 minutes");
          setWorkoutDuration("20-30 minutes");
          setWorkoutDifficulty("moderate");
          break;
        case "daily":
          setWorkoutTitle("Séance du jour");
          setWorkoutDescription("Séance adaptée à vos objectifs du jour");
          setWorkoutDuration("40-50 minutes");
          setWorkoutDifficulty("adaptive");
          break;
        case "full_body":
          setWorkoutTitle("Full body");
          setWorkoutDescription("Entraînement complet du corps");
          setWorkoutDuration("50-60 minutes");
          setWorkoutDifficulty("challenging");
          break;
        case "upper_body":
          setWorkoutTitle("Haut du corps");
          setWorkoutDescription("Focus sur le torse, les bras et les épaules");
          setWorkoutDuration("45-55 minutes");
          setWorkoutDifficulty("moderate");
          break;
        case "lower_body":
          setWorkoutTitle("Bas du corps");
          setWorkoutDescription("Renforcez vos jambes et fessiers");
          setWorkoutDuration("40-50 minutes");
          setWorkoutDifficulty("challenging");
          break;
        case "hiit":
          setWorkoutTitle("Circuit HIIT");
          setWorkoutDescription("Brûlez plus de calories en moins de temps");
          setWorkoutDuration("25-35 minutes");
          setWorkoutDifficulty("intense");
          break;
        default:
          setWorkoutTitle("Séance personnalisée");
          setWorkoutDescription("Entraînement adapté à vos besoins");
          setWorkoutDuration("30-45 minutes");
          setWorkoutDifficulty("moderate");
      }
    }
  }, [workoutType, isOpen]);

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    try {
      await createWorkoutSession(workoutType || 'custom');
      toast({
        title: "Séance générée avec succès",
        description: "Votre séance d'entraînement a été créée",
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la génération de la séance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la séance d'entraînement",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case "easy": return "text-green-600";
      case "moderate": return "text-blue-600";
      case "adaptive": return "text-blue-600";
      case "challenging": return "text-orange-600";
      case "intense": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{workoutTitle}</DialogTitle>
          <DialogDescription>{workoutDescription}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Durée</p>
              <p className="text-xs text-muted-foreground">{workoutDuration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <BarChart3 className={`h-5 w-5 ${getDifficultyColor(workoutDifficulty)}`} />
            <div>
              <p className="font-medium text-sm">Difficulté</p>
              <p className="text-xs text-muted-foreground capitalize">
                {workoutDifficulty === "easy" ? "Facile" :
                 workoutDifficulty === "moderate" ? "Modérée" :
                 workoutDifficulty === "adaptive" ? "Adaptative" :
                 workoutDifficulty === "challenging" ? "Difficile" :
                 workoutDifficulty === "intense" ? "Intense" : workoutDifficulty}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <ZapIcon className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium text-sm">Génération automatique</p>
              <p className="text-xs text-muted-foreground">
                Nous choisirons les exercices adaptés à votre niveau
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:mr-2 w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleGenerateWorkout}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2" />
                Génération...
              </>
            ) : (
              <>
                <Dumbbell className="h-4 w-4 mr-2" />
                Générer la séance
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
