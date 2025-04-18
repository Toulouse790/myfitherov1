
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateWorkout = () => {
    setOpen(false);
    navigate("/workouts/exercise/library");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Nouvelle séance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle séance</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleCreateWorkout}>
            Commencer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
