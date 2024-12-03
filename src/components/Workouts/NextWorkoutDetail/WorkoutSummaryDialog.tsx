import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatWorkoutTime } from "../WorkoutTimer";
import { Clock, Dumbbell, Flame } from "lucide-react";

interface WorkoutSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    duration: number;
    totalWeight: number;
    totalCalories: number;
  };
  onConfirm: () => void;
}

export const WorkoutSummaryDialog = ({
  open,
  onOpenChange,
  stats,
  onConfirm,
}: WorkoutSummaryDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-white dark:bg-[#1E2330] border-none">
        <AlertDialogHeader className="space-y-6">
          <AlertDialogTitle className="text-2xl font-semibold text-center">
            Résumé de l'entraînement
          </AlertDialogTitle>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">
                {formatWorkoutTime(stats.duration)}
              </span>
              <span className="text-sm text-muted-foreground">Durée</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">
                {stats.totalCalories}
              </span>
              <span className="text-sm text-muted-foreground">Calories</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">
                {stats.totalWeight}
                <span className="text-sm ml-1">kg</span>
              </span>
              <span className="text-sm text-muted-foreground">Poids total</span>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            onClick={onConfirm}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
          >
            Terminer l'entraînement
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full border-primary/20 text-primary hover:bg-primary/5"
          >
            Continuer l'entraînement
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};