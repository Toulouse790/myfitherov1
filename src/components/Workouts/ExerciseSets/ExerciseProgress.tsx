import { Progress } from "@/components/ui/progress";

interface ExerciseProgressProps {
  completedSets: number;
  totalSets: number;
}

export const ExerciseProgress = ({ completedSets, totalSets }: ExerciseProgressProps) => {
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progression</span>
        <span>{completedSets}/{totalSets} séries</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};