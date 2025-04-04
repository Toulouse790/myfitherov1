
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
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

interface SessionHeaderProps {
  sessionName: string | null;
  sessionDuration: number;
  formatDuration: (seconds: number) => string;
  totalProgress: number;
  onFinishWorkout?: () => Promise<void>;
}

export const SessionHeader = ({ 
  sessionName,
  sessionDuration, 
  formatDuration, 
  totalProgress,
  onFinishWorkout
}: SessionHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">
          {sessionName || "Programme du jour"}
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(sessionDuration)}</span>
          </div>
          
          {onFinishWorkout && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <XCircle className="h-4 w-4 mr-1" />
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
                  <AlertDialogAction onClick={onFinishWorkout}>{t("common.confirm")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm mb-1">
          <span>Progression</span>
          <span>{totalProgress}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>
    </div>
  );
};
