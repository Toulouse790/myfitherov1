
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
import { useLanguage } from "@/contexts/LanguageContext";

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCreateWorkout = () => {
    setOpen(false);
    navigate("/workouts/exercise/library");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {t("workouts.newSession")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("workouts.createNewSession")}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleCreateWorkout}>
            {t("common.start")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
