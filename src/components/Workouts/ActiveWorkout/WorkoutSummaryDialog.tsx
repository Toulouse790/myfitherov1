import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface WorkoutSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  duration: number;
}

export const WorkoutSummaryDialog = ({
  open,
  onClose,
  onConfirm,
  duration,
}: WorkoutSummaryDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Félicitations !</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-lg">
              Vous avez terminé votre séance en{" "}
              <span className="font-semibold">
                {Math.round(duration)} minutes
              </span>
            </p>
            <p className="text-muted-foreground">
              Continuez comme ça pour atteindre vos objectifs !
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} className="w-full">
            Terminer la séance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};