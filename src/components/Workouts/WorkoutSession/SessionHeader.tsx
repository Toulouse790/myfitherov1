
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SessionHeaderProps {
  sessionName?: string;
  sessionDuration: number;
  formatDuration: (seconds: number) => string;
  totalProgress: number;
  onFinishWorkout: () => void;
}

export const SessionHeader = ({
  sessionName = "Séance d'entraînement",
  sessionDuration,
  formatDuration,
  totalProgress,
  onFinishWorkout,
}: SessionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-lg p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{sessionName}</h1>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(sessionDuration)}</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => navigate('/workouts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Progression</span>
          <span>{totalProgress}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>
    </div>
  );
};
