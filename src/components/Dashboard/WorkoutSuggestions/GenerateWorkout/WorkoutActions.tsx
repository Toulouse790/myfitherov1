import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WorkoutActionsProps {
  onConfirm: () => Promise<void>;
  onRegenerate: () => Promise<void>;
}

export const WorkoutActions = ({ onConfirm, onRegenerate }: WorkoutActionsProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const { toast } = useToast();

  const handleStart = async () => {
    try {
      setIsStarting(true);
      await onConfirm();
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleStart} 
        className="flex-1"
        disabled={isStarting}
      >
        <Play className="mr-2 h-4 w-4" />
        {isStarting ? "Démarrage..." : "Commencer"}
      </Button>
      <Button 
        onClick={onRegenerate} 
        variant="outline" 
        className="flex-1"
        disabled={isStarting}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Régénérer
      </Button>
    </div>
  );
};