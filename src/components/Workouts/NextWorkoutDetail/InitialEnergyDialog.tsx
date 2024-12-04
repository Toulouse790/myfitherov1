import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Battery, BatteryLow } from "lucide-react";

interface InitialEnergyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnergyLevel: (level: "good" | "bad") => void;
  onRegenerateWorkout: () => void;
}

export const InitialEnergyDialog = ({
  open,
  onOpenChange,
  onEnergyLevel,
  onRegenerateWorkout,
}: InitialEnergyDialogProps) => {
  const handleBadEnergy = () => {
    onEnergyLevel("bad");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Comment vous sentez-vous aujourd'hui ?</AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 p-6"
            onClick={() => {
              onEnergyLevel("good");
              onOpenChange(false);
            }}
          >
            <Battery className="h-8 w-8 text-green-500" />
            <span>En forme</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 p-6"
            onClick={() => {
              handleBadEnergy();
            }}
          >
            <BatteryLow className="h-8 w-8 text-red-500" />
            <span>Pas en forme</span>
          </Button>
        </div>

        {/* Ce bouton n'apparaît que si l'utilisateur n'est pas en forme */}
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onRegenerateWorkout}
            className="w-full"
          >
            Générer un nouvel entraînement adapté
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};