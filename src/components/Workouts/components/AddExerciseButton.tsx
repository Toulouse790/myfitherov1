import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddExerciseForm } from "../AddExerciseForm";

interface AddExerciseButtonProps {
  onSuccess: () => void;
}

export const AddExerciseButton = ({ onSuccess }: AddExerciseButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel exercice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel exercice</DialogTitle>
        </DialogHeader>
        <AddExerciseForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};