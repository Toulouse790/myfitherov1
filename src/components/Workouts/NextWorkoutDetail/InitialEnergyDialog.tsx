import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Battery, BatteryLow } from "lucide-react";
import { useState } from "react";

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
  const [selectedEnergy, setSelectedEnergy] = useState<"good" | "bad" | null>(null);

  const handleEnergySelect = (level: "good" | "bad") => {
    setSelectedEnergy(level);
    onEnergyLevel(level);
    if (level === "good") {
      onOpenChange(false);
    }
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
            onClick={() => handleEnergySelect("good")}
          >
            <Battery className="h-8 w-8 text-green-500" />
            <span>En forme</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 p-6"
            onClick={() => handleEnergySelect("bad")}
          >
            <BatteryLow className="h-8 w-8 text-red-500" />
            <span>Pas en forme</span>
          </Button>
        </div>

        {selectedEnergy === "bad" && (
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={onRegenerateWorkout}
              className="w-full"
            >
              Générer un nouvel entraînement adapté
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};