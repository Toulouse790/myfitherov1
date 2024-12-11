import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutHeaderProps {
  sessionDuration: number;
}

export const WorkoutHeader = ({ sessionDuration }: WorkoutHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4 text-primary" />
        <span className="font-mono">
          {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};