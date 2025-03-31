
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SessionHeaderProps {
  sessionName: string | null;
  sessionDuration: number;
  formatDuration: (seconds: number) => string;
  totalProgress: number;
}

export const SessionHeader = ({ 
  sessionName,
  sessionDuration, 
  formatDuration, 
  totalProgress 
}: SessionHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">
          {sessionName || "Programme du jour"}
        </h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDuration(sessionDuration)}</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm mb-1">
        <span>Progression</span>
        <span>{totalProgress}%</span>
      </div>
      <Progress value={totalProgress} className="h-2" />
    </div>
  );
};
