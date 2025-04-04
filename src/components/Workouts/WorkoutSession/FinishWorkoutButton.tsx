
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface FinishWorkoutButtonProps {
  onCompleteWorkout: () => Promise<void>;
}

export const FinishWorkoutButton = ({ onCompleteWorkout }: FinishWorkoutButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-8 sticky bottom-20 left-0 right-0 px-4 py-2 bg-background/80 backdrop-blur-sm">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="default"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <CheckCircle className="h-5 w-5" />
            {t("workouts.finishWorkout")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("workouts.finishWorkout")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.confirmation") || "Êtes-vous sûr de vouloir terminer cet entraînement ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={onCompleteWorkout}>{t("common.confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
