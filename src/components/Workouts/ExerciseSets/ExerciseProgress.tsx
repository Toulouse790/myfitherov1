import { Progress } from "@/components/ui/progress";

interface ExerciseProgressProps {
  completedSets: number;
  totalSets: number;
}

export const ExerciseProgress = ({ completedSets, totalSets }: ExerciseProgressProps) => {
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
    </div>
  );
};