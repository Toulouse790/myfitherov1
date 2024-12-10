import { Progress } from "@/components/ui/progress";

interface ExerciseProgressProps {
  currentSet: number;
  totalSets: number;
}

export const ExerciseProgress = ({ currentSet, totalSets }: ExerciseProgressProps) => {
  const progress = ((currentSet - 1) / totalSets) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progression</span>
        <span>{currentSet}/{totalSets} séries</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};