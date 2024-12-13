import { Button } from "@/components/ui/button";

interface WorkoutActionsProps {
  onRegenerate: () => void;
  onConfirm: () => void;
}

export const WorkoutActions = ({ onRegenerate, onConfirm }: WorkoutActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onRegenerate}>
        Regénérer
      </Button>
      <Button onClick={onConfirm}>
        Confirmer
      </Button>
    </div>
  );
};