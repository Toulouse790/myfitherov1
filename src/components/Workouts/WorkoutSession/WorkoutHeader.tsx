
import { Button } from "@/components/ui/button";
import { ArrowLeft, TimerIcon, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
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

interface WorkoutHeaderProps {
  sessionId?: string;
  sessionName?: string;
  sessionDuration?: number;
  formatDuration?: (seconds: number) => string;
  totalProgress?: number;
  progress?: number;
  estimatedCalories?: number;
  onFinishWorkout?: () => Promise<void>;
}

export const WorkoutHeader = ({
  sessionId,
  sessionName,
  sessionDuration = 0,
  formatDuration,
  totalProgress = 0,
  progress = 0,
  estimatedCalories = 0,
  onFinishWorkout
}: WorkoutHeaderProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Utiliser progress si totalProgress n'est pas fourni
  const displayProgress = totalProgress || progress;
  
  // Formater la durée si la fonction est fournie
  const formattedDuration = formatDuration ? formatDuration(sessionDuration) : `${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`;

  return (
    <div className="bg-background sticky top-16 z-10 pt-2 pb-4 mb-4 border-b">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/workouts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{sessionName || "Séance d'entraînement"}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-md">
            <TimerIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{formattedDuration}</span>
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
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(displayProgress)}% {t("common.completed")}</span>
          {estimatedCalories > 0 && (
            <span>{estimatedCalories} {t("workouts.calories")}</span>
          )}
        </div>
        <Progress value={displayProgress} className="h-1.5" />
      </div>
    </div>
  );
};
