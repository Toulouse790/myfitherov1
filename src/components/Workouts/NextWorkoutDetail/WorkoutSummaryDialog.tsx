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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Résumé de la séance</DialogTitle>
        </DialogHeader>
        
        <WorkoutStats {...stats} />
        <CompletionMessage />

        <DialogFooter>
          <Button onClick={() => onConfirm("medium", stats.duration, ["chest", "shoulders"])} className="w-full">
            Terminer la séance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};