import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";

export interface WorkoutActionsProps {
  onConfirm: () => Promise<void>;
  onRegenerate: () => Promise<void>;
}

export const WorkoutActions = ({ onConfirm, onRegenerate }: WorkoutActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onConfirm} className="flex-1">
        <Play className="mr-2 h-4 w-4" />
        Commencer
      </Button>
      <Button onClick={onRegenerate} variant="outline" className="flex-1">
        <RefreshCw className="mr-2 h-4 w-4" />
        Régénérer
      </Button>
    </div>
  );
};